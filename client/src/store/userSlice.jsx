import {createSlice} from '@reduxjs/toolkit';


const initialState = {
    _id: '',
    email: '',
    username: '',
    role: '',
    name:'',
    createdAt: '',
    avatar: '',
    auth: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state._id = action.payload._id;
            state.email = action.payload.email;
            state.role = action.payload.role;
            state.name = action.payload.name;
            state.username = action.payload.username;
            state.auth = action.payload.auth;
            state.avatar = action.payload.avatar;
            state.createdAt = action.payload.createdAt;
        },
        resetUser: (state) => {
            state._id = '';
            state.email = '';
            state.role = '';
            state.name = '';
            state.username = '';
            state.createdAt = '';
            state.avatar = '';
            state.auth = false
        },
        updateNameAndAvatar: (state, action) => {
            state.avatar = action.payload.avatar;
            state.name = action.payload.newName
            state.email = action.payload.email

        },
        resetAvatar: (state) => {
            state.avatar = ''
        }
    }
})
export const { setUser, resetUser, updateNameAndAvatar, resetAvatar  } = userSlice.actions;

export default userSlice.reducer;