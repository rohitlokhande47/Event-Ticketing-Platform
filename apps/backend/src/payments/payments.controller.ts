import { Controller, Post, Body, Get, Param, Logger } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-intent')
  async createIntent(@Body() body: { ticketIds: string[]; userId: string }) {
    this.logger.log(`Creating payment intent for user ${body.userId} with ${body.ticketIds.length} tickets`);
    return this.paymentsService.createPaymentIntent(body.ticketIds, body.userId);
  }

  @Get('order/:orderId')
  async getOrder(@Param('orderId') orderId: string) {
    this.logger.log(`Fetching order ${orderId}`);
    return this.paymentsService.getOrder(orderId);
  }

  @Get('get-order/:orderId')
  async getOrderWithSecret(@Param('orderId') orderId: string) {
    this.logger.log(`Fetching order with client secret ${orderId}`);
    return this.paymentsService.getOrderWithClientSecret(orderId);
  }

  @Post('confirm')
  async confirm(@Body() body: { orderId: string }) {
    this.logger.log(`Confirming payment for order ${body.orderId}`);
    return this.paymentsService.confirmPayment(body.orderId);
  }
}