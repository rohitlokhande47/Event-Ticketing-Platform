import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  venue: string;

  @Prop({ required: true })
  totalSeats: number;

  @Prop({ type: Object }) // For seat layout, e.g., { rows: 10, cols: 20 }
  layout?: any;
}

export const EventSchema = SchemaFactory.createForClass(Event);