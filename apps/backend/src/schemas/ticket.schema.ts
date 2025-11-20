import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TicketDocument = Ticket & Document;

@Schema({ timestamps: true })
export class Ticket {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Event' })
  event: Types.ObjectId;

  @Prop({ required: true })
  seatNumber: string;

  @Prop({ enum: ['available', 'reserved', 'sold', 'used'], default: 'available' })
  status: string;

  @Prop({ type: String }) // Accept string or ObjectId for user ID
  holder?: string;

  @Prop()
  reservationExpiresAt?: Date;

  @Prop()
  ticketToken?: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
TicketSchema.index({ event: 1, seatNumber: 1 }, { unique: true });