import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from '@reduxjs/toolkit';
import { IHomework } from "@/utils/types";
import table from "@/utils/table";

interface IData {
    // table: any[];
    hw: any[];
    version: string;
}

interface MiscState {
    isLaptop: boolean;
    showHW: boolean;
    hw: IHomework[];
    // table: any[];
    version: string;
    calendarSelected: number[];
    editingHWs: string[];
    weeksDisplayCount: number[];
}

const selectedDefault = 0;

const initialState: MiscState = {
    isLaptop: false,
    showHW: false,
    hw: [],
    // table: [],
    version: 'fetching data...',
    calendarSelected: [0, 0],
    editingHWs: [],
    weeksDisplayCount: [0, 5]
};

export const miscSlice = createSlice({
    name: 'misc',
    initialState,
    reducers: {
        setShowHW: (state, action: PayloadAction<boolean>) => { state.showHW = action.payload; },
        setIsLaptop: (state, action: PayloadAction<boolean>) => { state.isLaptop = action.payload; },
        deletePhoto: (state, action: PayloadAction<any>) => { state.hw[action.payload].image = null; },
        addEditingHW: (state, action: PayloadAction<string>) => { state.editingHWs.push(action.payload); },
        setSelected: (state, action: PayloadAction<number[]>) => { state.calendarSelected = action.payload; },
        setWeeksDisplayCount: (state, action: PayloadAction<string>) => {
            state.weeksDisplayCount = action.payload.split('|').map((x: string) => parseInt(x));
        },
        increaseWeeksDisplayCount: (state) => { // уменшить календарь
            if (state.weeksDisplayCount[1] + 1 === table.length - 1)
                state.weeksDisplayCount = [state.calendarSelected[0], table.length - state.calendarSelected[0] - 1];
            else {
                if (state.weeksDisplayCount[0] < state.calendarSelected[0]) ++state.weeksDisplayCount[0];
                else ++state.weeksDisplayCount[1];
            }

            localStorage.setItem('weeksDisplayCount', `${state.weeksDisplayCount[0]}|${state.weeksDisplayCount[1]}`);
        },
        decreaseWeeksDisplayCount: (state) => { // увеличить календарь
            if (state.weeksDisplayCount[0] > 0) state.weeksDisplayCount[0]--;
            else state.weeksDisplayCount[1]--;
        },
        setData: (state, action: PayloadAction<IData>) => {
            Object.assign(state.hw, action.payload.hw);
            // Object.assign(state.table, action.payload.table);
            state.version = action.payload.version;
            if (new Date().getDay() !== 0) state.calendarSelected = [selectedDefault, new Date().getDay() - 1];
            else state.calendarSelected = [selectedDefault, 0];
        },
        editHW: (state, action: PayloadAction<any>) => {
            const found: IHomework | undefined = state.hw.find((h: IHomework) => h.subject === action.payload.subject);
            if (found) found.content = action.payload.value;
        },
        removeEditingHW: (state, action: PayloadAction<string>) => {
            state.editingHWs = state.editingHWs.filter((hw: string) => hw !== action.payload);
        },
        swipe: (state, action: PayloadAction<number>) => {
            const weekIndex = state.calendarSelected[0];
            const dayIndex = state.calendarSelected[1] + action.payload;

            if (
                (weekIndex <= 0 && dayIndex < 0) ||
                (weekIndex === state.weeksDisplayCount[1] - 1 && dayIndex >= 6)
            ) return;

            if (dayIndex > 5) state.calendarSelected = [weekIndex + 1, 0];
            else if (dayIndex < 0) state.calendarSelected = [weekIndex - 1, 5];
            else state.calendarSelected = [weekIndex, dayIndex];
        }
    }
})

export const { setData, setIsLaptop, editHW, setShowHW, setWeeksDisplayCount, deletePhoto, addEditingHW, removeEditingHW, setSelected, swipe, increaseWeeksDisplayCount, decreaseWeeksDisplayCount } = miscSlice.actions;
export default miscSlice.reducer;