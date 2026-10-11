import { HttpException, Logger } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { GraphQLError, type GraphQLFormattedError } from 'graphql';

const logger = new Logger('GraphQL');

const sandboxQuery =
  'query { profile { name description skills { name } experience { company position } projects { name } } }';

function graphqlCode(exception: HttpException): string {
  switch (exception.getStatus()) {
    case 400:
      return 'BAD_REQUEST';
    case 401:
      return 'UNAUTHENTICATED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    default:
      return 'INTERNAL_SERVER_ERROR';
  }
}

function redactDatabaseUrl(value: unknown): string {
  const url = process.env['DATABASE_URL'];
  const text = value instanceof Error ? value.message : String(value);
  if (!url) {
    return text;
  }
  return text.split(url).join('[redacted]');
}

export function formatGraphqlError(
  formattedError: GraphQLFormattedError,
  error: unknown,
): GraphQLFormattedError {
  const original =
    error instanceof GraphQLError ? error.originalError : undefined;

  if (original instanceof HttpException) {
    return {
      message: original.message,
      locations: formattedError.locations,
      path: formattedError.path,
      extensions: { code: graphqlCode(original) },
    };
  }

  logger.error(redactDatabaseUrl(original ?? error));
  return {
    message: 'Internal server error',
    locations: formattedError.locations,
    path: formattedError.path,
    extensions: { code: 'INTERNAL_SERVER_ERROR' },
  };
}

export function graphqlOptions(): ApolloDriverConfig {
  return {
    driver: ApolloDriver,
    autoSchemaFile: true,
    introspection: true,
    sortSchema: true,
    graphiql: false,
    playground: false,
    formatError: formatGraphqlError,
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({
        embed: true,
        document: sandboxQuery,
      }),
    ],
  };
}
