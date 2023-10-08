// netlify/functions/app.js
import express, { json } from 'express';
import { register, login } from '../../controller/authController';
import { createEntry, deleteEntry, deleteManyEntry, updateEntry, getEntries, getEmployee } from '../../controller/employeeController';
import { addAppliedFor, addEmplyeeType, getAppliedFor, getEmplyeeType, deleteEmployeeType, deleteAppliedFor } from '../../controller/dropdownController';
import {auth} from '../../middlewares/auth';
import { getTemplate, addTemplate, deleteTemplate, updateTemplate } from '../../controller/templateController';

const app = express();

// Middleware
app.use(json());    

// Routes
// user

// register
app.get('/', (req, res) => {
    res.status(200).json({ message: "Hello Backend :)" })
});

// app.post('/register', register);
// // login
// app.post('/login', login);

// // ... (add the rest of your routes here)

// // employees Data Entry Routes
// // Create employees' entry
// app.post('/create-entry', auth, createEntry);
// // delete:id
// app.delete('/delete-entry/:id', auth, deleteEntry);
// // delete-all:id
// app.delete('/delete-all', auth, deleteManyEntry);
// // update:id
// app.put('/update-entry/:id', auth, updateEntry);
// // read
// app.get('/entries', auth, getEntries);
// // read:id
// app.get('/employee/:id', auth, getEmployee);

// /////////////////////// template ////////////////////
// app.get('/templates', auth, getTemplate);
// app.post('/create-template', auth, addTemplate);
// app.delete('/delete-template/:id', auth, deleteTemplate);
// app.put('/template/:id', auth, updateTemplate);

// ////////////////// Drop down Endpoints ////////////////
// // Add dropdown (Applies for) element
// app.post('/add-applied-for', auth, addAppliedFor);
// // Add dropdown (Employee Types) element
// app.post('/add-employee-type', auth, addEmplyeeType);
// // get all dropdown element
// app.get('/applied-for', auth, getAppliedFor);
// app.get('/employee-type', auth, getEmplyeeType);
// // Delete Dropdown element by ID
// app.delete('/delete-employee-type/:id', auth, deleteEmployeeType);
// app.delete('/delete-applied-for/:id', auth, deleteAppliedFor);

// Export the Express app
export async function handler(event, context) {
    return app(event, context);
}
