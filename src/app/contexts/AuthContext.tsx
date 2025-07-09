import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'
import { ICart } from '@/slices/cartApiSlice';

export interface UserToken {
    id: number, name: string, email: string, pfp: string, cart: ICart
}

interface AuthContextType {
    user: UserToken | null;
    loading: boolean;
    refresh: () => Promise<void>;
    setCart: (cart: ICart) => void
}


const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    refresh: async () => { },
    setCart: (cart: ICart) => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserToken | null>(null);
    const [loading, setLoading] = useState(true);

    const setCart = (cart: ICart) => {
        if(user){
            setUser({...user, cart})
        }
    }

    const refresh = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/refreshToken`)
            const { accessToken } = await res.json()

            const decoded = jwtDecode(accessToken) as { UserInfo: UserToken }

            setUser(decoded.UserInfo)

        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refresh();
    }, [])


    return (
        <AuthContext.Provider value={{ user, loading, refresh, setCart }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
