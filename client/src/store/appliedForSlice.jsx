import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const appliedFor = createSlice({
    name: 'applied_for',
    initialState,
    reducers: {
        setAppliedFor: (state, action) => {
            return action.payload;
        },
        deleteAppliedFor: (state, action) => {
            const userId = action.payload;
            return state.filter(user => user._id !== userId);
        },
        appendAppliedFor: (state, action) => {
            return [...state, action.payload];
        },
        resetAppliedFor: () => initialState
    }
});

export const { setAppliedFor, deleteAppliedFor, appendAppliedFor, resetAppliedFor } =appliedFor.actions;

export default appliedFor.reducer;
