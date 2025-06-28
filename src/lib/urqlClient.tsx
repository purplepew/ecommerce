// app/providers.tsx
'use client'

import { createClient, Provider } from 'urql'
import { cacheExchange, fetchExchange } from 'urql'

export const client = createClient({
  url: '/api/graphql',
  exchanges: [cacheExchange, fetchExchange],
})

export function UrqlProvider({ children }: { children: React.ReactNode }) {
  return <Provider value={client}>{children}</Provider>
}
