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
var TicketsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const ticket_schema_1 = require("../schemas/ticket.schema");
const ioredis_1 = require("ioredis");
const redlock_1 = require("redlock");
let TicketsService = TicketsService_1 = class TicketsService {
    constructor(ticketModel) {
        this.ticketModel = ticketModel;
        this.logger = new common_1.Logger(TicketsService_1.name);
        this.redis = null;
        this.redlock = null;
        this.redisAvailable = false;
        this.initializeRedis();
    }
    initializeRedis() {
        try {
            const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
            const isTls = process.env.REDIS_TLS === 'true';
            this.redis = new ioredis_1.default(redisUrl, {
                tls: isTls ? {} : undefined,
                lazyConnect: true,
                maxRetriesPerRequest: null,
                enableReadyCheck: false,
                enableOfflineQueue: false,
                connectTimeout: 5000,
                retryStrategy: () => null,
            });
            this.redis.on('error', (err) => {
                this.logger.warn(`Redis connection error: ${err.message}`);
                this.redisAvailable = false;
            });
            this.redis.on('connect', () => {
                this.logger.log('Redis connected');
                this.redisAvailable = true;
            });
            this.redlock = new redlock_1.default([this.redis], {
                retryCount: 0,
                retryJitter: 0,
            });
        }
        catch (error) {
            this.logger.warn(`Redis initialization error: ${error.message}. Continuing without Redis.`);
            this.redis = null;
            this.redlock = null;
            this.redisAvailable = false;
        }
    }
    async reserveSeat(ticketId, userId) {
        try {
            this.logger.log(`Reserving ticket ${ticketId} for user ${userId}`);
            const ticket = await this.ticketModel.findById(ticketId);
            if (!ticket) {
                throw new Error(`Ticket ${ticketId} not found`);
            }
            if (ticket.status !== 'available') {
                throw new Error(`Seat ${ticket.seatNumber} not available (status: ${ticket.status})`);
            }
            if (this.redlock && this.redisAvailable) {
                try {
                    this.logger.log(`Attempting to acquire Redlock for ${ticketId}`);
                    const lock = await this.redlock.acquire([`locks:ticket:${ticketId}`], 10 * 60 * 1000);
                    try {
                        const currentTicket = await this.ticketModel.findById(ticketId);
                        if (!currentTicket || currentTicket.status !== 'available') {
                            throw new Error(`Seat no longer available`);
                        }
                        currentTicket.status = 'reserved';
                        currentTicket.holder = userId;
                        currentTicket.reservationExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
                        await currentTicket.save();
                        this.logger.log(`Ticket ${ticketId} reserved with Redlock`);
                        setTimeout(() => this.releaseExpiredReservation(ticketId), 10 * 60 * 1000);
                        return currentTicket;
                    }
                    finally {
                        await lock.release();
                    }
                }
                catch (lockError) {
                    this.logger.warn(`Redlock failed: ${lockError.message}. Using fallback.`);
                }
            }
            this.logger.log(`Using simple reservation (no Redis)`);
            ticket.status = 'reserved';
            ticket.holder = userId;
            ticket.reservationExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
            await ticket.save();
            this.logger.log(`Ticket ${ticketId} reserved successfully (fallback mode)`);
            setTimeout(() => this.releaseExpiredReservation(ticketId), 10 * 60 * 1000);
            return ticket;
        }
        catch (error) {
            this.logger.error(`Error reserving ticket ${ticketId}: ${error.message}`);
            throw error;
        }
    }
    async releaseExpiredReservation(ticketId) {
        try {
            const ticket = await this.ticketModel.findById(ticketId);
            if (ticket && ticket.status === 'reserved' && ticket.reservationExpiresAt && ticket.reservationExpiresAt < new Date()) {
                ticket.status = 'available';
                ticket.holder = undefined;
                ticket.reservationExpiresAt = undefined;
                await ticket.save();
                this.logger.log(`Released expired reservation for ticket ${ticketId}`);
            }
        }
        catch (error) {
            this.logger.error(`Error releasing expired reservation: ${error.message}`);
        }
    }
    async getTicketsByUserId(userId) {
        try {
            this.logger.log(`Fetching tickets for user: ${userId}`);
            const tickets = await this.ticketModel
                .find({ holder: userId })
                .lean()
                .exec();
            return tickets.map((ticket) => ({
                _id: ticket._id?.toString() || ticket._id,
                event: ticket.event?.toString() || ticket.event,
                seatNumber: ticket.seatNumber,
                status: ticket.status,
                ticketToken: ticket.ticketToken,
            }));
        }
        catch (error) {
            this.logger.error(`Error fetching user tickets: ${error.message}`);
            throw error;
        }
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = TicketsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(ticket_schema_1.Ticket.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map