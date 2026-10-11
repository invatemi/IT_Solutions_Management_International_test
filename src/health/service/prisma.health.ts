import { Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import { PrismaService } from '../../prisma/service/index.js';

/**
 * Проверка доступности базы данных.
 */
@Injectable()
export class PrismaHealthIndicator {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Проверяет доступность базы данных.
   * @param key имя индикатора
   * @return результат проверки
   */
  isHealthy(key: string) {
    return this.healthIndicatorService
      .check(key)
      .attempt(async () => {
        await this.prisma.db.orm.public.Profile.first();
      })
      .withTimeout(5000);
  }
}
