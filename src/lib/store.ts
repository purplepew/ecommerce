import { configureStore, Store } from '@reduxjs/toolkit'
import apiSlice from '@/slices/apiSlice'
import productsReducer from '@/slices/productSlice'
import authReducer from '@/slices/authSlice'

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        products: productsReducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch