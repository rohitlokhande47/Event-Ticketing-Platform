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
exports.QrService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const ticket_schema_1 = require("../schemas/ticket.schema");
const QRCode = require("qrcode");
const jwt = require("jsonwebtoken");
let QrService = class QrService {
    constructor(ticketModel) {
        this.ticketModel = ticketModel;
    }
    async generateQr(ticketId) {
        const ticket = await this.ticketModel.findById(ticketId);
        if (!ticket)
            throw new Error('Ticket not found');
        const token = jwt.sign({ ticketId: ticket._id, userId: ticket.holder }, process.env.JWT_SECRET, { expiresIn: '2y' });
        ticket.ticketToken = token;
        await ticket.save();
        const qrUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/verify/${token}`;
        const qrImage = await QRCode.toDataURL(qrUrl);
        return { qrImage, token };
    }
    async verifyQr(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const ticket = await this.ticketModel.findById(decoded.ticketId);
            if (ticket && ticket.status === 'sold') {
                ticket.status = 'used';
                await ticket.save();
                return { valid: true, ticket };
            }
            return { valid: false };
        }
        catch (error) {
            return { valid: false };
        }
    }
};
exports.QrService = QrService;
exports.QrService = QrService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(ticket_schema_1.Ticket.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], QrService);
//# sourceMappingURL=qr.service.js.map