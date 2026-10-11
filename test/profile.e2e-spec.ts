import { INestApplication, NotFoundException } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { graphqlOptions } from '../src/graphql/graphql.options.js';
import { HealthModule } from '../src/health/modules/index.js';
import { PrismaHealthIndicator } from '../src/health/service/index.js';
import { ProfileModule } from '../src/profile/modules/index.js';
import { ProfileService } from '../src/profile/service/index.js';

type GraphqlBody = {
  errors?: { message?: string }[];
  data?: {
    profile: {
      name: string;
      description: string;
      skills: { name: string }[];
    };
  };
};

type HealthBody = {
  status?: string;
};

describe('Profile (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot(graphqlOptions()),
        ProfileModule,
        HealthModule,
      ],
    })
      .overrideProvider(ProfileService)
      .useValue({
        getProfile: () =>
          Promise.resolve({
            id: 1,
            name: 'Ada',
            description: 'Engineer',
          }),
        getSkills: () => Promise.resolve([{ name: 'TypeScript' }]),
      })
      .overrideProvider(PrismaHealthIndicator)
      .useValue({
        isHealthy: () => Promise.resolve({ database: { status: 'up' } }),
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /graphql returns the profile card', () => {
    return request(app.getHttpServer() as App)
      .post('/graphql')
      .send({
        query: '{ profile { name description skills { name } } }',
      })
      .expect(200)
      .expect((response) => {
        const body = response.body as GraphqlBody;
        expect(body.errors).toBeUndefined();
        expect(body.data?.profile).toEqual({
          name: 'Ada',
          description: 'Engineer',
          skills: [{ name: 'TypeScript' }],
        });
      });
  });

  it('POST /graphql keeps a missing-profile message', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [GraphQLModule.forRoot(graphqlOptions()), ProfileModule],
    })
      .overrideProvider(ProfileService)
      .useValue({
        getProfile: () =>
          Promise.reject(new NotFoundException('Profile not found')),
      })
      .compile();

    const missing = moduleRef.createNestApplication();
    await missing.init();

    try {
      await request(missing.getHttpServer() as App)
        .post('/graphql')
        .send({ query: '{ profile { name } }' })
        .expect(200)
        .expect((response) => {
          const body = response.body as GraphqlBody;
          expect(body.errors?.[0]).toMatchObject({
            message: 'Profile not found',
            extensions: { code: 'NOT_FOUND' },
          });
          expect(JSON.stringify(body)).not.toContain('stack');
        });
    } finally {
      await missing.close();
    }
  });

  it('GET /health reports ok', () => {
    return request(app.getHttpServer() as App)
      .get('/health')
      .expect(200)
      .expect((response) => {
        const body = response.body as HealthBody;
        expect(body.status).toBe('ok');
      });
  });
});
