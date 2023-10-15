import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ValidationErrorFilter } from './comments/mongo-validation.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // allows validation in the application
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ValidationErrorFilter());
  await app.listen(3000);
}
bootstrap();
