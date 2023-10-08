import { configureStore } from '@reduxjs/toolkit';
import user from './userSlice'
import employee from './employeeSlice'
import allUsers from './allUserSlice'
import applied_for from './appliedForSlice'
import employee_type from './employeeTypeSlice'
import templates from './templatesSlice'

const store = configureStore({

    reducer: {
        user,
        employee,
        allUsers,
        applied_for,
        employee_type,
        templates
    }
});

export default store;
