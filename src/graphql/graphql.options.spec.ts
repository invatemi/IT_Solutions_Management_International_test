import { jest } from '@jest/globals';
import { Logger, NotFoundException } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { formatGraphqlError, graphqlOptions } from './graphql.options.js';

describe('formatGraphqlError', () => {
  it('keeps the message of an HttpException', () => {
    const formatted = {
      message: 'Profile not found',
      extensions: { code: 'INTERNAL_SERVER_ERROR', stacktrace: ['hidden'] },
    };
    const error = new GraphQLError('Profile not found', {
      originalError: new NotFoundException('Profile not found'),
    });

    const result = formatGraphqlError(formatted, error);

    expect(result.message).toBe('Profile not found');
    expect(result.extensions?.code).toBe('NOT_FOUND');
    expect(JSON.stringify(result)).not.toContain('stack');
    expect(JSON.stringify(result)).not.toContain('hidden');
  });

  it('hides unexpected errors and their stack', () => {
    const failure = new Error('database password');
    failure.stack = 'Error: database password\n    at secret.ts:1:1';
    const formatted = {
      message: 'database password',
      extensions: { stacktrace: [failure.stack] },
    };
    const error = new GraphQLError('database password', {
      originalError: failure,
    });

    const result = formatGraphqlError(formatted, error);

    expect(result.message).toBe('Internal server error');
    expect(JSON.stringify(result)).not.toContain('stack');
    expect(JSON.stringify(result)).not.toContain('database password');
    expect(JSON.stringify(result)).not.toContain('secret.ts');
  });

  it('redacts DATABASE_URL from the error log', () => {
    const previous = process.env['DATABASE_URL'];
    process.env['DATABASE_URL'] =
      'postgresql://card:secret@localhost:5432/business_card';
    const spy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);

    try {
      const failure = new Error(
        `connect ${process.env['DATABASE_URL']} failed`,
      );
      formatGraphqlError(
        { message: failure.message },
        new GraphQLError('x', { originalError: failure }),
      );
      const logged = JSON.stringify(spy.mock.calls);
      expect(logged).not.toContain('secret');
      expect(logged).toContain('[redacted]');
    } finally {
      spy.mockRestore();
      if (previous === undefined) {
        delete process.env['DATABASE_URL'];
      } else {
        process.env['DATABASE_URL'] = previous;
      }
    }
  });

  it('keeps introspection enabled for Apollo Sandbox', () => {
    expect(graphqlOptions().introspection).toBe(true);
  });
});
