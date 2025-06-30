import { GET_PRODUCTS_QUERY } from "@/graphql/query";
import apiSlice from "./apiSlice";
import { Product } from "@/app/products/ProductList";
import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";

type VariablesProps = {
    freeShipping?: boolean,
    minPrice?: number,
    maxPrice?: number,
    search?: string
}

const productsAdapter = createEntityAdapter<Product>()
const initialState = productsAdapter.getInitialState()

const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllProducts: builder.query<EntityState<Product, number>, VariablesProps>({
            query: (filters) => ({
                url: '/api/graphql',
                method: 'POST',
                body: {
                    query: GET_PRODUCTS_QUERY,
                    variables: filters
                }
            }),
            transformResponse: (responseData: { data: { products: Product[] } }) => {
                return productsAdapter.setAll(initialState, responseData.data.products)
            }
        })
    })
})

export default productsApiSlice

export const { useGetAllProductsQuery } = productsApiSlice