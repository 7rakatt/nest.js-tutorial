import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class creatUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
