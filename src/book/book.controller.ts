import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookService } from './book.service';
import {MessagePattern} from "@nestjs/microservices";
import {CreateBoook} from "./interface/books.interface";
import {PurchaseInterface} from "./interface/purchase.interface";


@Controller('book')
export class BookController {

  constructor(private readonly bookService: BookService) {}

  @MessagePattern({ cmd: 'books_create' })
  create(data: CreateBoook) {
    return this.bookService.create(data);
  }

  @MessagePattern({ cmd: 'update_books' })
  update(data) {
    return this.bookService.update(data.id, data.bookData );
  }

  @MessagePattern({ cmd: 'delete_books' })
  remove(id: string) {
    return this.bookService.remove(id);
  }

  @MessagePattern({ cmd: 'sort_by_type' })
  sortbytype(name: string) {
    return this.bookService.sortbytype(name);
  }

  @MessagePattern({ cmd: 'sort_by_price' })
  sortbyprice(select: string) {
    return this.bookService.sortbyprice(select);
  }

  @MessagePattern({ cmd: 'sort_by_amount' })
  sortbyamount(select: string) {
    return this.bookService.sortbyamount(select);
  }

  @MessagePattern({ cmd: 'buy_book' })
  buybook( data) {
    return this.bookService.buyBook( data.user , data.data);
  }

  @MessagePattern({ cmd: 'report_purchase_book_type' })
  async  reportPurhaseBookType( name ) {
    const items  = await this.bookService.reportPurhaseBookType( name );
    return {
      items,
      count: items.length,
      typeBook: name,
    };
  }

  @MessagePattern({ cmd: 'low_in_stock' })
  lowInstock() {
    return this.bookService.lowInstock();
  }

  @MessagePattern({ cmd: 'ranking_books' })
  bookRanking() {
    return this.bookService.bookRanking();
  }

  @MessagePattern({ cmd: 'ranking_users' })
  userRanking() {
    return this.bookService.userRanking();
  }

  @MessagePattern({ cmd: 'ranking_users_id' })
  userRankingId( id : string ) {
    return this.bookService.userRankingId( id );
  }

  @MessagePattern({ cmd: 'get_purchase_user_data' })
  getPurchaseUserDate( ) {
    return this.bookService.getPurchaseUserDate(  );
  }

  @MessagePattern({ cmd: 'last_date' })
  userPurchaseBookLastdate(id) {
    return this.bookService.userPurchaseBookLastdate(id);
  }

}
