import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WeatherbotModule } from './weatherbot/weatherbot.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
