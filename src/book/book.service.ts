import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateBoook} from "./interface/books.interface";
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {Book, BookDocument} from "./schema/book.schema";
import {Purchase, PurchaseDocument} from "./schema/purchase.schema";
import {PurchaseInterface} from "./interface/purchase.interface";


@Injectable()
export class BookService {

    constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>,
                @InjectModel(Purchase.name) private purcheasModel: Model<PurchaseDocument>
    ) {
    }

    async create(bookData: CreateBoook) {
        const newBook = await new this.bookModel(bookData).save();
        return newBook;
    }

    async update(id: string, bookData: CreateBoook) {
        const updateUserData = await this.bookModel.findByIdAndUpdate(id, bookData);
        if (updateUserData) {
            return updateUserData;
        } else {
            return new HttpException(
                'Cannot update book data',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async remove(id: string) {
        const deleteUser = await this.bookModel
            .findByIdAndRemove({_id: id})
            .exec();
        if (deleteUser) {
            return `book data deleted`
        } else {
            throw new HttpException(
                'Book was not found for parameters',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async sortbytype(name: string) {
        // const nameLower = name.toLowerCase();
        const result = await this.bookModel.find({
            typename: name
        })
        if (result.length > 0) {
            return result
        } else {
            return 'Is Empty'
        }
    }

    async sortbyprice(select: string) {

        let bookSortbypice = []

        if (select == 'asc') {
            bookSortbypice = await this.bookModel.find().sort({price: 1})
        } else {
            bookSortbypice = await this.bookModel.find().sort({price: -1})
        }
        return bookSortbypice
    }

    async sortbyamount(select: string) {

        let sortbyamount = []
        if (select == 'asc') {
            sortbyamount = await this.bookModel.find().sort({amount: 1})
        } else {
            sortbyamount = await this.bookModel.find().sort({amount: -1})
        }
        return sortbyamount
    }

    async findOne(id: string) {
        const data = await this.bookModel.findById(id)
        return data
    }


    async buyBook(user: any, purcheaseBook: PurchaseInterface) {

        if (user.static == "block") {
            return 'your account is blocked'
        }

        const bookInfo = await this.bookModel.findById(purcheaseBook.id)

        const bookSell = await this.purcheasModel.aggregate(
            [
                {$match: {bookID: purcheaseBook.id}},
                {
                    $group: {
                        _id: null,
                        qtySell: {$sum: "amount"}
                    }
                }
            ]
        )

        if (bookInfo == null) {
            return 'The book was not found'
        }

        if (bookInfo.amount == 0) {
            return (`Sold Out`)
        }

        let amountSell = 0;
        if (bookSell.length > 0) {
            amountSell = bookSell[0].qtySell
        }

        const amountCurrent = bookInfo.amount - (amountSell + purcheaseBook.amount);
        // const userInfo = await this.UserModel.find({ _id : user._id})
        if (amountCurrent < 0) {
            return (`Not enough books`)
        }

        const totalprice = await bookInfo.price * purcheaseBook.amount;

        await this.purcheasModel.create({

            UserId: user.id,
            bookID: bookInfo._id,
            username: user.username,
            bookName: bookInfo.name,
            priceBook: bookInfo.price,
            bookType: bookInfo.typename,
            amount: purcheaseBook.amount,
            totalprice: totalprice

        })

        //บันทึกข้อมูลหนังสือคงเหลือ
        bookInfo.amount = amountCurrent;
        bookInfo.save();

        return 'Successful Purchase'

    }

    async reportPurhaseBookType(name: string) {
        const reportPurchase = await this.purcheasModel.find({bookType: name}).select({
            bookName: 1,
            priceBook: 1
        });
        if (reportPurchase) {
            return reportPurchase
        } else {
            return `No reports of book sales in this category`
        }
    }

    async lowInstock() {
        const data = await this.bookModel.find({
            amount: {
                $lt: 5
            }
        })
        return data;
    }


    async bookRanking() {

        const data = await this.purcheasModel.aggregate([
            {
                $group: {
                    _id: "$bookType",
                    total: {$sum: "$amount"},
                    sales: {$sum: "$totalprice"},
                }
            },
            {
                $sort: {
                    total: -1
                }
            }
        ])
        console.log(data)

        // const data = await this.purcheasModel.find()
        return data
    }

    async userRanking() {

        const dataRankUser = await this.purcheasModel.aggregate([
            {
                $group: {
                    _id: "$UserId",
                    username: {$last: "$username"},
                    totalBookAmount: {$sum: "$amount"},
                    totalPurchaseAmount: {$sum: "$totalprice"}
                },
            },
            {
                $sort: {
                    totalBookAmount: -1
                }
            },
        ])

        return dataRankUser


    }

    async userRankingId( id : string) {

        const dataBookType = await this.purcheasModel.aggregate([
            {
                $group: {
                    _id: { id: id , type : "$bookType"},
                    totalBookAmount: {$sum: "$amount"},
                    totalPurchaseAmount: {$sum: "$totalprice"},
                }
            },
            {
                $group: {
                    _id : "$_id.id",
                    items: {
                        $push: {
                            item: "$_id.type",
                            total: "$totalBookAmount",
                            totalPrice: "$totalPurchaseAmount"

                        }
                    }
                }
            },

        ])

        console.log(dataBookType.sort())
        return dataBookType



    }

    async getPurchaseUserDate() {

        const data = await this.purcheasModel.aggregate([{
            $group : {
                _id : "$UserId" ,
                totalBook : { $sum : "$amount"}
            }}
        ])
        return data
    }

    async userPurchaseBookLastdate(id : string) {

        const data = await this.purcheasModel.find( {
            "UserId" : id
        } ).sort({
            "buyDate" : -1
        }).limit(1).select({
            "bookName" : 1,
            "buyDate" : 1
        })

        return data
    }
}


