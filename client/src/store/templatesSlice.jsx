import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const templatesSclice = createSlice({
    name: 'templates',
    initialState,
    reducers: {
        setTemplates: (state, action) => {
            return action.payload;
        },
        deleteTemplates: (state, action) => {
            const userId = action.payload;
            return state.filter(user => user._id !== userId);
        },
        appendTemplates: (state, action) => {
            return [...state, action.payload];
        },
        updateTemplate: (state, action) => {
            const updatedTemplate = action.payload;
            const index = state.findIndex(template => template._id === updatedTemplate._id);

            if (index !== -1) {
                // Replace the existing template with the updated one
                state[index] = updatedTemplate;
            }
        },
        resetTemplates: () => initialState
    }
});

export const { setTemplates, deleteTemplates, appendTemplates, resetTemplates, updateTemplate } = templatesSclice.actions;

export default templatesSclice.reducer;
