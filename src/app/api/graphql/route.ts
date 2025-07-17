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
          try {
            const { page, pageSize }: { page: number, pageSize: number } = args
            console.log('Fetching products with args:', args)

            const result = await prisma.product.findMany({
              orderBy: [
                { reviews: { _count: 'desc' } },
                { freeShipping: 'asc' },
                { price: 'asc' },
                { id: 'asc' }
              ],
              skip: (page - 1) * pageSize,
              take: pageSize,
            });

            console.log(`Found ${result.length} products`)
            return result;
          } catch (error) {
            console.error('Error fetching products:', error)
            throw new Error('Failed to fetch products')
          }
        },
        productsByFilter: async (_, args) => {
          try {
            const { minValue, maxValue, freeShipping, averageRating, page, pageSize }:
              { minValue: number, maxValue: number, freeShipping: boolean, averageRating: number, page: number, pageSize: number } = args

            console.log('Filtering products with args:', args)

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

              const result = productAverages.filter((rating) => {
                return (rating._avg.rating ?? 0) >= averageRating
              })

              const ids = result.map((r: { productId: number }) => r.productId);

              const products = await prisma.product.findMany({
                where: {
                  id: {
                    in: ids,
                  },
                },
                skip: (page - 1) * pageSize,
                take: pageSize,
              }) || []

              console.log(`Found ${products.length} products with rating filter`)
              return products
            }

            const products = await prisma.product.findMany({
              where: {
                price: priceFilter,
                ...(freeShipping && { freeShipping: true }),
              },
              skip: (page - 1) * pageSize,
              take: pageSize
            }) || []

            console.log(`Found ${products.length} products with price filter`)
            return products
          } catch (error) {
            console.error('Error filtering products:', error)
            throw new Error('Failed to filter products')
          }
        },
        productById: async (_, { productId }) => {
          try {
            console.log('Fetching product by ID:', productId)
            const product = await prisma.product.findFirst({ where: { id: productId } })
            console.log('Product found:', product ? 'yes' : 'no')
            return product
          } catch (error) {
            console.error('Error fetching product by ID:', error)
            throw new Error('Failed to fetch product')
          }
        },
        reviews: async () => {
          try {
            return await prisma.review.findMany()
          } catch (error) {
            console.error('Error fetching reviews:', error)
            throw new Error('Failed to fetch reviews')
          }
        },
        users: async () => {
          try {
            return await prisma.user.findMany()
          } catch (error) {
            console.error('Error fetching users:', error)
            throw new Error('Failed to fetch users')
          }
        },
        getProductRatings: async (_, args: { productId: number }) => {
          try {
            console.log('Getting ratings for product:', args.productId)
            const result = await prisma.review.aggregate({
              where: {
                productId: args.productId
              },
              _avg: { rating: true },
              _count: { rating: true },
            })

            const ratings = {
              count: result._count.rating,
              average: result._avg.rating
            }
            console.log('Ratings result:', ratings)
            return ratings
          } catch (error) {
            console.error('Error getting product ratings:', error)
            throw new Error('Failed to get product ratings')
          }
        },
        getCart: async (_, { userId }) => {
          try {
            console.log('Getting cart for user:', userId)
            const cart = await prisma.cart.findFirst({
              where: { userId, status: 'active' },
              include: { cartItems: { include: { products: true } } }
            })
            console.log('Cart found:', cart ? 'yes' : 'no')
            return cart
          } catch (error) {
            console.error('Error getting cart:', error)
            throw new Error('Failed to get cart')
          }
        },
      }, // query closing tag
      Mutation: {
        addProduct: async (_, { name, price, freeShipping, image }: Product) => {
          try {
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

            return await prisma.product.create({
              data: { name, price, freeShipping, image },
            });
          } catch (error) {
            console.error('Error adding product:', error)
            throw error
          }
        },
        addReview: async (_, { userId, productId, rating }: Review) => {
          try {
            return await prisma.review.create({
              data: { userId, productId, rating }
            })
          } catch (error) {
            console.error('Error adding review:', error)
            throw new Error('Failed to add review')
          }
        },
        addUser: async (_, { username, password, email }: User) => {
          try {
            return await prisma.user.create({
              data: { username, password, email },
            });
          } catch (error) {
            console.error('Error adding user:', error)
            throw new Error('Failed to add user')
          }
        },
        deleteProduct: async (_, args: { id: number }) => {
          try {
            return await prisma.product.delete({ where: { id: args.id } })
          } catch (error) {
            console.error('Error deleting product:', error)
            throw new Error('Failed to delete product')
          }
        },
        createCart: async (_, { userId }) => {
          try {
            const cart = await prisma.cart.findFirst({ where: { userId, status: 'active' } })
            if (cart) {
              return cart
            } else {
              return await prisma.cart.create({
                data: {
                  userId,
                  status: 'active'
                }
              })
            }
          } catch (error) {
            console.error('Error creating cart:', error)
            throw new Error('Failed to create cart')
          }
        },
        addCartItem: async (_, args) => {
          try {
            const { productId, cartId, price, quantity } = args

            const duplicate = await prisma.cartItem.findFirst({ where: { productId, cartId } })

            if (duplicate) {
              return await prisma.cartItem.update({
                data: {
                  quantity: duplicate.quantity + quantity
                },
                where: {
                  id: duplicate.id
                },
                include: { products: true }
              })
            } else {
              return await prisma.cartItem.create({
                data: {
                  productId,
                  cartId,
                  price,
                  quantity,
                },
                include: { products: true }
              })
            }
          } catch (error) {
            console.error('Error adding cart item:', error)
            throw new Error('Failed to add cart item')
          }
        }
      }, // mutation closing tag
    },
  }),
  fetchAPI: { Request, Response },
});

export const GET = (req: NextRequest, ctx: any) => yoga.handleRequest(req, ctx);
export const POST = (req: NextRequest, ctx: any) => yoga.handleRequest(req, ctx);

