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
exports.WeekdayDto = exports.TimeDto = exports.AddressDto = exports.NameDto = void 0;
exports.validateAndReply = validateAndReply;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const weekday_enum_1 = require("../weekday.enum");
class NameDto {
    fullName;
}
exports.NameDto = NameDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[^\d]*$/, {
        message: '⛔️Ism raqamlardan iborat bolishi mumkin emas!',
    }),
    (0, class_validator_1.Length)(5, 50, {
        message: '⛔️Ism kamida 5 ta beldigan iborat bolishi kerak!',
    }),
    __metadata("design:type", String)
], NameDto.prototype, "fullName", void 0);
class AddressDto {
    address;
}
exports.AddressDto = AddressDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(5, 100, {
        message: '⛔️Manzil kamida 5 ta belgidan iborat bolishi kerak!',
    }),
    __metadata("design:type", String)
], AddressDto.prototype, "address", void 0);
class TimeDto {
    time;
}
exports.TimeDto = TimeDto;
__decorate([
    (0, class_validator_1.Matches)(/^\d{2}:\d{2}$/, {
        message: '⛔️Vaqt 00:00 formatida bolishi kerak!',
    }),
    __metadata("design:type", String)
], TimeDto.prototype, "time", void 0);
class WeekdayDto {
    weekday;
}
exports.WeekdayDto = WeekdayDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(weekday_enum_1.Weekdays),
    __metadata("design:type", WeekdayDto)
], WeekdayDto.prototype, "weekday", void 0);
async function validateAndReply(dtoClass, value, ctx) {
    const dto = (0, class_transformer_1.plainToInstance)(dtoClass, value);
    const errors = await (0, class_validator_1.validate)(dto);
    if (errors.length > 0) {
        const cons = errors[0].constraints;
        if (cons) {
            const fristError = Object.values(cons)[0];
            const message = fristError;
            await ctx.reply(message);
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=create-bot.dto.js.map