import { Controller, Get, Param, Logger } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async getAllEvents() {
    try {
      this.logger.log('GET /events - Fetching all events');
      const events = await this.eventsService.getAllEvents();
      this.logger.log(`Successfully returned ${events.length} events`);
      return events;
    } catch (error) {
      this.logger.error(`Error in getAllEvents: ${error.message}`);
      throw error;
    }
  }

  @Get(':id')
  async getEventById(@Param('id') id: string) {
    try {
      this.logger.log(`GET /events/:id - Fetching event ${id}`);
      const event = await this.eventsService.getEventById(id);
      return event;
    } catch (error) {
      this.logger.error(`Error in getEventById: ${error.message}`);
      throw error;
    }
  }

  @Get(':id/tickets')
  async getEventTickets(@Param('id') eventId: string) {
    try {
      this.logger.log(`GET /events/:id/tickets - Fetching tickets for ${eventId}`);
      return this.eventsService.getEventTickets(eventId);
    } catch (error) {
      this.logger.error(`Error in getEventTickets: ${error.message}`);
      throw error;
    }
  }
}
