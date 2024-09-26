import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import mongoose from 'mongoose';
import { Catogary } from '../src/schemas/bookmark.schema';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeAll(() => {
    mongoose.connect(process.env.MONGO_URL)
  });

    afterAll(() => mongoose.disconnect());

    const user = {
      name: 'Ghulam',
      email: 'ghulam2@gmail.com',
      password: '12345678',
      role:'admin'
    };

    const newBook = {
      title: 'New Book',
      description: 'Book Description',
      author: 'Author',
      price: 100,
      catogary: Catogary.FANTASY,
    };

    let jwtToken: string = '';
    let bookCreated;

    describe('Auth', () => {
      it('(POST) - Register a new user', async () => {
        return request(app.getHttpServer())
          .post('/auth/signup')
          .send(user)
          .expect(201)
          .then((res) => {
            expect(res.body.token).toBeDefined();
          });
      });

      it('(GET) - Login user', async () => {
        return request(app.getHttpServer())
          .post('/auth/signin')
          .send({ email: user.email, password: user.password })
          .expect(200)
          .then((res) => {
            expect(res.body.token).toBeDefined();
            jwtToken = res.body.token;
          });
      });
    });

    describe('Book', () => {
      it('(POST) - Create new Book', async () => {
        return request(app.getHttpServer())
          .post('/bookmark')
          .set('Authorization', 'Bearer ' + jwtToken)
          .send(newBook)
          .expect(201)
          .then((res) => {
            expect(res.body._id).toBeDefined();
            expect(res.body.title).toEqual(newBook.title);
            bookCreated = res.body;
          });
      });

      it('(GET) - Get all Books', async () => {
        return request(app.getHttpServer())
          .get('/bookmark')
          .set('Authorization', 'Bearer ' + jwtToken)
          .expect(200)
          .then((res) => {
            expect(res.body.length).toBe(2);
          });
      });

      it('(GET) - Get a Book by ID', async () => {
        return request(app.getHttpServer())
          .get(`/bookmark/${bookCreated?._id}`)
          .expect(200)
          .then((res) => {
            expect(res.body).toBeDefined();
            expect(res.body._id).toEqual(bookCreated._id);
          });
      });

      it('(PUT) - Update a Book by ID', async () => {
        const book = { title: 'Updated name' };
        return request(app.getHttpServer())
          .patch(`/bookmark/${bookCreated?._id}`)
          .set('Authorization', 'Bearer ' + jwtToken)
          .send(book)
          .expect(200)
          .then((res) => {
            expect(res.body).toBeDefined();
            expect(res.body.title).toEqual(book.title);
          });
      });

      it('(DELETE) - Delete a Book by ID', async () => {
        return request(app.getHttpServer())
          .delete(`/bookmark/${bookCreated?._id}`)
          .set('Authorization', 'Bearer ' + jwtToken)
          .expect(204)
          .then((res) => {
            expect(res.body).toBeDefined();
          });
      });
    });
  })
