import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { selectCurrentCart, selectCurrentToken } from "@/slices/authSlice";
import { ICart, useGetCartQuery } from "@/slices/cartApiSlice";
import { useEffect, useState } from "react";

export interface UserToken {
    id: number, name: string, email: string, pfp: string, cart: ICart
}

export default function useAuth() {
    const [userId, setUserId] = useState<null | number>(null)
    const token = useSelector(selectCurrentToken)

    const { data } = useGetCartQuery({ userId: userId as number }, { skip: !Boolean(userId) })

    if (token) {
        const decoded = jwtDecode(token) as { UserInfo: UserToken }
        if (!userId && !data) {
            setUserId(decoded.UserInfo.id)
        } else {
            return { ...decoded.UserInfo, cart: data }
        }
    }
    return { id: null, name: null, email: null, pfp: null, cart: null }
}