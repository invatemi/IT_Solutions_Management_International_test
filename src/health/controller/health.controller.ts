import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { PrismaHealthIndicator } from '../service/index.js';

/**
 * Проверка доступности сервиса.
 */
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly database: PrismaHealthIndicator,
  ) {}

  /**
   * Проверяет доступность сервиса.
   * @return результат проверки
   */
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.database.isHealthy('database')]);
  }
}
