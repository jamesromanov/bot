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
exports.BotSchema = exports.Bot = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Bot = class Bot {
    fullName;
    address;
    userId;
    time;
    weekday;
    createdAt;
};
exports.Bot = Bot;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Bot.prototype, "fullName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Bot.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Bot.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Bot.prototype, "time", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Bot.prototype, "weekday", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Bot.prototype, "createdAt", void 0);
exports.Bot = Bot = __decorate([
    (0, mongoose_1.Schema)()
], Bot);
exports.BotSchema = mongoose_1.SchemaFactory.createForClass(Bot);
//# sourceMappingURL=bot.entity.js.map