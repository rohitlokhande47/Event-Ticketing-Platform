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
var TicketsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsController = void 0;
const common_1 = require("@nestjs/common");
const tickets_service_1 = require("./tickets.service");
let TicketsController = TicketsController_1 = class TicketsController {
    constructor(ticketsService) {
        this.ticketsService = ticketsService;
        this.logger = new common_1.Logger(TicketsController_1.name);
    }
    async reserve(body) {
        try {
            this.logger.log(`Reserve request: ${body.ticketIds.length} seats for user ${body.userId}`);
            if (!body.ticketIds || body.ticketIds.length === 0) {
                throw new common_1.HttpException('No ticket IDs provided', common_1.HttpStatus.BAD_REQUEST);
            }
            if (!body.userId) {
                throw new common_1.HttpException('No user ID provided', common_1.HttpStatus.BAD_REQUEST);
            }
            const results = await Promise.all(body.ticketIds.map((ticketId) => this.ticketsService.reserveSeat(ticketId, body.userId).catch((err) => {
                this.logger.error(`Failed to reserve ticket ${ticketId}: ${err.message}`);
                throw err;
            })));
            this.logger.log(`Successfully reserved ${results.length} seats`);
            return {
                success: true,
                message: `Successfully reserved ${results.length} seats`,
                reservedSeats: results,
            };
        }
        catch (error) {
            this.logger.error(`Reservation error: ${error.message}`);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'Failed to reserve seats', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getMyTickets(userId) {
        try {
            this.logger.log(`Fetching tickets for user: ${userId}`);
            if (!userId) {
                throw new common_1.HttpException('User ID is required', common_1.HttpStatus.BAD_REQUEST);
            }
            const tickets = await this.ticketsService.getTicketsByUserId(userId);
            this.logger.log(`Found ${tickets.length} tickets for user ${userId}`);
            return tickets;
        }
        catch (error) {
            this.logger.error(`Failed to fetch user tickets: ${error.message}`);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'Failed to fetch tickets', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.TicketsController = TicketsController;
__decorate([
    (0, common_1.Post)('reserve'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "reserve", null);
__decorate([
    (0, common_1.Get)('my-tickets'),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "getMyTickets", null);
exports.TicketsController = TicketsController = TicketsController_1 = __decorate([
    (0, common_1.Controller)('tickets'),
    __metadata("design:paramtypes", [tickets_service_1.TicketsService])
], TicketsController);
//# sourceMappingURL=tickets.controller.js.map