import { GET_PRODUCT_BY_ID, GET_PRODUCT_RATINGS, GET_PRODUCTS_BY_FILTER, GET_PRODUCTS_QUERY, } from "@/graphql/query";
import apiSlice from "./apiSlice";
import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { ADD_PRODUCT_MUTATION } from "@/graphql/mutations";
import type { Product } from "@/lib/prisma";
import { addManyProducts, updateProduct } from '@/slices/productSlice'

export type ProductColumnNames = 'id' | 'name' | 'price' | 'freeShipping' | 'image' | 'ratings'
export type SortOrder = 'asc' | 'desc'

interface ProductQueryArgs {
    page?: number | null,
    pageSize?: number | null,
    sort?: {
        type: ProductColumnNames,
        dir: SortOrder
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
            query: (args) => {
                console.log('RTK Query - getProductsInChunks args:', args)
                return {
                    url: '/api/graphql',
                    method: 'POST',
                    body: {
                        query: GET_PRODUCTS_QUERY,
                        variables: args
                    }
                }
            },
            transformResponse: (responseData: GetProductsResponse) => {
                console.log('RTK Query - getProductsInChunks response:', responseData)
                const products = responseData?.data?.products ?? [];
                console.log('RTK Query - transformed products count:', products.length)
                return productsAdapter.upsertMany(initialState, products);
            },
            providesTags: [{ type: 'Product', id: 'LIST' }],
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled
                    console.log('RTK Query - getProductsInChunks onQueryStarted data:', data)

                    const products = data.ids.map(id => {
                        return data.entities[id]
                    })
                    dispatch(addManyProducts(products))
                } catch (error) {
                    console.error('RTK Query - getProductsInChunks onQueryStarted error:', error)
                }
            }
        }),
        addNewProduct: builder.mutation<AddProductMutationProps, AddProductMutationProps>({
            query: (props) => {
                console.log('RTK Query - addNewProduct props:', props)
                return {
                    url: '/api/graphql',
                    method: 'POST',
                    body: {
                        query: ADD_PRODUCT_MUTATION,
                        variables: props
                    }
                }
            }
        }),
        getProductRatings: builder.query<{ average: number, count: number }, { productId: number }>({
            query: (arg) => {
                console.log('RTK Query - getProductRatings arg:', arg)
                return {
                    url: '/api/graphql',
                    method: 'POST',
                    body: {
                        query: GET_PRODUCT_RATINGS,
                        variables: arg
                    }
                }
            },
            transformResponse: (responseData: { data: { getProductRatings: { average: number, count: number } } }) => {
                console.log('RTK Query - getProductRatings response:', responseData)
                return responseData?.data?.getProductRatings
            },
            onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
                try {
                    const data = await queryFulfilled as unknown as { average: number; count: number }
                    if (data?.average == null && data?.count == 0) return;
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
                    console.error('RTK Query - getProductRatings onQueryStarted error:', error)
                }
            }
        }),
        getProductById: builder.query<Product, { productId: number }>({
            query: (arg) => {
                console.log('RTK Query - getProductById arg:', arg)
                return {
                    url: '/api/graphql',
                    method: 'POST',
                    body: {
                        query: GET_PRODUCT_BY_ID,
                        variables: arg,
                    }
                }
            },
            transformResponse: (responseData: { data: { productById: Product } }) => {
                console.log('RTK Query - getProductById response:', responseData)
                return responseData?.data?.productById
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
            query: (filters) => {
                console.log('RTK Query - getProductByFilters filters:', filters)
                return {
                    url: '/api/graphql',
                    method: 'POST',
                    body: {
                        query: GET_PRODUCTS_BY_FILTER,
                        variables: filters
                    }
                }
            },
            transformResponse: (responseData: { data: { productsByFilter: Product[] } }) => {
                console.log('RTK Query - getProductByFilters response:', responseData)
                const products = responseData?.data?.productsByFilter ?? []
                console.log('RTK Query - getProductByFilters transformed products count:', products.length)
                return productsAdapter.upsertMany(initialState, products)
            },
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled
                    console.log('RTK Query - getProductByFilters onQueryStarted data:', data)

                    const products = data.ids.map(id => {
                        return data.entities[id]
                    })
                    dispatch(addManyProducts(products))
                } catch (error) {
                    console.error('RTK Query - getProductByFilters onQueryStarted error:', error)
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
