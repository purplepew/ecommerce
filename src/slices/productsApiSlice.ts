import { GET_PRODUCT_BY_ID, GET_PRODUCT_RATINGS, GET_PRODUCTS_BY_FILTER, GET_PRODUCTS_QUERY, } from "@/graphql/query";
import apiSlice from "./apiSlice";
import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { ADD_PRODUCT_MUTATION } from "@/graphql/mutations";
import type { Product } from "@/lib/prisma";
import { addManyProducts, updateProduct } from '@/slices/productSlice'

export type ColumnNames = 'id' | 'name' | 'price' | 'freeShipping' | 'image' | 'ratings'
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

const productsAdapter = createEntityAdapter<Product>()
const initialState = productsAdapter.getInitialState()

const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getProductsInChunks: builder.query<EntityState<Product, number>, ProductQueryArgs>({
            query: (args) => ({
                url: '/api/graphql',
                method: 'POST',
                body: {
                    query: GET_PRODUCTS_QUERY,
                    variables: args
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

                    const products = data.ids.map(id => {
                        return data.entities[id]
                    })
                    dispatch(addManyProducts(products))
                } catch (error) {
                    console.log(error)
                }
            }
        }),
        addNewProduct: builder.mutation<AddProductMutationProps, AddProductMutationProps>({
            query: (props) => ({
                url: '/api/graphql',
                method: 'POST',
                body: {
                    query: ADD_PRODUCT_MUTATION,
                    variables: props
                }
            })
        }),
        getProductRatings: builder.query<{ average: number, count: number }, { productId: number }>({
            query: (arg) => ({
                url: '/api/graphql',
                method: 'POST',
                body: {
                    query: GET_PRODUCT_RATINGS,
                    variables: arg
                }
            }),
            transformResponse: (responseData: { data: { getProductRatings: { average: number, count: number } } }) => {
                return responseData.data.getProductRatings
            },
            onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled
                    if (data.average == null && data.count == 0) return
                    dispatch(
                        updateProduct({
                            id: args.productId,
                            changes: {
                                ratingsAverage: data.average,
                                ratingsCount: data.count,
                            },
                        })
                    );
                } catch (error) {

                }
            }
        }),
        getProductById: builder.query<Product, { productId: number }>({
            query: (arg) => ({
                url: '/api/graphql',
                method: 'POST',
                body: {
                    query: GET_PRODUCT_BY_ID,
                    variables: arg,
                }
            }),
            transformResponse: (responseData: { data: { productById: Product } }) => {
                return responseData.data.productById
            }
        }),
        getProductByFilters: builder.query<EntityState<Product, number>, {
            minValue?: number | null,
            maxValue?: number | null,
            freeShipping?: boolean | null,
            averageRating?: number | null,
            page: number,
            pageSize: number
        }>({
            query: (filters) => ({
                url: '/api/graphql',
                method: 'POST',
                body: {
                    query: GET_PRODUCTS_BY_FILTER,
                    variables: filters
                }
            }),
            transformResponse: (responseData: { data: { productsByFilter: Product[] } }) => {
                const products = responseData?.data?.productsByFilter ?? []
                return productsAdapter.upsertMany(initialState, products)
            },
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled

                    const products = data.ids.map(id => {
                        return data.entities[id]
                    })
                    dispatch(addManyProducts(products))
                } catch (error) {
                    console.log(error)
                }
            }
        })
    })
})

export default productsApiSlice
export const { useGetProductsInChunksQuery,
    useAddNewProductMutation,
    useGetProductRatingsQuery,
    useGetProductByIdQuery,
    useGetProductByFiltersQuery
} = productsApiSlice
