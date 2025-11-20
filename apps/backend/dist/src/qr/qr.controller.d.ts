import { QrService } from './qr.service';
export declare class QrController {
    private readonly qrService;
    constructor(qrService: QrService);
    generate(body: {
        ticketId: string;
    }): Promise<{
        qrImage: any;
        token: string;
    }>;
    verify(token: string): Promise<{
        valid: boolean;
        ticket: import("mongoose").Document<unknown, {}, import("../schemas/ticket.schema").TicketDocument, {}, {}> & import("../schemas/ticket.schema").Ticket & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    } | {
        valid: boolean;
        ticket?: undefined;
    }>;
}
