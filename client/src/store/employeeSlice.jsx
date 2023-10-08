import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const employeeSlice = createSlice({
    name: 'employee',
    initialState,
    reducers: {
        setEmployees: (state, action) => {
            return action.payload; 
        },
        deleteAllRecords: (state, action) => {
            const userId = action.payload;
            return state.filter(user => user._id !== userId);
        },
        appendToEmployee: (state, action) => {
            return [...state, action.payload]; 
        },
        deleteSelected: (state, action) =>{
            const userIds = action.payload;
            // Use the `filter` method to remove users with matching IDs
            const updatedState = state.filter(user => !userIds.includes(user._id));
            return updatedState;
        },
        resetEmployees: () => initialState
    }
});

export const { setEmployees, resetEmployees, deleteAllRecords, appendToEmployee, deleteSelected  } = employeeSlice.actions;

export default employeeSlice.reducer;
