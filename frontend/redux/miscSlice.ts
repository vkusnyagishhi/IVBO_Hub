import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
    name: 'misc',
    initialState: {
        hw: []
    },
    reducers: {
        setData: (state, action: PayloadAction<object>) => {
            Object.assign(state, action.payload);
        }
    },
})

export const { setData } = counterSlice.actions;
export default counterSlice.reducer;