import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const employeeTypeSclice = createSlice({
    name: 'employee_type',
    initialState,
    reducers: {
        setEmployeeType: (state, action) => {
            return action.payload;
        },
        deleteEmployeeTypes: (state, action) => {
            const userId = action.payload;
            return state.filter(user => user._id !== userId);
        },
        appendEmployeeType: (state, action) => {
            return [...state, action.payload];
        },
        resetEmployeeType: () => initialState
    }
});

export const { setEmployeeType, deleteEmployeeTypes, appendEmployeeType, resetEmployeeType } = employeeTypeSclice.actions;

export default employeeTypeSclice.reducer;
