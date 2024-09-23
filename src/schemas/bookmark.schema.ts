import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import { User } from './user.schema';
import mongoose from 'mongoose';

export enum Catogary {
  ADVENTURE = 'Adventure',
  CALSSICS = 'Classics',
  CRIME = 'Crime',
  FANTASY = 'Fantasy',
}

@Schema({
  timestamps: true, //createdAt + updatedAt
})
export class Bookmark {
  @Prop()
  @IsString()
  title: string;

  @Prop()
  @IsString()
  description: string;

  @Prop()
  @IsString()
  author: string;

  @Prop()
  catogary: Catogary;

  @Prop()
  price: number;

  @Prop({type: Object})
  image?: object;

  @Prop({type: mongoose.Schema.Types.ObjectId,ref: 'User'})
  user: User;
}

export const bookmarkSchema = SchemaFactory.createForClass(Bookmark);
