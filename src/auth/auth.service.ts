import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { signupDto } from './dtos/signup.dto';
import { signinDto } from './dtos/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: signupDto): Promise<{ token: string }> {
    const { name, email, password ,role} = signupDto;
    const exsistUser = await this.userModel.findOne({ email });
    if (exsistUser) {
      throw new ForbiddenException('invalid email or password');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      role
    });
    const token = this.jwtService.sign({ id: user._id });
    return { token };
  }

  async signin(signinDto: signinDto): Promise<{ token: string }> {
    const { email, password } = signinDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('invalid email or password');
    }
    const isPassMatch =await bcrypt.compare(password, user.password);

    if (!isPassMatch) {
      throw new UnauthorizedException('invalid email or password');
    }
    const token = this.jwtService.sign({ id: user._id });
    return { token };
  }
}
