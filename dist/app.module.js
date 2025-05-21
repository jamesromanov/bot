"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const ioredis_1 = require("ioredis");
const throttler_storage_redis_1 = require("@nest-lab/throttler-storage-redis");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const telegraf_1 = require("telegraf");
const bot_module_1 = require("./bot/bot.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bot_module_1.BotModule,
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot({
                throttlers: [{ ttl: 20000, limit: 2 }],
                storage: new throttler_storage_redis_1.ThrottlerStorageRedisService(new ioredis_1.Redis({
                    port: Number(process.env.REDIS_PORT) || 6379,
                    host: process.env.REDIS_HOST,
                })),
            }),
            nestjs_telegraf_1.TelegrafModule.forRoot({
                middlewares: [(0, telegraf_1.session)()],
                token: process.env.TELEGRAM_BOT_TOKEN ??
                    (() => {
                        throw new Error('TELEGRAM_BOT_TOKEN is not set!');
                    })(),
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    uri: configService.get('MONGO_URL'),
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map