import { EventsService } from './events.service';
export declare class EventsController {
    private readonly eventsService;
    private readonly logger;
    constructor(eventsService: EventsService);
    getAllEvents(): Promise<{
        _id: any;
        name: any;
        date: any;
        venue: any;
        totalSeats: any;
        layout: any;
    }[]>;
    getEventById(id: string): Promise<{
        _id: string | import("mongoose").Types.ObjectId;
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
