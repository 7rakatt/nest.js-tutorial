import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signupDto } from './dtos/signup.dto';
import { signinDto } from './dtos/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}

  @Post('/signup')
  signup(@Body() signupDto: signupDto): Promise<{ token: string }> {
    return this.AuthService.signup(signupDto);
  }

  @Post('/signin')
  signin(@Body() signinDto: signinDto): Promise<{ token: string }> {
    return this.AuthService.signin(signinDto);
  }
}
