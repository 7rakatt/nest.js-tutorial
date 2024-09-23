import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet'
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:5001'],

  });
  app.use(helmet());
  app.use(csurf());
    app.useGlobalPipes(
      //whitelist => the parameters in the dto
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
  await app.listen(5001);
}
bootstrap();
