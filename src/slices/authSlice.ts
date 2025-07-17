import { createSlice } from "@reduxjs/toolkit";
import { ICart } from "./cartApiSlice";
import { RootState } from "@/lib/store";

export interface UserToken {
    id: number, name: string, email: string, pfp: string, cart: ICart
}

const initialState: {
    token: string | null,
    user: UserToken | null,
    cart: ICart | null
} = {
    token: null,
    user: null,
    cart: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: { payload: string }) => {
            state.token = action.payload
        },
        logout: (state) => {
            state.token = null
        },
        setCart: (state, action: { payload: ICart }) => {
            state.cart = action.payload
        },
        setUserInfo: (state, action: { payload: UserToken }) => {
            state.user = action.payload
        }
    }
})

export const { setCredentials, logout, setCart, setUserInfo } = authSlice.actions

export const selectCurrentToken = (state: RootState) => state.auth.token
export const selectCurrentCart = (state: RootState) => state.auth.cart

export default authSlice.reducer