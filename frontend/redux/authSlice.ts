import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from '@reduxjs/toolkit';
import { IUser } from "@/utils/misc";

interface AuthState {
    user: IUser | null;
    userpic: string | null;
    files: any;
}

const initialState: AuthState = {
    user: null,
    userpic: null,
    files: {}
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserpic: (state, action: PayloadAction<string>) => {
            state.userpic = action.payload;
        },
        setAuthData: (state, action: PayloadAction<object>) => {
            Object.assign(state, action.payload);
        },
        addFile: (state, action: PayloadAction<string>) => {
            if (!state.user) return;
            if (!state.files[state.user.tg_username].includes(action.payload)) state.files[state.user.tg_username].unshift(action.payload);
            // else state.files = [...state.files[state.user.tg_username].filter((f: string) => f !== action.payload), action.payload];
        },
        deleteFile: (state, action: PayloadAction<string>) => {
            if (!state.user || !state.files[state.user.tg_username].includes(action.payload)) return;
            state.files[state.user.tg_username] = state.files[state.user.tg_username].filter((x: string) => x !== action.payload);
        },
        addTrusted: (state, action: PayloadAction<string>) => {
            if (!state.user) return;
            state.user.trusted.push(action.payload);
        },
        removeTrusted: (state, action: PayloadAction<string>) => {
            if (!state.user) return;
            state.user.trusted = state.user.trusted.filter((x: string) => x !== action.payload);
        }
    }
});

export const { setAuthData, addFile, addTrusted, removeTrusted, deleteFile, setUserpic } = authSlice.actions;
export default authSlice.reducer;