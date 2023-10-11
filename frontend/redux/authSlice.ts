import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "@/misc";

interface AuthState {
    isRealAdmin: boolean;
    user: IUser | null;
    files: string[];
}

const initialState: AuthState = {
    isRealAdmin: false,
    user: null,
    files: []
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthData: (state, action: PayloadAction<object>) => {
            Object.assign(state, action.payload);
        },
        addFile: (state, action: PayloadAction<string>) => {
            if (!state.files.includes(action.payload)) state.files.push(action.payload);
            else state.files = [...state.files.filter(f => f !== action.payload), action.payload];
        }
    },
})

export const { setAuthData, addFile } = authSlice.actions;
export default authSlice.reducer;