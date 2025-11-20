import { Document, Types } from 'mongoose';
export type TicketDocument = Ticket & Document;
export declare class Ticket {
    event: Types.ObjectId;
    seatNumber: string;
    status: string;
    holder?: string;
    reservationExpiresAt?: Date;
    ticketToken?: string;
    qrImage?: string;
}
export declare const TicketSchema: import("mongoose").Schema<Ticket, import("mongoose").Model<Ticket, any, any, any, Document<unknown, any, Ticket, any, {}> & Ticket & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Ticket, Document<unknown, {}, import("mongoose").FlatRecord<Ticket>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Ticket> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
