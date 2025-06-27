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
     scalar DateTime

type Product {
  id: Int!
  name: String!
  price: Float!
  freeShipping: Boolean
  createdAt: DateTime
  updatedAt: DateTime
  reviews: [Review!]!
  image: String
}

type Review {
  id: Int!
  productId: Int!
  userId: Int!
  rating: Int!
  createdAt: DateTime
  updatedAt: DateTime
  product: Product!
  user: User!
}

type User {
  id: Int!
  username: String!
  password: String!
  createdAt: DateTime
  updatedAt: DateTime
  reviews: [Review!]!
}

type ProductRating {
  count: Int!
  average: Float
  productId: Int!
}

type Query {
  products: [Product!]!
  reviews: [Review!]!
  users: [User!]!
  getProductRatings(productId: Int!): ProductRating!
}

type Mutation {
  addProduct(name: String!, price: Float!, freeShipping: Boolean): Product!
  addReview(productId: Int!, userId: Int!, rating: Int!): Review!
  addUser(username: String!, password: String!): User!
}
    `,
    resolvers: {
      Query: {
        products: () => prisma.product.findMany(),
        reviews: () => prisma.review.findMany(),
        users: () => prisma.user.findMany(),
        getProductRatings: async (_: any, { productId }: { productId: number }) => {
          const result = await prisma.review.aggregate({
            _avg: {
              rating: true
            },
            _count: {
              rating: true
            },
            where: {
              productId: productId
            }
          })

          return {
            count: result._count.rating,
            average: result._avg.rating,
            productId
          }
        }
      },
      Mutation: {
        addProduct: async (_: any, { name, price, freeShipping, image }: any) => {
          return prisma.product.create({
            data: { name, price, freeShipping, image },
          });
        },
        addReview: async (_: any, { userId, productId, rating }: any) => {
          return prisma.review.create({
            data: { userId, productId, rating }
          })
        },
        addUser: async (_: any, { username, password }: any) => {
          return prisma.user.create({
            data: { username, password },
          });
        }
      },
    },
  }),
  fetchAPI: { Request, Response },
});

export { yoga as GET, yoga as POST };
