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
var EventsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const event_schema_1 = require("../schemas/event.schema");
const ticket_schema_1 = require("../schemas/ticket.schema");
let EventsService = EventsService_1 = class EventsService {
    constructor(eventModel, ticketModel) {
        this.eventModel = eventModel;
        this.ticketModel = ticketModel;
        this.logger = new common_1.Logger(EventsService_1.name);
    }
    async getAllEvents() {
        try {
            this.logger.log('Fetching all events from MongoDB');
            const events = await this.eventModel.find().lean().exec();
            this.logger.log(`Found ${events.length} events`);
            return events.map((event) => ({
                _id: event._id?.toString() || event._id,
                name: event.name,
                date: event.date,
                venue: event.venue,
                totalSeats: event.totalSeats,
                layout: event.layout,
            }));
        }
        catch (error) {
            this.logger.error(`Failed to fetch events: ${error.message}`);
            throw new Error(`Failed to fetch events: ${error.message}`);
        }
    }
    async getEventById(id) {
        try {
            this.logger.log(`Fetching event with ID: ${id}`);
            const event = await this.eventModel.findById(id).lean().exec();
            if (!event) {
                this.logger.warn(`Event not found: ${id}`);
                return null;
            }
            return {
                _id: event._id?.toString() || event._id,
                name: event.name,
                date: event.date,
                venue: event.venue,
                totalSeats: event.totalSeats,
                layout: event.layout,
            };
        }
        catch (error) {
            this.logger.error(`Failed to fetch event: ${error.message}`);
            throw new Error(`Failed to fetch event: ${error.message}`);
        }
    }
    async getEventTickets(eventId) {
        try {
            this.logger.log(`Fetching tickets for event: ${eventId}`);
            let tickets = await this.ticketModel.find({ event: eventId }).exec();
            if (!tickets || tickets.length === 0) {
                this.logger.warn(`No tickets found with string match, trying ObjectId`);
                try {
                    const objectId = new mongoose_2.Types.ObjectId(eventId);
                    tickets = await this.ticketModel.find({ event: objectId }).exec();
                }
                catch (err) {
                    this.logger.warn(`Invalid ObjectId: ${eventId}`);
                }
            }
            this.logger.log(`Found ${tickets.length} tickets for event ${eventId}`);
            const result = tickets.map((ticket) => ({
                _id: ticket._id?.toString() || ticket._id,
                seatNumber: ticket.seatNumber,
                status: ticket.status,
                event: ticket.event?.toString() || ticket.event,
            }));
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to fetch event tickets: ${error.message}`);
            throw new Error(`Failed to fetch event tickets: ${error.message}`);
        }
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = EventsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(event_schema_1.Event.name)),
    __param(1, (0, mongoose_1.InjectModel)(ticket_schema_1.Ticket.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], EventsService);
//# sourceMappingURL=events.service.js.map