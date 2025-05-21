import { BotContext } from '../bot.update';
export declare class NameDto {
    fullName: string;
}
export declare class AddressDto {
    address: string;
}
export declare class TimeDto {
    time: string;
}
export declare class WeekdayDto {
    weekday: WeekdayDto;
}
export declare function validateAndReply<T extends object>(dtoClass: new () => T, value: object, ctx: BotContext): Promise<boolean>;
