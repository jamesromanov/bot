import { Context } from 'telegraf';
import { SessionMeeting } from './bot.session';
import { Bot } from './entities/bot.entity';
import { Model } from 'mongoose';
export type BotContext = Context & {
    session: SessionMeeting;
};
export declare class BotUpdate {
    private botModel;
    constructor(botModel: Model<Bot>);
    start(ctx: Context): Promise<void>;
    contact(ctx: BotContext): Promise<void>;
    receiveContent(ctx: BotContext): Promise<void>;
    showMeetings(ctx: BotContext): Promise<void | import("@telegraf/types").Message.TextMessage>;
    pagination(ctx: BotContext): Promise<void>;
    saveName(ctx: BotContext): Promise<void>;
    getInfoMeeting(ctx: BotContext): Promise<void>;
    addInfo(ctx: BotContext): Promise<void>;
    cancelMeeting(ctx: BotContext): Promise<void>;
    confirmMeeting(ctx: BotContext): Promise<void>;
}
