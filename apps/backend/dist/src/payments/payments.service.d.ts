import { Model } from 'mongoose';
import { OrderDocument } from '../schemas/order.schema';
import { TicketDocument } from '../schemas/ticket.schema';
export declare class PaymentsService {
    private orderModel;
    private ticketModel;
    private readonly logger;
    private stripe;
    constructor(orderModel: Model<OrderDocument>, ticketModel: Model<TicketDocument>);
    createPaymentIntent(ticketIds: string[], userId: string): Promise<{
        clientSecret: string;
        orderId: string;
        amount: number;
    }>;
    getOrder(orderId: string): Promise<{
        _id: string;
        tickets: import("mongoose").Types.ObjectId[];
        totalAmount: number;
        status: string;
    }>;
    getOrderWithClientSecret(orderId: string): Promise<{
        _id: string;
        tickets: import("mongoose").Types.ObjectId[];
        totalAmount: number;
        status: string;
        clientSecret: string;
    }>;
    confirmPayment(orderId: string): Promise<{
        success: boolean;
        message: string;
        orderId: string;
    }>;
}
