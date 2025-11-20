import { Model } from 'mongoose';
import { OrderDocument } from '../schemas/order.schema';
import { TicketDocument } from '../schemas/ticket.schema';
export declare class PaymentsService {
    private orderModel;
    private ticketModel;
    private stripe;
    constructor(orderModel: Model<OrderDocument>, ticketModel: Model<TicketDocument>);
    createPaymentIntent(ticketIds: string[], userId: string): Promise<{
        clientSecret: string;
        orderId: import("mongoose").Types.ObjectId;
    }>;
    confirmPayment(orderId: string): Promise<{
        success: boolean;
    }>;
}
