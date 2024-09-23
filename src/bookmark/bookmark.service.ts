import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { updateBookmarkDto } from 'src/bookmark/dtos/updateBookmark.dto';
import { Bookmark } from 'src/schemas/bookmark.schema';
import { Query } from 'express-serve-static-core';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectModel(Bookmark.name)
    private bookmarkModel: mongoose.Model<Bookmark>,
  ) {}

  async findAll(query: Query): Promise<Bookmark[]> {
    const limit = +query.limit || 2;
    const curPage = Number(query.page) || 1;
    const skip = (curPage - 1) * limit;
    const keyword = query.keyword
      ? {
          title: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};
    const books = await this.bookmarkModel
      .find({ ...keyword }, { __v: false })
      .limit(limit)
      .skip(skip);
    return books;
  }

  async creat(bookmark: Bookmark, user: User): Promise<Bookmark> {
    const data = Object.assign(bookmark,{user:user._id})
    const res = await this.bookmarkModel.create(data);
    return res;
  }

  async findById(id: string): Promise<Bookmark> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('not valid id');
    }
    const bookmark = await this.bookmarkModel.findById(id, { __v: false });
    if (!bookmark) {
      throw new NotFoundException('bookmark is not found');
    }
    return bookmark;
  }

  async update(id: string, bookmark: updateBookmarkDto): Promise<Bookmark> {
    const updatedbookmark = await this.bookmarkModel.findByIdAndUpdate(
      id,
      bookmark,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!bookmark) {
      throw new NotFoundException('bookmark is not found');
    }
    return updatedbookmark;
  }

  async delete(id: string) {
    await this.bookmarkModel.findByIdAndDelete(id);
  }

   async uploadImages(id: string, file: Express.Multer.File) {
    const bookmark = await this.bookmarkModel.findById(id);

    if (!bookmark) {
      throw new NotFoundException('Book not found.');
    }

    bookmark.image = file as object;

    await bookmark.save();

    return bookmark;
  }
}

