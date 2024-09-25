import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkService } from './bookmark.service';
import { getModelToken } from '@nestjs/mongoose';
import { Bookmark, Catogary } from '../schemas/bookmark.schema';
import mongoose, { Model } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { creatBookmarkDto } from './dtos/creatBookmark.dto';
import { User } from '../schemas/user.schema';

describe('bookmarkService', () => {
  let bookmarkService: BookmarkService;
  let model: Model<Bookmark>;

  const mockUser = {
    _id: '61c0ccf11d7bf83d153d7c06',
    name: 'Ghulam',
    email: 'ghulam1@gmail.com',
  };

  const mockBook = {
    _id: '61c0ccf11d7bf83d153d7c06',
    user: '61c0ccf11d7bf83d153d7c06',
    title: 'New Book',
    description: 'Book Description',
    author: 'Author',
    price: 100,
    catogary: Catogary.FANTASY,
  };

  const mockBookmarkService = {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookmarkService,
        {
          provide: getModelToken(Bookmark.name),
          useValue: mockBookmarkService,
        },
      ],
    }).compile();
    bookmarkService = module.get<BookmarkService>(BookmarkService);
    model = module.get<Model<Bookmark>>(getModelToken(Bookmark.name));
  });

  describe('creat', () => {
    it('should create and return a book', async () => {
      const newBook = {
        title: 'New Book',
        description: 'Book Description',
        author: 'Author',
        price: 100,
        catogary: Catogary.FANTASY,
      };

      jest
        .spyOn(model, 'create')
        .mockImplementationOnce((): Promise<any> => Promise.resolve(mockBook));
       
      const result = await bookmarkService.creat(
        newBook as creatBookmarkDto,
        mockUser as User,
      );
       

      expect(result).toEqual(mockBook);
    });
  });

  describe('findAll', () => {
    it('should return an array of bookmark', async () => {
      const query = { page: '1', keyword: 'test' };

      jest.spyOn(model, 'find').mockImplementation(
        () =>
          ({
            limit: () => ({
              skip: jest.fn().mockResolvedValue([mockBook]),
            }),
          }) as any,
      );
      const result = await bookmarkService.findAll(query);

      expect(model.find).toHaveBeenCalledWith({
        title: { $regex: 'test', $options: 'i' },
      });

      expect(result).toEqual([mockBook]);
    });
  })


  describe('findById', () => {
    it('should find and return a book by ID', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(mockBook);

      const result = await bookmarkService.findById(mockBook._id);

      expect(model.findById).toHaveBeenCalledWith(mockBook._id);
      expect(result).toEqual(mockBook);
    });

    it('should throw BadRequestException if invalid ID is provided', async () => {
      const id = 'invalid-id';

      const isValidObjectIDMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false);

      await expect(bookmarkService.findById(id)).rejects.toThrow(
        BadRequestException,
      );

      expect(isValidObjectIDMock).toHaveBeenCalledWith(id);
      isValidObjectIDMock.mockRestore();
    });

    it('should throw NotFoundException if book is not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(bookmarkService.findById(mockBook._id)).rejects.toThrow(
        NotFoundException,
      );

      expect(model.findById).toHaveBeenCalledWith(mockBook._id);
    });
  });
  
  
  describe('update', () => {
    it('should update and return a book', async () => {
      const updatedBook = { ...mockBook, title: 'Updated name' };
      const book = { title: 'Updated name' };

      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedBook);

      const result = await bookmarkService.update(mockBook._id, book as any);

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(mockBook._id, book, {
        new: true,
        runValidators: true,
      });

      expect(result.title).toEqual(book.title);
    });
  });

  describe('delete', () => {
    it('should delete and return a book', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockBook);

      const result = await bookmarkService.delete(mockBook._id);

      expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockBook._id);

      expect(result).toEqual(mockBook);
    });
  });
})
