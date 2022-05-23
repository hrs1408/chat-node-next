import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface ITab {
    value: number;
}

const initialState: ITab = {
    value: 0,
};

export const tabSlice = createSlice({
    name: "tabSlice",
    initialState,
    reducers: {
        changeTab: (state, {payload}: PayloadAction<number>) => {
            state.value = payload;
        },
    },
});

export const {changeTab} = tabSlice.actions;

export default tabSlice.reducer;