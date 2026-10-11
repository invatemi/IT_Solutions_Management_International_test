import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { LoggerModule } from 'nestjs-pino';
import { envSchema } from './config/env.schema.js';
import { graphqlOptions } from './graphql/graphql.options.js';
import { HealthModule } from './health/modules/index.js';
import { PrismaModule } from './prisma/modules/index.js';
import { ProfileModule } from './profile/modules/index.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        redact: ['req.headers.authorization', 'DATABASE_URL', '*.DATABASE_URL'],
        transport:
          process.env.NODE_ENV === 'production'
            ? undefined
            : {
                target: 'pino-pretty',
                options: { singleLine: true },
              },
      },
    }),
    GraphQLModule.forRoot(graphqlOptions()),
    PrismaModule,
    HealthModule,
    ProfileModule,
  ],
})
export class AppModule {}
