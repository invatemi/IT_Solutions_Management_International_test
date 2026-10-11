import { jest } from '@jest/globals';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma/service/index.js';
import { ProfileService } from './profile.service.js';

function list(rows: unknown[]) {
  return {
    where: () => ({
      orderBy: () => ({
        all: () => Promise.resolve(rows),
      }),
    }),
  };
}

describe('ProfileService', () => {
  const first = jest.fn<() => Promise<unknown>>();
  let service: ProfileService;

  beforeEach(async () => {
    first.mockReset();
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: PrismaService,
          useValue: {
            db: {
              orm: {
                public: {
                  Profile: { first },
                  Skill: list([{ name: 'TypeScript' }, { name: 'NestJS' }]),
                },
              },
            },
          },
        },
      ],
    }).compile();

    service = moduleRef.get(ProfileService);
  });

  it('throws when the profile is missing', async () => {
    first.mockResolvedValue(null);

    await expect(service.getProfile()).rejects.toBeInstanceOf(
      NotFoundException,
    );
    await expect(service.getProfile()).rejects.toThrow('Profile not found');
  });

  it('returns the profile fields the resolvers need', async () => {
    first.mockResolvedValue({
      id: 7,
      name: 'Ada',
      description: 'Engineer',
    });

    await expect(service.getProfile()).resolves.toEqual({
      id: 7,
      name: 'Ada',
      description: 'Engineer',
    });
  });

  it('returns skill names in the stored order', async () => {
    await expect(service.getSkills(1)).resolves.toEqual([
      { name: 'TypeScript' },
      { name: 'NestJS' },
    ]);
  });
});
