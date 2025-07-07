// app/api/graphql/route.ts
import { createYoga, createSchema } from 'graphql-yoga';
import { NextRequest } from 'next/server';
import { prisma, User, Product, Review } from '@/lib/prisma'
import { createClient } from 'pexels'
import { ColumnNames, Order } from '@/slices/productsApiSlice';

if (!process.env.PEXELS_API_KEY) {
  throw Error('PEXELS API KEY ENV IS EMPTY.')
}

const client = createClient(process.env.PEXELS_API_KEY)

const yoga = createYoga({
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
  reviews: [Review!]
  image: String
  ratingsAverage: Float
  ratingsCount: Int
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

type ProductRatingsResult {
  count: Int!
  average: Float
}

input SortInput {
  dir: String! 
  type: String! 
}

type Query {
 products(page: Int, pageSize: Int): [Product!]!
 getProductRatings(productId: Int!): ProductRatingsResult!
 reviews: [Review!]!
 users: [User!]!
}

type Mutation {
  addProduct(name: String!, price: Float!, image: String!, freeShipping: Boolean): Product!
  addReview(productId: Int!, userId: Int!, rating: Int!): Review!
  addUser( email: String!, username: String, password: String ): User!
  deleteProduct(id: Int!): Product
  addProductsBulk(numberOfProducts: Int!): [Product!]!
}
    `,
    resolvers: {
      Query: {
        products: async (_, args: {
          page: number,
          pageSize: number,
        }) => {

          const { page, pageSize } = args

          return prisma.product.findMany({
            orderBy: [
              { reviews: { _count: 'desc' } },
              { freeShipping: 'asc' },
              { price: 'asc' },
              { id: 'asc' }
            ],
            skip: (page - 1) * pageSize,
            take: pageSize,
          });
        },
        reviews: () => prisma.review.findMany(),
        users: () => prisma.user.findMany(),
        getProductRatings: async (_, args: { productId: number }) => {
          const result = await prisma.review.aggregate({
            where: {
              productId: args.productId
            },
            _avg: { rating: true },
            _count: { rating: true },
          })

          return {
            count: result._count.rating,
            average: result._avg.rating
          }
        }
      },
      Mutation: {
        addProduct: async (_, { name, price, freeShipping, image }: Product) => {
          if (!name || typeof name !== 'string' || name.length < 3) {
            throw new Error('Product name is required, greater than 2 characters and must be a string.');
          }
          if (!image || typeof image !== 'string' || image.length < 3) {
            throw new Error('Image url is required, greater than 2 characters and must be a string.');
          }
          if (typeof price !== 'number' || price < 0) {
            throw new Error('Product price is required and must be a non-negative number.');
          }
          if (freeShipping !== undefined && typeof freeShipping !== 'boolean') {
            throw new Error('freeShipping must be a boolean if provided.');
          }

          return prisma.product.create({
            data: { name, price, freeShipping, image },
          });
        },
        addReview: async (_, { userId, productId, rating }: Review) => {
          return prisma.review.create({
            data: { userId, productId, rating }
          })
        },
        addUser: async (_, { username, password, email }: User) => {
          return prisma.user.create({
            data: { username, password, email },
          });
        },
        deleteProduct: (_, args: { id: number }) => {
          return prisma.product.delete({ where: { id: args.id } })
        },
        addProductsBulk: async (_, args) => {
          const { numberOfProducts } = args as { numberOfProducts: number }

          const createProduct = ({ name, price, image }: { name: string, price: number, image: string }) => {
            const result = prisma.product.create({ data: { name, price, image } })
            return result
          }

          const getRandomPrice = () => {
            return (Math.random() * (10000 - 10) + 10).toFixed(2);
          };

          try {
            const res = await client.photos.search({ query: 'product', per_page: numberOfProducts });
            if ('photos' in res && Array.isArray(res.photos) && res.photos.length > 0) {
              const products = res.photos.map((photo) => ({
                name: photo.alt ?? 'Unknown',
                image: photo.src.large,
                price: getRandomPrice()
              }));

              const createdProducts = await Promise.all(
                products.map(product =>
                  createProduct({ name: product.name, price: Number(product.price), image: product.image })
                )
              )

              return createdProducts

            } else {
              console.log('No photos found.');
            }
          } catch (error) {
            console.error('Error fetching from Pexels:', error);
          }
        },
      },
    },
  }),
  fetchAPI: { Request, Response },
});

export const GET = (req: NextRequest, ctx: any) => yoga.handleRequest(req, ctx);
export const POST = (req: NextRequest, ctx: any) => yoga.handleRequest(req, ctx);

