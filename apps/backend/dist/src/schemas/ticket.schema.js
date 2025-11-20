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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketSchema = exports.Ticket = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Ticket = class Ticket {
};
exports.Ticket = Ticket;
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'Event' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Ticket.prototype, "event", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Ticket.prototype, "seatNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['available', 'reserved', 'sold', 'used'], default: 'available' }),
    __metadata("design:type", String)
], Ticket.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Ticket.prototype, "holder", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Ticket.prototype, "reservationExpiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Ticket.prototype, "ticketToken", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Ticket.prototype, "qrImage", void 0);
exports.Ticket = Ticket = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Ticket);
exports.TicketSchema = mongoose_1.SchemaFactory.createForClass(Ticket);
exports.TicketSchema.index({ event: 1, seatNumber: 1 }, { unique: true });
//# sourceMappingURL=ticket.schema.js.map