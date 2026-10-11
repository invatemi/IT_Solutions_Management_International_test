import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().int().min(0).max(65535).default(3000),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});
