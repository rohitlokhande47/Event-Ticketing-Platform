import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import { Ticket, TicketDocument } from '../schemas/ticket.schema';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(ticketIds: string[], userId: string) {
    const tickets = await this.ticketModel.find({ _id: { $in: ticketIds } });
    const total = tickets.reduce((sum, ticket) => sum + 5000, 0); // $50 per ticket in cents

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: total,
      currency: 'usd',
      metadata: { userId },
    });

    const order = new this.orderModel({
      user: userId,
      tickets: ticketIds,
      totalAmount: total,
      stripePaymentIntentId: paymentIntent.id,
    });
    await order.save();

    return { clientSecret: paymentIntent.client_secret, orderId: order._id };
  }

  async confirmPayment(orderId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new Error('Order not found');

    // Confirm payment intent
    const paymentIntent = await this.stripe.paymentIntents.retrieve(order.stripePaymentIntentId);
    if (paymentIntent.status === 'succeeded') {
      order.status = 'paid';
      await order.save();

      // Mark tickets as sold
      await this.ticketModel.updateMany(
        { _id: { $in: order.tickets } },
        { status: 'sold' }
      );

      return { success: true };
    }
    throw new Error('Payment not completed');
  }
}