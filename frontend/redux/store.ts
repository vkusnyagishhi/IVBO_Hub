import { configureStore } from '@reduxjs/toolkit';
import miscReducer from './miscSlice';
import authReducer from "./authSlice";

export const store = configureStore({
    reducer: {
        misc: miscReducer,
        auth: authReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;