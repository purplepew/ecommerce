// app/api/graphql/route.ts
import { createYoga, createSchema } from 'graphql-yoga';
import { NextRequest } from 'next/server';
import { prisma } from '../../../lib/prisma'
import { equal, strictEqual } from 'assert';

type ColumnNames = 'id' | 'name' | 'price' | 'freeShipping'
type Order = 'asc' | 'desc'
type Sort = { dir: Order, type: ColumnNames }


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
  email: String!
  username: String
  password: String
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
 products(freeShipping: Boolean, minPrice: Float, maxPrice: Float, sort: SortInput): [Product!]!
  reviews: [Review!]!
  users: [User!]!
  getProductRatings(productId: Int!): ProductRating!
}

input SortInput {
  dir: String! # "asc" or "desc"
  type: String! # "id", "name", "price", "freeShipping"
}

type Mutation {
  addProduct(name: String!, price: Float!, image: String!, freeShipping: Boolean): Product!
  addReview(productId: Int!, userId: Int!, rating: Int!): Review!
  addUser( email: String!, username: String, password: String ): User!
}
    `,
    resolvers: {
      Query: {
        products: async (_parent, args) => {
          const { freeShipping, minPrice, maxPrice, sort }:
            { freeShipping: boolean, minPrice: number, maxPrice: number, sort: Sort } = args;
          console.log('ARGS: ', args)

          return prisma.product.findMany({
            where: {
              ...(typeof freeShipping == 'boolean' && freeShipping && { freeShipping: { equals: true } }),
              ...(minPrice && maxPrice && { price: { gte: minPrice, lte: maxPrice } }),
            },
            ...(sort?.type && sort?.dir && {
              orderBy: {
                [sort.type]: sort.dir,
              },
            }),
          })
        },
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
        addUser: async (_: any, { username, password, email }: any) => {
          return prisma.user.create({
            data: { username, password, email },
          });
        }
      },
    },
  }),
  fetchAPI: { Request, Response },
});

export { yoga as GET, yoga as POST };
