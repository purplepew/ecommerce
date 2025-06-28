import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'

export interface UserToken {
    name: string, email: string, pfp: string
}

interface AuthContextType {
    user: UserToken | null;
    loading: boolean;
    refresh: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    refresh: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserToken | null>(null);
    const [loading, setLoading] = useState(true);

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
        <AuthContext.Provider value={{ user, loading, refresh }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
