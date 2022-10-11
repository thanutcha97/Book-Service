import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {rename} from "fs";

export type PurchaseDocument = Purchase & Document;

@Schema()
export class Purchase {

    @Prop()
    UserId : string;

    @Prop()
    bookID: string;

    @Prop({ default: Date.now })
    buyDate: Date

    @Prop()
    username : string;

    @Prop()
    bookName : string;

    @Prop()
    priceBook : number;

    @Prop()
    bookType : string;

    @Prop()
    amount : number;

    @Prop()
    totalprice : number;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
