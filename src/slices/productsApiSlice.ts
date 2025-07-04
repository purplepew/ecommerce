import { GET_PRODUCTS_QUERY } from "@/graphql/query";
import apiSlice from "./apiSlice";
import { createEntityAdapter,  EntityState } from "@reduxjs/toolkit";
import { ADD_PRODUCT_MUTATION } from "@/graphql/mutations";
import type { Product } from "@/lib/prisma";
import { addManyProducts } from '@/slices/productSlice'

export type ColumnNames = 'id' | 'name' | 'price' | 'freeShipping' | 'image'
export type Order = 'asc' | 'desc'

interface ProductQueryArgs {
    page?: number | null,
    pageSize?: number | null,
    sort?: {
        type: ColumnNames,
        dir: Order
    },
    averageRatings?: number | null
}

interface AddProductMutationProps {
    name: string,
    price: number,
    freeShipping: boolean,
    image: string
}

type GetProductsResponse = {
    data?: {
        products?: Product[]
    }
}

type GetProductRatingsResponse = {
    data: {
        getProductRatings: {
            count: number, average: number
        }
    }
}

const productsAdapter = createEntityAdapter<Product>()
const initialState = productsAdapter.getInitialState()

const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getProductsInChunks: builder.query<EntityState<Product, number>, ProductQueryArgs>({
            query: (filters) => ({
                url: 'api/graphql',
                method: 'POST',
                body: {
                    query: GET_PRODUCTS_QUERY,
                    variables: filters
                }
            }),
            transformResponse: (responseData: GetProductsResponse) => {
                const products = responseData?.data?.products ?? [];
                return productsAdapter.upsertMany(initialState, products);
            },
            providesTags: [{ type: 'Product', id: 'LIST' }],
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled
                    dispatch(addManyProducts(data.ids.map((id: number) => data.entities[id] as Product)))
                } catch (error) {
                    console.log(error)
                }
            }
        }),
        addNewProduct: builder.mutation<AddProductMutationProps, AddProductMutationProps>({
            query: (props) => ({
                url: 'api/graphql',
                method: 'POST',
                body: {
                    query: ADD_PRODUCT_MUTATION,
                    variables: props
                }
            })
        }),
    })
})

export default productsApiSlice
export const { useGetProductsInChunksQuery, useAddNewProductMutation } = productsApiSlice
