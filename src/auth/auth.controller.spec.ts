import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Test, TestingModule } from "@nestjs/testing";


describe('AuthController', () => {
  let authService: AuthService;
  let authController: AuthController;

  const mockUser = {
    _id: '61c0ccf11d7bf83d153d7c06',
    name: 'Ghulam',
    email: 'ghulam1@gmail.com',
  };

  let jwtToken = 'jwtToken';

  const mockAuthService = {
    signup: jest.fn().mockResolvedValueOnce(jwtToken),
    signin: jest.fn().mockResolvedValueOnce(jwtToken),
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
  })
  it('should be defined', () => {
    expect(authController).toBeDefined();
  });


  //signin
   describe('signUp', () => {
     it('should register a new user', async () => {
       const signUpDto = {
         name: 'Ghulam',
         email: 'ghulam1@gmail.com',
         password: '12345678',
       };

       const result = await authController.signup(signUpDto);
       expect(authService.signup).toHaveBeenCalled();
       expect(result).toEqual(jwtToken);
     });
   });
  
  
  //signin
  describe('login', () => {
    it('should login user', async () => {
      const loginDto = {
        email: 'ghulam1@gmail.com',
        password: '12345678',
      };

      const result = await authController.signin(loginDto);
      expect(authService.signin).toHaveBeenCalled();
      expect(result).toEqual(jwtToken);
    });
  })
})