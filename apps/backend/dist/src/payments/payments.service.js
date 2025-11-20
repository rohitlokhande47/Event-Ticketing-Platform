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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("../schemas/order.schema");
const ticket_schema_1 = require("../schemas/ticket.schema");
const stripe_1 = require("stripe");
let PaymentsService = class PaymentsService {
    constructor(orderModel, ticketModel) {
        this.orderModel = orderModel;
        this.ticketModel = ticketModel;
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2023-10-16',
        });
    }
    async createPaymentIntent(ticketIds, userId) {
        const tickets = await this.ticketModel.find({ _id: { $in: ticketIds } });
        const total = tickets.reduce((sum, ticket) => sum + 5000, 0);
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
    async confirmPayment(orderId) {
        const order = await this.orderModel.findById(orderId);
        if (!order)
            throw new Error('Order not found');
        const paymentIntent = await this.stripe.paymentIntents.retrieve(order.stripePaymentIntentId);
        if (paymentIntent.status === 'succeeded') {
            order.status = 'paid';
            await order.save();
            await this.ticketModel.updateMany({ _id: { $in: order.tickets } }, { status: 'sold' });
            return { success: true };
        }
        throw new Error('Payment not completed');
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(1, (0, mongoose_1.InjectModel)(ticket_schema_1.Ticket.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map