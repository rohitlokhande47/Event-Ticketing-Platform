import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from '../schemas/event.schema';
import { Ticket, TicketSchema } from '../schemas/ticket.schema';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Ticket.name, schema: TicketSchema },
    ]),
  ],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
