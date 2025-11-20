import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-intent')
  async createIntent(@Body() body: { ticketIds: string[]; userId: string }) {
    return this.paymentsService.createPaymentIntent(body.ticketIds, body.userId);
  }

  @Post('confirm')
  async confirm(@Body() body: { orderId: string }) {
    return this.paymentsService.confirmPayment(body.orderId);
  }
}