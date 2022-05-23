import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.URL_SERVER;

export const authService = createApi({
    reducerPath: "authService",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/auth`,
        prepareHeaders(headers) {
            return headers;
        },
    }),
    endpoints: (build) => ({
        postLogin: build.mutation({
            query: (data) => ({
                url: `/login`,
                method: "POST",
                body: data,
            }),
        })
    }),
});

export const {usePostLoginMutation} = authService;
