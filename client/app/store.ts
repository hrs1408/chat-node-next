import {configureStore, getDefaultMiddleware, Store} from "@reduxjs/toolkit";
import {Context, createWrapper} from "next-redux-wrapper";
import {setupListeners} from "@reduxjs/toolkit/query";
import tabSlice from "./features/Tab.slice";
import {userService} from "./services/User.service";
import userSlice from "./features/User.slice";
import {messageService} from "./services/Message.service";
import messageSlice from "./features/Message.slice";
import {roomService} from "./services/Room.service";
import {authService} from "./services/Auth.service";

const middleware = [
    ...getDefaultMiddleware(),
    userService.middleware,
    messageService.middleware,
    roomService.middleware,
    authService.middleware
];

export const store = configureStore({
    reducer: {
        tabSlice,
        userSlice,
        messageSlice,
        [userService.reducerPath]: userService.reducer,
        [roomService.reducerPath]: roomService.reducer,
        [messageService.reducerPath]: messageService.reducer,
        [authService.reducerPath]: authService.reducer
    },
    middleware,
});

const makeStore = (context: Context) => store;

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const wrapper = createWrapper<Store<RootState>>(makeStore);