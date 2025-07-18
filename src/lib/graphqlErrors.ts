
import { GraphQLError } from 'graphql';

export const createGraphQLError = (message: string, code: string) => {
  return new GraphQLError(message, {
    extensions: {
      code,
    },
  });
};
