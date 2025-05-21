export declare class Bot {
    fullName: string;
    address: string;
    userId: number;
    time: string;
    weekday: string;
    createdAt: Date;
}
export declare const BotSchema: import("mongoose").Schema<Bot, import("mongoose").Model<Bot, any, any, any, import("mongoose").Document<unknown, any, Bot, any> & Bot & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Bot, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Bot>, {}> & import("mongoose").FlatRecord<Bot> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
