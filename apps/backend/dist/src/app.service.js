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
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const ioredis_1 = require("ioredis");
let AppService = class AppService {
    constructor(connection) {
        this.connection = connection;
        this.redis = null;
        try {
            this.redis = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379', {
                tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
                lazyConnect: true,
            });
        }
        catch (error) {
            console.log('Redis connection failed, continuing without Redis');
        }
    }
    getHello() {
        return 'Hello World!';
    }
    async getHealth() {
        const mongoStatus = this.connection.readyState === 1 ? 'connected' : 'disconnected';
        let redisStatus = 'unknown';
        if (this.redis) {
            try {
                await this.redis.ping();
                redisStatus = 'connected';
            }
            catch (error) {
                redisStatus = 'disconnected';
            }
        }
        else {
            redisStatus = 'not initialized';
        }
        return {
            status: 'ok',
            mongo: mongoStatus,
            redis: redisStatus,
        };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_1.Connection])
], AppService);
//# sourceMappingURL=app.service.js.map