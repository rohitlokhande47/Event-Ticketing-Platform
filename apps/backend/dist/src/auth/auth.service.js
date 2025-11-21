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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
let AuthService = class AuthService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async signup(name, email, password) {
        const existingUser = await this.userModel.findOne({
            email: email.toLowerCase(),
        });
        if (existingUser) {
            throw new Error('Email already registered');
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = new this.userModel({
            name: name.trim(),
            email: email.toLowerCase(),
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const savedUser = await user.save();
        const token = jsonwebtoken_1.default.sign({
            id: savedUser._id.toString(),
            email: savedUser.email,
            name: savedUser.name,
        }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
        return {
            token,
            user: {
                id: savedUser._id.toString(),
                name: savedUser.name,
                email: savedUser.email,
            },
        };
    }
    async signin(email, password) {
        const user = await this.userModel.findOne({
            email: email.toLowerCase(),
        });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        const token = jsonwebtoken_1.default.sign({
            id: user._id.toString(),
            email: user.email,
            name: user.name,
        }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
        return {
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AuthService);
//# sourceMappingURL=auth.service.js.map