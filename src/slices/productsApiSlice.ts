import { GET_PRODUCT_RATINGS, GET_PRODUCTS_QUERY } from "@/graphql/query";
import apiSlice from "./apiSlice";
import { Product } from "@/app/products/ProductList";
import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { ADD_PRODUCT_MUTATION } from "@/graphql/mutations";
import type { ColumnNames, Order } from "@/app/products/manage/page";

type ProductVarProps = {
    freeShipping?: boolean,
    minPrice?: number,
    maxPrice?: number,
    sort?: { dir: Order, type: ColumnNames }
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
        getAllProducts: builder.query<EntityState<Product, number>, ProductVarProps>({
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
                return productsAdapter.setAll(initialState, products);
            },
            providesTags: [{ type: 'Product', id: 'LIST' }]
        }),
        addNewProduct: builder.mutation<ProductVarProps, ProductVarProps>({
            query: (props) => ({
                url: 'api/graphql',
                method: 'POST',
                body: {
                    query: ADD_PRODUCT_MUTATION,
                    variables: props
                }
            })
        }),
        getProductRating: builder.query<{ count: number, average: number, productId: number }, number>({
            query: (id) => ({
                url: 'api/graphql',
                method: 'POST',
                body: {
                    query: GET_PRODUCT_RATINGS,
                    variables: { productId: id }
                }
            }),
            transformResponse: (responseData: GetProductRatingsResponse) => {
                return responseData.data.getProductRatings as { count: number, average: number, productId: number }
            }
        })
    })
})

export default productsApiSlice

export const { useGetAllProductsQuery, useAddNewProductMutation, useGetProductRatingQuery } = productsApiSlice