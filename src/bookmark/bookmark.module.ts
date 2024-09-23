import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { bookmarkSchema } from 'src/schemas/bookmark.schema';
import { AuthModule } from 'src/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Bookmark', schema: bookmarkSchema }]),
  ],
  controllers: [BookmarkController],
  providers: [
    BookmarkService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class BookmarkModule {}
