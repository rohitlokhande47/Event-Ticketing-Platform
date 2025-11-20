"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("../schemas/order.schema");
const ticket_schema_1 = require("../schemas/ticket.schema");
const stripe_1 = require("stripe");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(orderModel, ticketModel) {
        this.orderModel = orderModel;
        this.ticketModel = ticketModel;
        this.logger = new common_1.Logger(PaymentsService_1.name);
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2023-10-16',
        });
    }
    async createPaymentIntent(ticketIds, userId) {
        try {
            const tickets = await this.ticketModel.find({ _id: { $in: ticketIds } });
            if (tickets.length !== ticketIds.length) {
                throw new Error('Some tickets not found');
            }
            const total = tickets.reduce((sum, ticket) => sum + 5000, 0);
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
        }
        catch (error) {
            this.logger.error(`Error creating payment intent: ${error.message}`);
            throw error;
        }
    }
    async getOrder(orderId) {
        const order = await this.orderModel.findById(orderId);
        if (!order)
            throw new Error('Order not found');
        return {
            _id: order._id.toString(),
            tickets: order.tickets,
            totalAmount: order.totalAmount,
            status: order.status,
        };
    }
    async getOrderWithClientSecret(orderId) {
        const order = await this.orderModel.findById(orderId);
        if (!order)
            throw new Error('Order not found');
        const paymentIntent = await this.stripe.paymentIntents.retrieve(order.stripePaymentIntentId);
        return {
            _id: order._id.toString(),
            tickets: order.tickets,
            totalAmount: order.totalAmount,
            status: order.status,
            clientSecret: paymentIntent.client_secret,
        };
    }
    async confirmPayment(orderId) {
        try {
            const order = await this.orderModel.findById(orderId);
            if (!order)
                throw new Error('Order not found');
            this.logger.log(`Confirming payment for order ${orderId}`);
            const paymentIntent = await this.stripe.paymentIntents.retrieve(order.stripePaymentIntentId);
            if (paymentIntent.status === 'succeeded') {
                this.logger.log(`Payment succeeded for order ${orderId}`);
                order.status = 'paid';
                await order.save();
                await this.ticketModel.updateMany({ _id: { $in: order.tickets } }, {
                    status: 'sold',
                    holder: order.user.toString()
                });
                this.logger.log(`Updated ${order.tickets.length} tickets to sold status`);
                return {
                    success: true,
                    message: 'Payment confirmed and tickets issued',
                    orderId: order._id.toString()
                };
            }
            else {
                throw new Error(`Payment not completed. Status: ${paymentIntent.status}`);
            }
        }
        catch (error) {
            this.logger.error(`Error confirming payment: ${error.message}`);
            throw error;
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(1, (0, mongoose_1.InjectModel)(ticket_schema_1.Ticket.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map