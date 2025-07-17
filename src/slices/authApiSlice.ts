import apiSlice from "./apiSlice";
import { setCredentials } from "./authSlice";

const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        refresh: builder.query<string, void>({
            query: () => ({
                url: 'api/refreshToken',
                method: 'GET',
            }),
            transformResponse: (responseData: { accessToken: string }) => {
                return responseData?.accessToken
            },
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled
                    dispatch(setCredentials(data))
                } catch (error) {
                    console.log(error)
                }
            }
        }),
        logout: builder.mutation<string, void>({
            query: () => ({
                url: 'api/logout',
                method: 'POST'
            }),
            transformResponse: (responseData: { data: { message: string } }) => {
                return responseData.data.message
            }
        })
    })
})

export default authApiSlice

export const { useRefreshQuery, useLogoutMutation } = authApiSlice

