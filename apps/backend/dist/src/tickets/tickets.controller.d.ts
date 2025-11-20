import { TicketsService } from './tickets.service';
export declare class TicketsController {
    private readonly ticketsService;
    private readonly logger;
    constructor(ticketsService: TicketsService);
    reserve(body: {
        ticketIds: string[];
        userId: string;
    }): Promise<{
        success: boolean;
        message: string;
        reservedSeats: (import("mongoose").Document<unknown, {}, import("../schemas/ticket.schema").TicketDocument, {}, {}> & import("../schemas/ticket.schema").Ticket & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    getMyTickets(userId: string): Promise<{
        _id: any;
        event: any;
        seatNumber: any;
        status: any;
        ticketToken: any;
        qrImage: any;
    }[]>;
}
