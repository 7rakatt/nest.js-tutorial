import { Test, TestingModule } from '@nestjs/testing';
import { Catogary } from '../schemas/bookmark.schema';
import { creatBookmarkDto } from './dtos/creatBookmark.dto';
import { User } from '../schemas/user.schema';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { PassportModule } from '@nestjs/passport';
import { updateBookmarkDto } from './dtos/updateBookmark.dto';

describe('bookmarkService', () => {
  let bookmarkController: BookmarkController;
  let bookmarkService: BookmarkService;

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
    findAll: jest.fn().mockResolvedValueOnce([mockBook]),
    findById: jest.fn().mockResolvedValueOnce(mockBook),
    creat: jest.fn(),
    update: jest.fn(),
    delete: jest.fn().mockResolvedValueOnce({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [BookmarkController],
      providers: [
        BookmarkController,
        {
          provide: BookmarkService,
          useValue: mockBookmarkService,
        },
      ],
    }).compile();
    bookmarkController = module.get<BookmarkController>(BookmarkController);
    bookmarkService = module.get<BookmarkService>(BookmarkService);
  });
  it('should be defined', () => {
    expect(bookmarkController).toBeDefined();
  });

  describe('getAllBooks', () => {
    it('should get all books', async () => {
      const result = await bookmarkController.findAll({
        page: '1',
        keyword: 'test',
      });

      expect(bookmarkService.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockBook]);
    });
  });

  describe('getbooksbyId', () => {
    it('should get book by id', async () => {
      const result = await bookmarkController.findOne(mockBook._id);

      expect(bookmarkService.findById).toHaveBeenCalled();
      expect(result).toEqual(mockBook);
    });
  });

  describe('createBook', () => {
    it('should create book', async () => {
      const newBook = {
        title: 'New Book',
        description: 'Book Description',
        author: 'Author',
        price: 100,
        catogary: Catogary.FANTASY,
      };
      mockBookmarkService.creat = jest.fn().mockResolvedValueOnce(mockBook);
      const result = await bookmarkController.creatBookmark(
        newBook as creatBookmarkDto,
        mockUser as User,
      );

      expect(bookmarkService.creat).toHaveBeenCalled();
      expect(result).toEqual(mockBook);
    });
  });

  describe('updateBook', () => {
    it('should update a book', async () => {
      const updatedBook = { ...mockBook, title: 'updated name' };
      const bookmark = { title: 'updatd name' };
      mockBookmarkService.update = jest.fn().mockResolvedValueOnce(updatedBook);

      const result = await bookmarkController.updateOne(
        mockBook._id,
        bookmark as updateBookmarkDto,
      );

      expect(bookmarkService.update).toHaveBeenCalled();
      expect(result).toEqual(updatedBook);
    });
  });

  describe('deleteBook', () => {
    it('should delete a book by ID', async () => {
      const result = await bookmarkController.deleteOne(mockBook._id);

      expect(bookmarkService.delete).toHaveBeenCalled();
      expect(result).toEqual({ deleted: true });
    });
  });
});
