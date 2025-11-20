import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QrService } from './qr.service';
import { QrController } from './qr.controller';
import { Ticket, TicketSchema } from '../schemas/ticket.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }])],
  controllers: [QrController],
  providers: [QrService],
  exports: [QrService],
})
export class QrModule {}