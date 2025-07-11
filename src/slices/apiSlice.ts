import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ 
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : ''),
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    endpoints: () => ({}),
    tagTypes: ['Product', 'Cart'],
    keepUnusedDataFor: 300, // 5 minutes
})

export default apiSlice