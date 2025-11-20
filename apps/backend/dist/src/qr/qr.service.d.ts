import { Model } from 'mongoose';
import { Ticket, TicketDocument } from '../schemas/ticket.schema';
export declare class QrService {
    private ticketModel;
    constructor(ticketModel: Model<TicketDocument>);
    generateQr(ticketId: string): Promise<{
        qrImage: any;
        token: string;
    }>;
    verifyQr(token: string): Promise<{
        valid: boolean;
        ticket: import("mongoose").Document<unknown, {}, TicketDocument, {}, {}> & Ticket & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    } | {
        valid: boolean;
        ticket?: undefined;
    }>;
}
