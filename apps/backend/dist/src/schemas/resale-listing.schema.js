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
exports.ResaleListingSchema = exports.ResaleListing = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ResaleListing = class ResaleListing {
};
exports.ResaleListing = ResaleListing;
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'Ticket' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ResaleListing.prototype, "ticket", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ResaleListing.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ResaleListing.prototype, "seller", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['active', 'sold', 'cancelled'], default: 'active' }),
    __metadata("design:type", String)
], ResaleListing.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ResaleListing.prototype, "transferCode", void 0);
exports.ResaleListing = ResaleListing = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ResaleListing);
exports.ResaleListingSchema = mongoose_1.SchemaFactory.createForClass(ResaleListing);
//# sourceMappingURL=resale-listing.schema.js.map