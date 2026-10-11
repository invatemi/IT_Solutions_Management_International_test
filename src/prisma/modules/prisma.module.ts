import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../service/index.js';

/**
 * Модуль доступа к базе данных.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
