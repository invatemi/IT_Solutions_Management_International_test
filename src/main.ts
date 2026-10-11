import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module.js';
import { prepareDatabase } from './prisma/prepare-database.js';
import { PrismaService } from './prisma/service/index.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.enableShutdownHooks();
  const config = app.get(ConfigService);
  try {
    await prepareDatabase(
      app.get(PrismaService).db,
      config.getOrThrow<string>('DATABASE_URL'),
    );
    await app.listen(config.getOrThrow<number>('PORT'));
  } catch (error) {
    await app.close();
    throw error;
  }
}

void bootstrap();
