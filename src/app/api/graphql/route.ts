// app/api/graphql/route.ts
import { createYoga, createSchema } from 'graphql-yoga';
import { NextRequest } from 'next/server';
import { prisma } from '../../../lib/prisma'


const yoga = createYoga<{
  req: NextRequest;
}>({
  graphqlEndpoint: '/api/graphql',
  schema: createSchema({
    typeDefs: /* GraphQL */ `
      type Product {
        id: Int!
        name: String!
        price: Float!
        description: String!
        createdAt: String!
      }

      type Query {
        products: [Product!]!
      }

      type Mutation {
        addProduct(name: String!, price: Float!, description: String!): Product!
      }
    `,
    resolvers: {
      Query: {
        products: async () => {
          return prisma.product.findMany();
        },
      },
      Mutation: {
        addProduct: async (_: any, { name, price, description }: any) => { 
          return prisma.product.create({
            data: { name, price, description },
          });
        },
      },
    },
  }),
  fetchAPI: { Request, Response },
});

export { yoga as GET, yoga as POST };
