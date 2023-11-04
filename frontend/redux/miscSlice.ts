import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from '@reduxjs/toolkit';
import { IHomework } from "@/utils/misc";

interface IData {
    table: any[];
    hw: any[];
    version: string;
    currentWeek: number;
}

interface MiscState {
    isLaptop: boolean;
    hw: IHomework[];
    table: any[];
    version: string;
    calendarSelected: number[];
    editingHWs: string[];
    weeksDisplayCount: number;
}

const initialState: MiscState = {
    isLaptop: false,
    hw: [],
    table: [],
    version: 'fetching data...',
    calendarSelected: [0, 7],
    editingHWs: [],
    weeksDisplayCount: 4
};

export const miscSlice = createSlice({
    name: 'misc',
    initialState,
    reducers: {
        setWeeksDisplayCount: (state, action: PayloadAction<number>) => {
            state.weeksDisplayCount = action.payload;
        },
        setData: (state, action: PayloadAction<IData>) => {
            Object.assign(state.hw, action.payload.hw);
            Object.assign(state.table, action.payload.table);
            state.version = action.payload.version;
            if (new Date().getDay() !== 7) state.calendarSelected = [action.payload.currentWeek, new Date().getDay() - 1];
        },
        setIsLaptop: (state, action: PayloadAction<boolean>) => {
            state.isLaptop = action.payload;
        },
        editHW: (state, action: PayloadAction<any>) => {
            const found: IHomework | any = state.hw.find((h: IHomework) => h.subject === action.payload.subject);
            if (found) found.content[action.payload.contentNum] = action.payload.value;
        },
        addHWField: (state, action: PayloadAction<any>) => {
            const found: IHomework | any = state.hw.find((h: IHomework) => h.subject === action.payload);
            if (found) found.content.push('');
        },
        removeHWField: (state, action: PayloadAction<any>) => {
            const found: IHomework | any = state.hw.find((h: IHomework) => h.subject === action.payload[0]);
            if (found) found.content.splice(action.payload[1], 1);
        },
        deletePhoto: (state, action: PayloadAction<any>) => {
            state.hw[action.payload].image = null;
        },
        addEditingHW: (state, action: PayloadAction<string>) => {
            state.editingHWs.push(action.payload);
        },
        removeEditingHW: (state, action: PayloadAction<string>) => {
            state.editingHWs = state.editingHWs.filter((hw: string) => hw !== action.payload);
        },
        setSelected: (state, action: PayloadAction<number[]>) => {
            state.calendarSelected = action.payload;
        },
        swipe: (state, action: PayloadAction<number>) => {
            const weekIndex = state.calendarSelected[0];
            const dayIndex = state.calendarSelected[1] + action.payload;

            if (dayIndex > 5) state.calendarSelected = [weekIndex + 1, 0];
            else if (dayIndex < 0) state.calendarSelected = [weekIndex - 1, 5];
            else state.calendarSelected = [weekIndex, dayIndex];
        }
    }
})

export const { setData, setIsLaptop, editHW, addHWField, removeHWField, deletePhoto, addEditingHW, removeEditingHW, setSelected, swipe, setWeeksDisplayCount } = miscSlice.actions;
export default miscSlice.reducer;