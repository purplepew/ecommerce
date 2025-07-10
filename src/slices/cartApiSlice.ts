import { GET_CART } from "@/graphql/query";
import apiSlice from "./apiSlice";
import { Product } from "@/lib/prisma";
import { ADD_CART_ITEM } from "@/graphql/mutations";

export interface ICart {
    id: number,
    userId: number,
    status: string,
    createdAt: Date,
    updatedAt: Date,
    cartItems: { products: Product, quantity: number }[],
    quantity: number
}

type GetCartResponse = {
    getCart: ICart
}


const cartApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCart: builder.query<ICart, { userId: number }>({
            query: ({ userId }) => ({
                url: '/api/graphql',
                method: 'POST',
                body: {
                    query: GET_CART,
                    variables: { userId }
                }
            }),
            providesTags: [{ type: 'Cart', id: 'LIST' }],
            transformResponse: (responseData: { data: GetCartResponse }) => {
                return responseData.data.getCart
            }
        }),
        addToCart: builder.mutation<{data:{ data: { addCartItem: {}}}}, { productId: number, cartId: number, price: number, quantity: number }>({
            query: (args) => ({
                url: '/api/graphql',
                method: 'POST',
                body: {
                    query: ADD_CART_ITEM,
                    variables: args
                }
            }),
            invalidatesTags: [{ type: 'Cart', id: 'LIST' }]
        })
    })
})

export const { useGetCartQuery, useAddToCartMutation } = cartApiSlice

export default cartApiSlice