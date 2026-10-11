import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDb, type Db } from '../db.js';

@Injectable()
export class PrismaService implements OnModuleDestroy {
  readonly db: Db;

  constructor(private readonly config: ConfigService) {
    this.db = createDb(this.config.getOrThrow<string>('DATABASE_URL'));
  }

  async onModuleDestroy() {
    await this.db.close();
  }
}
