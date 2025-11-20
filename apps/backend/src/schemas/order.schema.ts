import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Ticket' }] })
  tickets: Types.ObjectId[];

  @Prop({ required: true })
  totalAmount: number; // in cents

  @Prop({ enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' })
  status: string;

  @Prop()
  stripePaymentIntentId?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);