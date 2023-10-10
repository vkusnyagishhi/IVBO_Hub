import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
    name: 'misc',
    initialState: {
        isLaptop: false,
        hw: []
    },
    reducers: {
        setData: (state, action: PayloadAction<object>) => {
            Object.assign(state, action.payload);
        },
        setIsLaptop: (state, action: PayloadAction<boolean>) => {
            state.isLaptop = action.payload;
        }
    },
})

export const { setData, setIsLaptop } = counterSlice.actions;
export default counterSlice.reducer;