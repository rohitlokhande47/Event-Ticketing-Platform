import { Document, Types } from 'mongoose';
export type ResaleListingDocument = ResaleListing & Document;
export declare class ResaleListing {
    ticket: Types.ObjectId;
    price: number;
    seller: Types.ObjectId;
    status: string;
    transferCode?: string;
}
export declare const ResaleListingSchema: import("mongoose").Schema<ResaleListing, import("mongoose").Model<ResaleListing, any, any, any, Document<unknown, any, ResaleListing, any, {}> & ResaleListing & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ResaleListing, Document<unknown, {}, import("mongoose").FlatRecord<ResaleListing>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ResaleListing> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
