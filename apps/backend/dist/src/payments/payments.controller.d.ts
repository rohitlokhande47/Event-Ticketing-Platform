import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createIntent(body: {
        ticketIds: string[];
        userId: string;
    }): Promise<{
        clientSecret: string;
        orderId: import("mongoose").Types.ObjectId;
    }>;
    confirm(body: {
        orderId: string;
    }): Promise<{
        success: boolean;
    }>;
}
