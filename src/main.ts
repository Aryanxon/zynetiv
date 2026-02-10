import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // This line is crucial! It tells Nest to check the DTOs
  app.useGlobalPipes(new ValidationPipe()); 
  await app.listen(3000);
}
bootstrap();