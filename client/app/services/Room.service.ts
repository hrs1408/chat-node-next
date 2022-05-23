import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import Cookies from "universal-cookie";
import {IRoom} from "../models/Room";
import {IResponseObject} from "../models/ResponseObject";
import {IUser} from "../models/User";

const BASE_URL = process.env.URL_API;

type RequestCreateRoom = {
    name: string;
    members: string[];
}

export const roomService = createApi({
    reducerPath: "roomService",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/room`,
        prepareHeaders(headers) {
            const cookies = new Cookies();
            const token = cookies.get("auth");
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['IRoom'],
    endpoints: (build) => ({
        getRoom: build.query<IResponseObject<{
            room: IRoom
            total_message: number
        }>, string>({
            query: (id) => `/${id}`,
            providesTags: ['IRoom'],
        }),
        createRoom: build.mutation<IRoom, RequestCreateRoom>({
            query: (data) => ({
                method: 'POST',
                url: `/`,
                body: data
            }),
            invalidatesTags: ['IRoom'],
        }),
        leaveRoom: build.mutation<void, string>({
            query: (id) => ({
                method: 'GET',
                url: `/leave-room/${id}`,
            }),
            invalidatesTags: ['IRoom'],
        }),
        changeRoomName: build.mutation<void, { roomId: string, roomName: string }>({
            query: (data) => ({
                method: 'PUT',
                url: `/change-room-name`,
                body: data
            }),
        }),
        changeRoomAvatar: build.mutation<void, { roomId: string, avatar: string }>({
            query: (data) => ({
                method: 'PUT',
                url: `/change-room-avatar`,
                body: data
            }),
        }),
        addMemberToRoom: build.mutation<void, {roomId: string, members: IUser[]}>({
            query: (data) => ({
                url: '/add-member-to-room',
                method: 'PUT',
                body: data
            }),
        })
    })
})

export const {
    useGetRoomQuery,
    useCreateRoomMutation,
    useLeaveRoomMutation,
    useChangeRoomNameMutation,
    useChangeRoomAvatarMutation,
    useAddMemberToRoomMutation
} = roomService;
