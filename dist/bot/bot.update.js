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
exports.BotUpdate = void 0;
const nestjs_telegraf_1 = require("nestjs-telegraf");
const telegraf_1 = require("telegraf");
const mongoose_1 = require("@nestjs/mongoose");
const bot_entity_1 = require("./entities/bot.entity");
const mongoose_2 = require("mongoose");
const create_bot_dto_1 = require("./dto/create-bot.dto");
const common_1 = require("@nestjs/common");
const show_pagination_1 = require("./show.pagination");
let BotUpdate = class BotUpdate {
    botModel;
    constructor(botModel) {
        this.botModel = botModel;
    }
    async start(ctx) {
        await ctx.replyWithPhoto('https://i.ytimg.com/vi/NYLAozGiDvw/maxresdefault.jpg');
        await ctx.react('⚡');
        await ctx.reply('Assalomu alaikum botga xush kelibsiz!');
        await ctx.reply('Hizmat Tanlang:', telegraf_1.Markup.keyboard([
            '📅 Yangi uchrashuv',
            '🗓 Uchrashuvlarim',
            '📞 Bog‘lanish',
        ])
            .oneTime()
            .resize());
    }
    async contact(ctx) {
        await ctx.reply('Boglanish uchun telefon raqamingizni qoldiring!', telegraf_1.Markup.keyboard([telegraf_1.Markup.button.contactRequest('Contact ulashish!')])
            .oneTime()
            .resize());
    }
    async receiveContent(ctx) {
        const { contact } = { ...ctx?.message };
        if (!contact)
            return;
        if (!process.env.ADMIN)
            throw new Error('Couldnt load env variables!');
        await ctx.telegram.sendMessage(process.env.ADMIN, `👤 Ismi: ${contact.first_name}
📞 Raqami: ${contact.phone_number}`);
        await ctx.reply('✅Sizning raqamingiz muvaffaqyatli yuborildi', telegraf_1.Markup.removeKeyboard());
    }
    async showMeetings(ctx) {
        const userId = ctx.from?.id;
        const meetings = await this.botModel.find({ userId });
        console.log(meetings);
        if (!meetings || meetings.length === 0)
            return ctx.reply('🗓 Sizda hech qanday uchrashuvlar mavjud emas!');
        ctx.session.meetingsPage = 0;
        ctx.session.meetings = meetings;
        return (0, show_pagination_1.showPagination)(ctx);
    }
    async pagination(ctx) {
        if (ctx.session.meetings?.length) {
            await ctx.answerCbQuery();
            const current = ctx.session.meetingsPage || 0;
            if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
                const action = ctx.callbackQuery?.data;
                if (action === 'preview') {
                    ctx.session.meetingsPage = current - 1;
                }
                if (action === 'next') {
                    ctx.session.meetingsPage = current + 1;
                }
                return (0, show_pagination_1.showPagination)(ctx);
            }
        }
    }
    async saveName(ctx) {
        ctx.session.step = 'WAITING_FOR_NAME';
        await ctx.reply("Yangi uchrashuv jarayani boshlandi.\n<b> 👤 Iltimos,to'liq ismingizni kiriting, misol uchun </b>: Kimdir Kimdir:", {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '❌ Bekor qilish', callback_data: 'cancel' }],
                ],
            },
        });
    }
    async getInfoMeeting(ctx) {
        if (ctx.message && 'text' in ctx.message) {
            const text = ctx.message.text;
            switch (ctx.session.step) {
                case 'WAITING_FOR_NAME':
                    if (!text || text.length < 5 || text.split(' ').length < 2) {
                        ctx.reply("⛔️ Ism juda qisqa. Iltimos, to'liq ismingizni kiriting!", {
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: '❌ Bekor qilish', callback_data: 'cancel' }],
                                ],
                            },
                        });
                        return;
                    }
                    const validateName = await (0, create_bot_dto_1.validateAndReply)(create_bot_dto_1.NameDto, { fullName: text }, ctx);
                    if (!validateName)
                        return;
                    ctx.session.name = text;
                    ctx.session.step = 'WAITING_FOR_ADDRESS';
                    ctx.reply("📍 Uchrashuv bo'lib o'tadigan manzilni kiriting, <b>misol uchun</b>: Toshkent, chilanzar 5", {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '❌ Bekor qilish', callback_data: 'cancel' }],
                            ],
                        },
                    });
                    return;
                case 'WAITING_FOR_ADDRESS':
                    if (!text || text.length < 5) {
                        ctx.reply("⛔️ Manzil juda qisqa. Iltimos, to'liq manzilni kiriting!", {
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: '❌ Bekor qilish', callback_data: 'cancel' }],
                                ],
                            },
                        });
                        return;
                    }
                    const validateAddress = await (0, create_bot_dto_1.validateAndReply)(create_bot_dto_1.AddressDto, { address: text }, ctx);
                    if (!validateAddress)
                        return;
                    ctx.session.address = text;
                    ctx.session.step = 'WAITING_FOR_TIME';
                    await ctx.reply('⏳ Vaqtni kiriting <b>Misol uchun</b>: 12:00', {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '❌ Bekor qilish', callback_data: 'cancel' }],
                            ],
                        },
                    });
                    return;
                case 'WAITING_FOR_TIME':
                    if (!text || text.length < 5 || text.length > 5) {
                        ctx.reply('⛔️ Xato vatq kiritildi!. Iltimos vaqt 00:00 formatida bolsin!', {
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: '❌ Bekor qilish', callback_data: 'cancel' }],
                                ],
                            },
                        });
                        return;
                    }
                    const timeValidator = await (0, create_bot_dto_1.validateAndReply)(create_bot_dto_1.TimeDto, { time: text }, ctx);
                    if (!timeValidator)
                        return;
                    ctx.session.step = 'WAITING_FOR_WEEKDAY';
                    ctx.session.time = text;
                    await ctx.reply('📅 Hafta kunini tanlang!, misol uchun Dushanba:', telegraf_1.Markup.keyboard([
                        'Dushanba',
                        'Seshanba',
                        'Chorshanba',
                        'Payshanba',
                        'Juma',
                        'Shanba',
                    ]).oneTime());
                    return;
                case 'WAITING_FOR_WEEKDAY':
                    if (!text ||
                        ![
                            'Dushanba',
                            'Seshanba',
                            'Chorshanba',
                            'Payshanba',
                            'Juma',
                            'Shanba',
                        ].includes(text)) {
                        ctx.reply('⛔️ xato hafta kuni kiritildi menudan tanlang!', telegraf_1.Markup.keyboard([
                            'Dushanba',
                            'Seshanba',
                            'Chorshanba',
                            'Payshanba',
                            'Juma',
                            'Shanba',
                        ]).oneTime());
                        return;
                    }
                    const validateWeekday = await (0, create_bot_dto_1.validateAndReply)(create_bot_dto_1.WeekdayDto, { weekday: text }, ctx);
                    if (!validateWeekday)
                        return;
                    ctx.session.step = 'DONE';
                    ctx.session.weekday = text;
                    await ctx.reply('✅ Yangi uchrashuv saqlandi:', telegraf_1.Markup.removeKeyboard());
                    ctx.reply(`👤 Ism: ${ctx.session.name}\n 📍Manzil: ${ctx.session.address}\n 📅Hafta kuni: ${ctx.session.weekday}\n ⏳Soat: ${ctx.session.time} `, {
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: '➕ Yana qo‘shish',
                                        callback_data: 'new_meeting',
                                    },
                                    { text: '❌ Bekor qilish', callback_data: 'cancel' },
                                    { text: '✅ Tasdiqlash', callback_data: 'confirm' },
                                ],
                            ],
                        },
                    });
                    return;
                default:
                    ctx.reply('Iltimos /start yoki <b>📅 Yangi uchrashuv</b> tugmasini bosing!', { parse_mode: 'HTML', reply_markup: { remove_keyboard: true } });
                    return;
            }
        }
    }
    async addInfo(ctx) {
        ctx.session = {};
        ctx.session.step = 'WAITING_FOR_NAME';
        await ctx.answerCbQuery();
        await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
        await ctx.reply('Yangi uchrashuv:\n 👤 Iltimos, ismingizni kiriting:');
    }
    async cancelMeeting(ctx) {
        ctx.session = {};
        await ctx.answerCbQuery();
        await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
        await ctx.reply('❌ Uchrashuv bekor qilindi!', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '📅 Yangi uchrashuv', callback_data: 'new_meeting' }],
                ],
            },
        });
    }
    async confirmMeeting(ctx) {
        await ctx.answerCbQuery();
        await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
        try {
            await this.botModel.create({
                fullName: ctx.session.name,
                ...ctx.session,
                userId: ctx.from?.id,
            });
        }
        catch (error) {
            await ctx.reply('❌ Uchrashuv saqlanishda hatolik iltimos qaytadan urining!', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '📅 Yangi uchrashuv', callback_data: 'new_meeting' }],
                    ],
                },
            });
        }
        await ctx.reply('✅ Uchrashuv muvaffaqiyatli saqlandi!', telegraf_1.Markup.removeKeyboard());
        if (!process.env.ADMIN)
            throw new common_1.BadGatewayException('Couldnt load the env variable admin!');
        await ctx.telegram.sendMessage(process.env.ADMIN, `✅ Yangi uchrashuv qoshilishi aniqlandi:\n\n 👤 Ism: ${ctx.session.name}\n 📍Manzil: ${ctx.session.address}\n 📅Hafta kuni: ${ctx.session.weekday}\n ⏳Soat: ${ctx.session.time} `);
    }
};
exports.BotUpdate = BotUpdate;
__decorate([
    (0, nestjs_telegraf_1.Start)(),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "start", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('📞 Bog‘lanish'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "contact", null);
__decorate([
    (0, nestjs_telegraf_1.On)('contact'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "receiveContent", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('🗓 Uchrashuvlarim'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "showMeetings", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(['preview', 'next']),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "pagination", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('📅 Yangi uchrashuv'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "saveName", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)(/.*/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "getInfoMeeting", null);
__decorate([
    (0, nestjs_telegraf_1.Action)('new_meeting'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "addInfo", null);
__decorate([
    (0, nestjs_telegraf_1.Action)('cancel'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "cancelMeeting", null);
__decorate([
    (0, nestjs_telegraf_1.Action)('confirm'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "confirmMeeting", null);
exports.BotUpdate = BotUpdate = __decorate([
    (0, nestjs_telegraf_1.Update)(),
    __param(0, (0, mongoose_1.InjectModel)(bot_entity_1.Bot.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BotUpdate);
//# sourceMappingURL=bot.update.js.map