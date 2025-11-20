import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ResaleListingDocument = ResaleListing & Document;

@Schema({ timestamps: true })
export class ResaleListing {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Ticket' })
  ticket: Types.ObjectId;

  @Prop({ required: true })
  price: number; // in cents

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  seller: Types.ObjectId;

  @Prop({ enum: ['active', 'sold', 'cancelled'], default: 'active' })
  status: string;

  @Prop()
  transferCode?: string;
}

export const ResaleListingSchema = SchemaFactory.createForClass(ResaleListing);