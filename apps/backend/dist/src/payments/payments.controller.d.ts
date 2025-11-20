import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    private readonly logger;
    constructor(paymentsService: PaymentsService);
    createIntent(body: {
        ticketIds: string[];
        userId: string;
    }): Promise<{
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
    getOrderWithSecret(orderId: string): Promise<{
        _id: string;
        tickets: import("mongoose").Types.ObjectId[];
        totalAmount: number;
        status: string;
        clientSecret: string;
    }>;
    confirm(body: {
        orderId: string;
    }): Promise<{
        success: boolean;
        message: string;
        orderId: string;
    }>;
}
