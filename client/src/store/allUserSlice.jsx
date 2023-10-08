import { createSlice } from '@reduxjs/toolkit';


const initialState = []

export const allUserSlice = createSlice({
    name: 'allUsers',
    initialState,
    reducers: {
        setAllUser: (state, action) => {
            return action.payload
        },
        appendAllUser: (state, action) => {
            return [...state, action.payload]; 
        },
        deleteAllUser: (state, action) => {
            const userIdToDelete = action.payload;
            return state.filter(user => user._id !== userIdToDelete);
        },
        resetAllUser: (state) => initialState
    }
})
export const { setAllUser, resetAllUser, appendAllUser, deleteAllUser } = allUserSlice.actions;

export default allUserSlice.reducer;