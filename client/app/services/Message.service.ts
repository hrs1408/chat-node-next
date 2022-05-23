import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {IResponseListObject} from "../models/ResponseObject";
import {IMessage, MessageType} from "../models/Message";
import Cookies from "universal-cookie";

const BASE_URL = process.env.URL_API;

type SendMessage = {
    text: string;
    images?: string[];
    roomId: string;
    type?: string;
}

type GetMessages = {
    roomId: string;
    limit: number;
}

export const messageService = createApi({
    reducerPath: "messageService",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/message`,
        prepareHeaders(headers) {
            const cookies = new Cookies();
            const token = cookies.get("auth");
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['IMessage'],
    endpoints: (build) => ({
        getMessageByRoom: build.query<IResponseListObject<IMessage>, GetMessages>({
            query: (data) => `/${data.roomId}?limit=${data.limit}`,
            providesTags: ['IMessage'],
        }),
        sendMessage: build.mutation<void, SendMessage>({
            query: ({text, roomId, images}) => ({
                method: 'POST',
                url: `/${roomId}`,
                body: {text, images}
            }),
        })
    }),
});

export const {useGetMessageByRoomQuery, useSendMessageMutation} = messageService;
