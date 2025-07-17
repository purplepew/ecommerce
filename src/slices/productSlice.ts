import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { Product } from '@/lib/prisma'
import { RootState } from "@/lib/store";

const productsAdapter = createEntityAdapter <Product>({
})

const initialState = productsAdapter.getInitialState()

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        addManyProducts: productsAdapter.upsertMany,
        updateProduct: productsAdapter.updateOne
    }
})

export const { addManyProducts, updateProduct } = productsSlice.actions

export const {
    selectAll: selectAllProducts,
    selectById: selectProductById
} = productsAdapter.getSelectors((state: RootState) => state.products ?? initialState)

export default productsSlice.reducer