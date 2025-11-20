import { Model } from 'mongoose';
import { Ticket, TicketDocument } from '../schemas/ticket.schema';
export declare class TicketsService {
    private ticketModel;
    private readonly logger;
    private redis;
    private redlock;
    private redisAvailable;
    constructor(ticketModel: Model<TicketDocument>);
    private initializeRedis;
    reserveSeat(ticketId: string, userId: string): Promise<import("mongoose").Document<unknown, {}, TicketDocument, {}, {}> & Ticket & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    private releaseExpiredReservation;
    getTicketsByUserId(userId: string): Promise<{
        _id: any;
        event: any;
        seatNumber: any;
        status: any;
        ticketToken: any;
    }[]>;
}
