import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import { Catogary } from 'src/schemas/bookmark.schema';
import { User } from 'src/schemas/user.schema';

export class creatBookmarkDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  readonly title: string;
  @IsString()
  @IsNotEmpty()
  readonly description: string;
  @IsString()
  @IsNotEmpty()
  readonly author: string;
  @IsEnum(Catogary, { message: 'please enter a correct catogary' })
  @IsNotEmpty()
  readonly catogary: Catogary;
  @IsNumber()
  @IsNotEmpty()
  readonly price: number;
  @IsEmpty({message: 'you cannot pass the user id'})
  readonly user:User
}
