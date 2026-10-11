import { envSchema } from './env.schema.js';

const databaseUrl = 'postgresql://card:card@localhost:5432/business_card';

describe('envSchema', () => {
  it('rejects a missing DATABASE_URL', () => {
    expect(envSchema.safeParse({}).success).toBe(false);
  });

  it('rejects an empty DATABASE_URL', () => {
    expect(envSchema.safeParse({ DATABASE_URL: '' }).success).toBe(false);
  });

  it('coerces PORT and defaults NODE_ENV', () => {
    const result = envSchema.safeParse({
      DATABASE_URL: databaseUrl,
      PORT: '3000',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.PORT).toBe(3000);
      expect(result.data.NODE_ENV).toBe('development');
      expect(result.data.DATABASE_URL).toBe(databaseUrl);
    }
  });

  it('rejects a PORT outside 0-65535', () => {
    expect(
      envSchema.safeParse({ DATABASE_URL: databaseUrl, PORT: '65536' }).success,
    ).toBe(false);
  });
});
