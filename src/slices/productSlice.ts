import { createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { client } from '../lib/urqlClient'
import { ADD_PRODUCT_MUTATION } from '@/graphql/mutations'
import { GET_PRODUCTS_QUERY } from '@/graphql/query';
import { RootState } from '@/lib/store';

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
}

const productsAdapter = createEntityAdapter()
const initialState = productsAdapter.getInitialState()

export const addProduct = createAsyncThunk(
    'products/addProduct',
    async ({ name, price, description }: { name: string, price: number, description: string }) => {
        const result = await client
            .mutation(ADD_PRODUCT_MUTATION, { name, price, description })
            .toPromise()
        return result.data.products
    }
)

export const getProducts = createAsyncThunk(
    'products/getProducts',
    async () => {
        const result = await client
            .query(GET_PRODUCTS_QUERY, {})
            .toPromise()
        return result.data.products
    }
)

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
            productsAdapter.addOne(state, action.payload)
        })
        builder.addCase(getProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
            productsAdapter.setAll(state, action.payload ?? [])
        })
    }
})

export const {
    selectAll: selectAllProducts,
} = productsAdapter.getSelectors((state: RootState) => state.products)

export default productSlice.reducer