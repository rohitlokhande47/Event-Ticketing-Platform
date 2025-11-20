import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import { Ticket, TicketDocument } from '../schemas/ticket.schema';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
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
    try {
      const tickets = await this.ticketModel.find({ _id: { $in: ticketIds } });
      if (tickets.length !== ticketIds.length) {
        throw new Error('Some tickets not found');
      }

      const total = tickets.reduce((sum, ticket) => sum + 5000, 0); // $50 per ticket in cents

      this.logger.log(`Creating Stripe payment intent for $${total / 100}`);
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: total,
        currency: 'usd',
        metadata: { userId, ticketCount: tickets.length.toString() },
        description: `${tickets.length} event ticket(s)`,
      });

      const order = new this.orderModel({
        user: userId,
        tickets: ticketIds,
        totalAmount: total,
        stripePaymentIntentId: paymentIntent.id,
        status: 'pending',
      });
      await order.save();

      this.logger.log(`Order created: ${order._id}`);
      return { 
        clientSecret: paymentIntent.client_secret, 
        orderId: order._id.toString(),
        amount: total 
      };
    } catch (error) {
      this.logger.error(`Error creating payment intent: ${error.message}`);
      throw error;
    }
  }

  async getOrder(orderId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new Error('Order not found');
    return {
      _id: order._id.toString(),
      tickets: order.tickets,
      totalAmount: order.totalAmount,
      status: order.status,
    };
  }

  async getOrderWithClientSecret(orderId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new Error('Order not found');

    const paymentIntent = await this.stripe.paymentIntents.retrieve(order.stripePaymentIntentId);
    
    return {
      _id: order._id.toString(),
      tickets: order.tickets,
      totalAmount: order.totalAmount,
      status: order.status,
      clientSecret: paymentIntent.client_secret,
    };
  }

  async confirmPayment(orderId: string) {
    try {
      const order = await this.orderModel.findById(orderId);
      if (!order) throw new Error('Order not found');

      this.logger.log(`Confirming payment for order ${orderId}`);

      // Check payment intent status
      const paymentIntent = await this.stripe.paymentIntents.retrieve(order.stripePaymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        this.logger.log(`Payment succeeded for order ${orderId}`);
        
        order.status = 'paid';
        await order.save();

        // Mark tickets as sold and set holder
        await this.ticketModel.updateMany(
          { _id: { $in: order.tickets } },
          { 
            status: 'sold',
            holder: order.user.toString()
          }
        );

        this.logger.log(`Updated ${order.tickets.length} tickets to sold status`);

        return { 
          success: true, 
          message: 'Payment confirmed and tickets issued',
          orderId: order._id.toString()
        };
      } else {
        throw new Error(`Payment not completed. Status: ${paymentIntent.status}`);
      }
    } catch (error) {
      this.logger.error(`Error confirming payment: ${error.message}`);
      throw error;
    }
  }
}