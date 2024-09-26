import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { Bookmark } from '../schemas/bookmark.schema';
import { creatBookmarkDto } from '../bookmark/dtos/creatBookmark.dto';
import { updateBookmarkDto } from '../bookmark/dtos/updateBookmark.dto';
import { Query as expressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('bookmark')
export class BookmarkController {
  constructor(private BookmarkService: BookmarkService) {}

  @Get()
  // @Roles(Role.Admin, Role.Moderator)
  @UseGuards(AuthGuard(), RolesGuard)
  async findAll(@Query() query: expressQuery): Promise<Bookmark[]> {
    return this.BookmarkService.findAll(query);
  }

  @Post()
  @UseGuards(AuthGuard())
  async creatBookmark(
    @Body() bookmark: creatBookmarkDto,
    @Req() req,
  ): Promise<Bookmark> {
    return this.BookmarkService.creat(bookmark, req.user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Bookmark> {
    return this.BookmarkService.findById(id);
  }

  @Patch(':id')
  async updateOne(
    @Param('id') id: string,
    @Body() bookmark: updateBookmarkDto,
  ): Promise<Bookmark> {
    return this.BookmarkService.update(id, bookmark);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOne(@Param('id') id: string) {
    return this.BookmarkService.delete(id);
  }

  @Put('/upload/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadbookmarkimage(
    @Param('id') id:string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1000 * 1000,
          message: 'File size must be less than 1MB',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
  return this.BookmarkService.uploadImages(id, file);
  }
}

