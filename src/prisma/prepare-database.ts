import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Db } from './db.js';
import { seedIfEmpty } from './seed-database.js';

const require = createRequire(import.meta.url);

export type CommandResult = {
  code: number;
  stderr: string;
};

export type CommandRunner = (
  command: string,
  args: readonly string[],
  cwd: string,
) => Promise<CommandResult>;

export function prismaCliPath(): string {
  const packageJsonPath = require.resolve('prisma/package.json');
  const pkg = require(packageJsonPath) as { bin: { prisma: string } };
  return path.join(path.dirname(packageJsonPath), pkg.bin.prisma);
}

export async function prepareDatabase(
  db: Db,
  databaseUrl: string,
  run: CommandRunner = runPrismaMigrate,
): Promise<void> {
  const url = databaseUrl.trim();
  if (!url) {
    throw new Error('DATABASE_URL is required');
  }

  const result = await run(
    process.execPath,
    [prismaCliPath(), 'db', 'migrate', '--db', url, '--yes'],
    projectRoot(),
  );
  if (result.code !== 0) {
    const detail = redact(result.stderr.trim(), url) || `exit ${result.code}`;
    throw new Error(`Database migration failed: ${detail}`);
  }

  await seedIfEmpty(db);
}

function projectRoot(): string {
  let dir = path.dirname(fileURLToPath(import.meta.url));
  for (let depth = 0; depth < 6; depth += 1) {
    if (
      existsSync(path.join(dir, 'prisma.config.ts')) &&
      existsSync(path.join(dir, 'migrations'))
    ) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  return process.cwd();
}

function redact(text: string, databaseUrl: string): string {
  const hidden = text.split(databaseUrl).join('[redacted]');
  return hidden.length > 2000 ? `${hidden.slice(0, 2000)}…` : hidden;
}

function runPrismaMigrate(
  command: string,
  args: readonly string[],
  cwd: string,
): Promise<CommandResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, [...args], {
      cwd,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const chunks: Buffer[] = [];
    const collect = (chunk: Buffer) => {
      chunks.push(chunk);
    };
    child.stdout.on('data', collect);
    child.stderr.on('data', collect);
    child.on('error', reject);
    child.on('close', (code) => {
      resolve({
        code: code ?? 1,
        stderr: Buffer.concat(chunks).toString('utf8'),
      });
    });
  });
}
