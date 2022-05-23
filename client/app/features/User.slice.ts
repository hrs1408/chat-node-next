import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../models/User";
import { IRoom } from "../models/Room";
import { userService } from "../services/User.service";
import { IResponseObject } from "../models/ResponseObject";

interface IState {
    user: IUser;
}

const initialState: IState = {
    user: {
        _id: "",
        email: "",
        full_name: "",
        address: "",
        phone: "",
        avatar: "",
        rooms: [],
        friends: [],
        friend_pending: [],
        is_first_login: false,
    },
};

const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        addFriendRequest: (state, action: PayloadAction<IUser>) => {
            state.user.friend_pending.push(action.payload);
        },
        removeFriendRequest: (state, action: PayloadAction<{ userId: string }>) => {
            state.user.friend_pending = state.user.friend_pending.filter(
                (friend) => friend._id !== action.payload.userId
            );
        },
        addRoom: (state, action: PayloadAction<IRoom>) => {
            state.user.rooms.push(action.payload);
        },
        addFriend: (state, action: PayloadAction<IUser>) => {
            state.user.friends.push(action.payload);
        },
        cancelFriend: (state, { payload }: PayloadAction<string>) => {
            state.user.friends = state.user.friends.filter((friend) => friend._id !== payload);
        },
        newRoom: (state, action: PayloadAction<IRoom>) => {
            state.user.rooms.push(action.payload);
        },
        deleteRoom: (state, { payload }: PayloadAction<string>) => {
            state.user.rooms = state.user.rooms.filter((room) => room._id !== payload);
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            userService.endpoints.getUser.matchFulfilled,
            (state, { payload }: PayloadAction<IResponseObject<IUser>>) => {
                state.user = payload.body;
            }
        );
    },
});

export const {
    addFriendRequest,
    removeFriendRequest,
    addRoom,
    addFriend,
    cancelFriend,
    newRoom,
    deleteRoom,
} = userSlice.actions;

export default userSlice.reducer;
