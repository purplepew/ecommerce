import { GET_PRODUCTS_QUERY } from "@/graphql/query";
import apiSlice from "./apiSlice";
import { Product } from "@/app/products/ProductList";
import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { ADD_PRODUCT_MUTATION } from "@/graphql/mutations";

type ProductVarProps = {
    freeShipping?: boolean,
    minPrice?: number,
    maxPrice?: number,
    search?: string
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
            transformResponse: (responseData: { data?: { products?: Product[] } }) => {
                const products = responseData?.data?.products ?? [];
                return productsAdapter.setAll(initialState, products);
            }
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
        })
    })
})

export default productsApiSlice

export const { useGetAllProductsQuery, useAddNewProductMutation } = productsApiSlice