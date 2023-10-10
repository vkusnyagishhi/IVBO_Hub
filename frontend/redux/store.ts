import { configureStore } from '@reduxjs/toolkit';
import miscReducer from './miscSlice';
import adminReducer from "@/redux/adminSlice";

export const store = configureStore({
    reducer: {
        misc: miscReducer,
        admin: adminReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;