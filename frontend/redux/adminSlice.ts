import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from "@reduxjs/toolkit";

export const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        isRealAdmin: false
    },
    reducers: {
        setAdminData: (state, action: PayloadAction<object>) => {
            Object.assign(state, action.payload);
        }
    },
})

export const { setAdminData } = adminSlice.actions;
export default adminSlice.reducer;