import { Document, Types } from 'mongoose';
export type WaitlistEntryDocument = WaitlistEntry & Document;
export declare class WaitlistEntry {
    event: Types.ObjectId;
    user: Types.ObjectId;
    email: string;
    notified: boolean;
}
export declare const WaitlistEntrySchema: import("mongoose").Schema<WaitlistEntry, import("mongoose").Model<WaitlistEntry, any, any, any, Document<unknown, any, WaitlistEntry, any, {}> & WaitlistEntry & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, WaitlistEntry, Document<unknown, {}, import("mongoose").FlatRecord<WaitlistEntry>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<WaitlistEntry> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
