import { jest } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { HealthIndicatorService } from '@nestjs/terminus';
import { PrismaService } from '../../prisma/service/index.js';
import { PrismaHealthIndicator } from './prisma.health.js';

describe('PrismaHealthIndicator', () => {
  const first = jest.fn<() => Promise<unknown>>();
  let indicator: PrismaHealthIndicator;

  beforeEach(async () => {
    first.mockReset();
    const moduleRef = await Test.createTestingModule({
      providers: [
        PrismaHealthIndicator,
        HealthIndicatorService,
        {
          provide: PrismaService,
          useValue: { db: { orm: { public: { Profile: { first } } } } },
        },
      ],
    }).compile();

    indicator = moduleRef.get(PrismaHealthIndicator);
  });

  it('treats an empty profile table as up', async () => {
    first.mockResolvedValue(null);

    const result = await indicator.isHealthy('database');

    expect(result.database.status).toBe('up');
  });

  it('is down when the database query throws', async () => {
    first.mockRejectedValue(new Error('connection refused'));

    const result = await indicator.isHealthy('database');

    expect(result.database.status).toBe('down');
  });
});
