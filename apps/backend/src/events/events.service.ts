import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event } from '../schemas/event.schema';
import { Ticket } from '../schemas/ticket.schema';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
  ) {}

  async getAllEvents() {
    try {
      this.logger.log('Fetching all events from MongoDB');
      const events = await this.eventModel.find().lean().exec();
      this.logger.log(`Found ${events.length} events`);
      
      // Transform to ensure proper format
      return events.map((event: any) => ({
        _id: event._id?.toString() || event._id,
        name: event.name,
        date: event.date,
        venue: event.venue,
        totalSeats: event.totalSeats,
        layout: event.layout,
      }));
    } catch (error) {
      this.logger.error(`Failed to fetch events: ${error.message}`);
      throw new Error(`Failed to fetch events: ${error.message}`);
    }
  }

  async getEventById(id: string) {
    try {
      this.logger.log(`Fetching event with ID: ${id}`);
      const event = await this.eventModel.findById(id).lean().exec();
      
      if (!event) {
        this.logger.warn(`Event not found: ${id}`);
        return null;
      }

      return {
        _id: event._id?.toString() || event._id,
        name: event.name,
        date: event.date,
        venue: event.venue,
        totalSeats: event.totalSeats,
        layout: event.layout,
      };
    } catch (error) {
      this.logger.error(`Failed to fetch event: ${error.message}`);
      throw new Error(`Failed to fetch event: ${error.message}`);
    }
  }

  async getEventTickets(eventId: string) {
    try {
      this.logger.log(`Fetching tickets for event: ${eventId}`);
      
      // Try finding with string first
      let tickets = await this.ticketModel.find({ event: eventId }).exec();
      
      if (!tickets || tickets.length === 0) {
        this.logger.warn(`No tickets found with string match, trying ObjectId`);
        try {
          const objectId = new Types.ObjectId(eventId);
          tickets = await this.ticketModel.find({ event: objectId }).exec();
        } catch (err) {
          this.logger.warn(`Invalid ObjectId: ${eventId}`);
        }
      }
      
      this.logger.log(`Found ${tickets.length} tickets for event ${eventId}`);
      
      const result = tickets.map((ticket: any) => ({
        _id: ticket._id?.toString() || ticket._id,
        seatNumber: ticket.seatNumber,
        status: ticket.status,
        event: ticket.event?.toString() || ticket.event,
      }));
      
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch event tickets: ${error.message}`);
      throw new Error(`Failed to fetch event tickets: ${error.message}`);
    }
  }
}
