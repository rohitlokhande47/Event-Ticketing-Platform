import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WaitlistEntryDocument = WaitlistEntry & Document;

@Schema({ timestamps: true })
export class WaitlistEntry {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Event' })
  event: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop({ default: false })
  notified: boolean;
}

export const WaitlistEntrySchema = SchemaFactory.createForClass(WaitlistEntry);