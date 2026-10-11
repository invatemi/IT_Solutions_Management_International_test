import type { Db } from './db.js';
import { profileSeed } from './seed-data.js';
import { seedIfEmpty } from './seed-database.js';

type Creates = {
  profile: number;
  link: number;
  skill: number;
  experience: number;
  achievement: number;
  project: number;
};

function database(existing: unknown) {
  const creates: Creates = {
    profile: 0,
    link: 0,
    skill: 0,
    experience: 0,
    achievement: 0,
    project: 0,
  };
  let transactions = 0;
  const tx = {
    orm: {
      public: {
        Profile: {
          create: () => {
            creates.profile += 1;
            return Promise.resolve({ id: 7 });
          },
        },
        Link: {
          create: () => {
            creates.link += 1;
            return Promise.resolve();
          },
        },
        Skill: {
          create: () => {
            creates.skill += 1;
            return Promise.resolve();
          },
        },
        Experience: {
          create: () => {
            creates.experience += 1;
            return Promise.resolve({ id: creates.experience });
          },
        },
        Achievement: {
          create: () => {
            creates.achievement += 1;
            return Promise.resolve();
          },
        },
        Project: {
          create: () => {
            creates.project += 1;
            return Promise.resolve();
          },
        },
      },
    },
  };
  const db = {
    orm: {
      public: {
        Profile: {
          first: () => Promise.resolve(existing),
        },
      },
    },
    transaction: async (fn: (client: typeof tx) => Promise<void>) => {
      transactions += 1;
      await fn(tx);
    },
  } as unknown as Db;

  return { db, creates, transactions: () => transactions };
}

describe('seedIfEmpty', () => {
  it('does not write when a profile already exists', async () => {
    const { db, creates, transactions } = database({ id: 1 });

    await seedIfEmpty(db);

    expect(transactions()).toBe(0);
    expect(creates.profile).toBe(0);
  });

  it('fills an empty database from the card seed once', async () => {
    const { db, creates, transactions } = database(null);

    await seedIfEmpty(db);

    expect(transactions()).toBe(1);
    expect(creates).toEqual({
      profile: 1,
      link: profileSeed.links.length,
      skill: profileSeed.skills.length,
      experience: profileSeed.experience.length,
      achievement: profileSeed.experience.reduce(
        (sum, job) => sum + job.achievements.length,
        0,
      ),
      project: profileSeed.projects.length,
    });
  });
});
