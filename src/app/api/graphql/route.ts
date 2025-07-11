// app/api/graphql/route.ts
import { createYoga, createSchema } from 'graphql-yoga';
import { NextRequest } from 'next/server';
import { prisma, User, Product, Review } from '@/lib/prisma'
import typeDefs from './typeDefs';


const yoga = createYoga({
  graphqlEndpoint: '/api/graphql',
  schema: createSchema({
    typeDefs, /* GraphQL */
    resolvers: {
      Query: {
        products: async (_, args: { page: number, pageSize: number }) => {

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
        productsByFilter: async (_, args) => {
          const { minValue, maxValue, freeShipping, averageRating, page, pageSize }:
            { minValue: number, maxValue: number, freeShipping: boolean, averageRating: number, page: number, pageSize: number } = args

          const priceFilter: { gte?: number, lte?: number } = {}
          if (minValue != null) {
            priceFilter.gte = minValue
          }
          if (maxValue != null) {
            priceFilter.lte = maxValue
          }

          if (averageRating) {
            const productAverages = await prisma.review.groupBy({
              by: ['productId'],
              _avg: {
                rating: true,
              },

            });

            const result = productAverages.filter(rating => {
              return (rating._avg.rating ?? 0) >= averageRating
            })

            const ids = result.map(r => r.productId);

            return prisma.product.findMany({
              where: {
                id: {
                  in: ids,
                },
              },
              skip: (page - 1) * pageSize,
              take: pageSize,
            }) || []
            
          }
          
          return prisma.product.findMany({
            where: {
              price: priceFilter,
              ...(freeShipping && { freeShipping: true }),
            },
            skip: (page - 1) * pageSize,
            take: pageSize 
          }) || []

        },
        productById: (_, { productId }) => {
          console.log('PRODUCTID: ', productId)
          return prisma.product.findFirst({ where: { id: productId } })
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
        },
        getCart: async (_, { userId }) => {
          const cart = await prisma.cart.findFirst({
            where: { userId, status: 'active' },
            include: { cartItems: { include: { products: true } } }
          })
          if (!cart) {
            return null
          }
          return cart
        },
      }, // query closing tag
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
        createCart: async (_, { userId }) => {
          const cart = await prisma.cart.findFirst({ where: { userId, status: 'active' } })
          if (!cart) {
            return await prisma.cart.create({
              data: {
                userId,
                status: 'active'
              }
            })
          } else {
            return cart
          }
        },
        addCartItem: async (_, args) => {
          const { productId, cartId, price, quantity } = args

          const duplicate = await prisma.cartItem.findFirst({ where: { productId, cartId } })

          if (duplicate) {
            return prisma.cartItem.update({
              data: {
                quantity: duplicate.quantity + quantity
              },
              where: {
                id: duplicate.id
              },
              include: { products: true }
            })
          } else {
            return prisma.cartItem.create({
              data: {
                productId,
                cartId,
                price,
                quantity,
              },
              include: { products: true }
            })
          }

        }
      }, // mutation closing tag
    },
  }),
  fetchAPI: { Request, Response },
});

export const GET = (req: NextRequest, ctx: any) => yoga.handleRequest(req, ctx);
export const POST = (req: NextRequest, ctx: any) => yoga.handleRequest(req, ctx);

