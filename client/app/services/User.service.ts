import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {IUser} from "../models/User";
import {IResponseObject} from "../models/ResponseObject";
import Cookies from "universal-cookie";

const BASE_URL = process.env.URL_API;

interface IAddFriend {
    email: string;
}

interface IRemoveFriendPending {
    userId: string;
}

interface IAcceptFriend {
    userId: string;
}

interface IUpdateUser {
    full_name: string;
    avatar: string;
    number_phone: string;
    address: string;
}

type RequestChangePassword = {
    password: string;
    confirm_password: string;
    is_first_login: boolean;
}

export const userService = createApi({
    reducerPath: "userService",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/user`,
        prepareHeaders(headers) {
            const cookies = new Cookies();
            const token = cookies.get("auth");
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['IUser'],
    endpoints: (build) => ({
        getUser: build.query<IResponseObject<IUser>, void>({
            query: () => `/get-user`,
            providesTags: ['IUser'],
        }),
        addFriend: build.mutation<any, IAddFriend>({
            query: (data) => ({
                method: 'POST',
                url: `/add-friend`,
                body: data
            }),
            invalidatesTags: ['IUser'],
        }),
        removeFriendRequest: build.mutation<void, IRemoveFriendPending>({
            query: (data) => ({
                method: 'POST',
                url: `/cancel-friend-pending`,
                body: data
            }),
            invalidatesTags: ['IUser'],
        }),
        acceptFriendRequest: build.mutation<void, IAcceptFriend>({
            query: (data) => ({
                method: 'POST',
                url: `/accept-friend`,
                body: data
            }),
        }),
        updateUser: build.mutation<IUser, IUpdateUser>({
            query: (data) => ({
                method: 'POST',
                url: `/update-user`,
                body: data
            }),
            invalidatesTags: ['IUser'],
        }),
        cancelFriend: build.mutation<void, string>({
            query: (id) => ({
                method: 'POST',
                url: `/cancel-friend`,
                body: {
                    userId: id
                }
            }),
        }),
        changePassword: build.mutation<void, RequestChangePassword>({
            query: (data) => ({
                method: 'POST',
                url: `/change-password`,
                body: data
            }),
        })
    }),
});

export const {
    useGetUserQuery,
    useAddFriendMutation,
    useRemoveFriendRequestMutation,
    useAcceptFriendRequestMutation,
    useUpdateUserMutation,
    useCancelFriendMutation,
    useChangePasswordMutation
} = userService;