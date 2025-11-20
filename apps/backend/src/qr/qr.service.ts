import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket, TicketDocument } from '../schemas/ticket.schema';
import * as QRCode from 'qrcode';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class QrService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
  ) {}

  async generateQr(ticketId: string) {
    const ticket = await this.ticketModel.findById(ticketId);
    if (!ticket) throw new Error('Ticket not found');

    const token = jwt.sign(
      { ticketId: ticket._id, userId: ticket.holder },
      process.env.JWT_SECRET!,
      { expiresIn: '2y' }
    );

    ticket.ticketToken = token;
    await ticket.save();

    const qrUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/verify/${token}`;
    const qrImage = await QRCode.toDataURL(qrUrl);

    return { qrImage, token };
  }

  async verifyQr(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const ticket = await this.ticketModel.findById(decoded.ticketId);
      if (ticket && ticket.status === 'sold') {
        ticket.status = 'used';
        await ticket.save();
        return { valid: true, ticket };
      }
      return { valid: false };
    } catch (error) {
      return { valid: false };
    }
  }
}