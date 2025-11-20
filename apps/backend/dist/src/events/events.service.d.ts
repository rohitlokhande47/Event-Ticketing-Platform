import { Model, Types } from 'mongoose';
import { Event } from '../schemas/event.schema';
import { Ticket } from '../schemas/ticket.schema';
export declare class EventsService {
    private eventModel;
    private ticketModel;
    private readonly logger;
    constructor(eventModel: Model<Event>, ticketModel: Model<Ticket>);
    getAllEvents(): Promise<{
        _id: any;
        name: any;
        date: any;
        venue: any;
        totalSeats: any;
        layout: any;
    }[]>;
    getEventById(id: string): Promise<{
        _id: string | Types.ObjectId;
        name: string;
        date: Date;
        venue: string;
        totalSeats: number;
        layout: any;
    }>;
    getEventTickets(eventId: string): Promise<{
        _id: any;
        seatNumber: any;
        status: any;
        event: any;
    }[]>;
}
