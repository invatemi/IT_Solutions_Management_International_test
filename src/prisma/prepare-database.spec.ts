import { jest } from '@jest/globals';
import { existsSync } from 'node:fs';
import path from 'node:path';
import type { Db } from './db.js';
import {
  prepareDatabase,
  prismaCliPath,
  type CommandRunner,
} from './prepare-database.js';

const databaseUrl = 'postgresql://card:secret@db.example:5432/business_card';

function readyDatabase() {
  const first = jest.fn(() => Promise.resolve({ id: 1 }));
  const db = {
    orm: { public: { Profile: { first } } },
    transaction: () =>
      Promise.reject(new Error('seed wrote into an existing database')),
  } as unknown as Db;
  return { db, first };
}

describe('prepareDatabase', () => {
  it('resolves the Prisma CLI that ships with the app', () => {
    expect(existsSync(prismaCliPath())).toBe(true);
    expect(prismaCliPath()).toMatch(/[/\\]prisma[/\\]dist[/\\]prisma\.js$/);
  });

  it('migrates before serving and then seeds', async () => {
    const { db, first } = readyDatabase();
    const run: CommandRunner = (command, args, cwd) => {
      expect(command).toBe(process.execPath);
      expect(args.slice(1)).toEqual([
        'db',
        'migrate',
        '--db',
        databaseUrl,
        '--yes',
      ]);
      expect(existsSync(path.join(cwd, 'prisma.config.ts'))).toBe(true);
      expect(existsSync(path.join(cwd, 'migrations'))).toBe(true);
      expect(first).not.toHaveBeenCalled();
      return Promise.resolve({ code: 0, stderr: '' });
    };

    await prepareDatabase(db, databaseUrl, run);

    expect(first).toHaveBeenCalledTimes(1);
  });

  it('stops before seeding when migration fails and hides the database url', async () => {
    const { db, first } = readyDatabase();
    const run: CommandRunner = () =>
      Promise.resolve({
        code: 1,
        stderr: `connect ${databaseUrl} failed`,
      });

    await expect(prepareDatabase(db, databaseUrl, run)).rejects.toThrow(
      'Database migration failed: connect [redacted] failed',
    );
    expect(first).not.toHaveBeenCalled();
  });

  it('refuses to migrate without a database url', async () => {
    const { db } = readyDatabase();
    const run: CommandRunner = () =>
      Promise.reject(new Error('runner should not be called'));

    await expect(prepareDatabase(db, '   ', run)).rejects.toThrow(
      'DATABASE_URL is required',
    );
  });
});
