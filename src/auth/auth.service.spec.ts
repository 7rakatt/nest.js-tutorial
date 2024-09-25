import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from '../schemas/user.schema';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('bookmarkService', () => {
  let authService: AuthService;
  let model: Model<User>;
  let jwtService: JwtService;
  let token = 'jwtToken';

  const mockUser = {
    _id: '61c0ccf11d7bf83d153d7c06',
    name: 'Ghulam',
    email: 'ghulam1@gmail.com',
  };

  

  const mockAuthService = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getModelToken(User.name),
          useValue: mockAuthService,
        },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    model = module.get<Model<User>>(getModelToken(User.name));
  })

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
  describe('signUp', () => {
    const signUpDto = {
      name: 'Ghulam',
      email: 'ghulam1@gmail.com',
      password: '12345678',
    }
    it('should register the new user', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce((): Promise<any> => Promise.resolve(mockUser));

      jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');

      const result = await authService.signup(signUpDto);

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(result).toEqual({ token });
    });
    it('should throw duplicate email entered', async () => {
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.reject({ code: 11000 }));

      await expect(authService.signup(signUpDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });



  describe('signin', () => {
    const loginDto = {
      email: 'ghulam1@gmail.com',
      password: '12345678',
    };

    it('should login user and return the token', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);

      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await authService.signin(loginDto);

      expect(result).toEqual({ token });
    });

    it('should throw invalid email error', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);

      expect(authService.signin(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw invalid password error', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

      expect(authService.signin(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
})
