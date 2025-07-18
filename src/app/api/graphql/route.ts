// app/api/graphql/route.ts
import { createYoga, createSchema } from 'graphql-yoga';
import { NextRequest } from 'next/server';
import { createGraphQLError } from '@/lib/graphqlErrors';
import typeDefs from './typeDefs';
import prisma, { Product, Review, User } from '@/lib/prisma';

type ProductAverage = {
  productId: number;
  _avg: {
    rating: number | null;
  };
};

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
            throw createGraphQLError('Failed to fetch products', 'FETCH_PRODUCTS_ERROR')
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
              }) as ProductAverage[];

              const result = productAverages.filter((rating: ProductAverage) => {
                return (rating._avg.rating ?? 0) >= averageRating;
              });

              const ids = result.map((r: ProductAverage) => r.productId);

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
            throw createGraphQLError('Failed to filter products', 'FILTER_PRODUCTS_ERROR')
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
            throw createGraphQLError('Failed to fetch product', 'FETCH_PRODUCT_ERROR')
          }
        },
        reviews: async () => {
          try {
            return await prisma.review.findMany()
          } catch (error) {
            console.error('Error fetching reviews:', error)
            throw createGraphQLError('Failed to fetch reviews', 'FETCH_REVIEWS_ERROR')
          }
        },
        users: async () => {
          try {
            return await prisma.user.findMany()
          } catch (error) {
            console.error('Error fetching users:', error)
            throw createGraphQLError('Failed to fetch users', 'FETCH_USERS_ERROR')
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
              count: result?._count.rating ?? 0,
              average: result?._avg.rating ?? null
            }

            console.log('Ratings result:', ratings)
            
            return ratings
          } catch (error) {
            throw createGraphQLError('Failed to get product ratings', 'GET_PRODUCT_RATINGS_ERROR')
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
            throw createGraphQLError('Failed to get cart', 'GET_CART_ERROR')
          }
        },
      }, // query closing tag
      Mutation: {
        addProduct: async (_, { name, price, freeShipping, image }: Product) => {
          try {
            if (!name || typeof name !== 'string' || name.length < 3) {
              throw createGraphQLError('Product name is required, greater than 2 characters and must be a string.', 'INVALID_PRODUCT_NAME');
            }
            if (!image || typeof image !== 'string' || image.length < 3) {
              throw createGraphQLError('Image url is required, greater than 2 characters and must be a string.', 'INVALID_IMAGE_URL');
            }
            if (typeof price !== 'number' || price < 0) {
              throw createGraphQLError('Product price is required and must be a non-negative number.', 'INVALID_PRODUCT_PRICE');
            }
            if (freeShipping !== undefined && typeof freeShipping !== 'boolean') {
              throw createGraphQLError('freeShipping must be a boolean if provided.', 'INVALID_FREE_SHIPPING');
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
            throw createGraphQLError('Failed to add review', 'ADD_REVIEW_ERROR')
          }
        },
        addUser: async (_, { username, password, email }: User) => {
          try {
            return await prisma.user.create({
              data: { username, password, email },
            });
          } catch (error) {
            console.error('Error adding user:', error)
            throw createGraphQLError('Failed to add user', 'ADD_USER_ERROR')
          }
        },
        deleteProduct: async (_, args: { id: number }) => {
          try {
            return await prisma.product.delete({ where: { id: args.id } })
          } catch (error) {
            console.error('Error deleting product:', error)
            throw createGraphQLError('Failed to delete product', 'DELETE_PRODUCT_ERROR')
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
            throw createGraphQLError('Failed to create cart', 'CREATE_CART_ERROR')
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
            throw createGraphQLError('Failed to add cart item', 'ADD_CART_ITEM_ERROR')
          }
        }
      }, // mutation closing tag
    },
  }),
  fetchAPI: { Request, Response },
});

export const GET = (req: NextRequest, ctx: any) => yoga.handleRequest(req, ctx);
export const POST = (req: NextRequest, ctx: any) => yoga.handleRequest(req, ctx);

