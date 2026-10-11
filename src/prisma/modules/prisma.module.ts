import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../service/index.js';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
