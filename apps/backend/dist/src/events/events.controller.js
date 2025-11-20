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
var EventsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsController = void 0;
const common_1 = require("@nestjs/common");
const events_service_1 = require("./events.service");
let EventsController = EventsController_1 = class EventsController {
    constructor(eventsService) {
        this.eventsService = eventsService;
        this.logger = new common_1.Logger(EventsController_1.name);
    }
    async getAllEvents() {
        try {
            this.logger.log('GET /events - Fetching all events');
            const events = await this.eventsService.getAllEvents();
            this.logger.log(`Successfully returned ${events.length} events`);
            return events;
        }
        catch (error) {
            this.logger.error(`Error in getAllEvents: ${error.message}`);
            throw error;
        }
    }
    async getEventById(id) {
        try {
            this.logger.log(`GET /events/:id - Fetching event ${id}`);
            const event = await this.eventsService.getEventById(id);
            return event;
        }
        catch (error) {
            this.logger.error(`Error in getEventById: ${error.message}`);
            throw error;
        }
    }
    async getEventTickets(eventId) {
        try {
            this.logger.log(`GET /events/:id/tickets - Fetching tickets for ${eventId}`);
            return this.eventsService.getEventTickets(eventId);
        }
        catch (error) {
            this.logger.error(`Error in getEventTickets: ${error.message}`);
            throw error;
        }
    }
};
exports.EventsController = EventsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getAllEvents", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getEventById", null);
__decorate([
    (0, common_1.Get)(':id/tickets'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getEventTickets", null);
exports.EventsController = EventsController = EventsController_1 = __decorate([
    (0, common_1.Controller)('events'),
    __metadata("design:paramtypes", [events_service_1.EventsService])
], EventsController);
//# sourceMappingURL=events.controller.js.map