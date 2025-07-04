import { configureStore, Store } from '@reduxjs/toolkit'
import apiSlice from '@/slices/apiSlice'
import productsReducer from '@/slices/productSlice'

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        products: productsReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch