import { jest } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { ProfileResolver } from './profile.resolver.js';
import { ProfileService } from '../service/index.js';

describe('ProfileResolver', () => {
  it('loads the profile from ProfileService', async () => {
    const getProfile =
      jest.fn<
        () => Promise<{ id: number; name: string; description: string }>
      >();
    getProfile.mockResolvedValue({
      id: 1,
      name: 'Ada',
      description: 'Engineer',
    });

    const moduleRef = await Test.createTestingModule({
      providers: [
        ProfileResolver,
        { provide: ProfileService, useValue: { getProfile } },
      ],
    }).compile();

    const resolver = moduleRef.get(ProfileResolver);

    await expect(resolver.profile()).resolves.toEqual({
      id: 1,
      name: 'Ada',
      description: 'Engineer',
    });
    expect(getProfile).toHaveBeenCalledTimes(1);
  });
});
