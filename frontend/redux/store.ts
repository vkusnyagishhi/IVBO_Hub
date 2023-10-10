import { configureStore } from '@reduxjs/toolkit';
import miscReducer from './miscSlice';

export const store = configureStore({
    reducer: {
        misc: miscReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;