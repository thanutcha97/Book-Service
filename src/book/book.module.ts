import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Book, BookSchema} from "./schema/book.schema";
import {Purchase, PurchaseSchema} from "./schema/purchase.schema";

@Module({
  imports: [
        MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }] , ),
        MongooseModule.forFeature([{ name: Purchase.name, schema: PurchaseSchema }]),
  ],
  controllers: [BookController],
  providers: [BookService],
  exports: [BookService],

})
export class BookModule {}

