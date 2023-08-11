const express = require('express');
const authController = require('../controller/authController');
const employeeController = require('../controller/employeeController');
const dropdownController = require('../controller/dropdownController');
const auth = require('../middlewares/auth');

const router = express.Router();

// user

// register
router.post('/register', authController.register);

// login
router.post('/login', authController.login);

//delete user
router.delete('/delete/:id', authController.deleteUser);

// update user
router.put('/update/:id', authController.updateUser);

// see users
router.get('/users', authController.getUsers);

// logout
router.post('/logout', auth, authController.logout)

// refresh
router.get('/refresh', authController.refresh);


// employees Data Entry Routes
// Create employees' entry
router.post('/create-entry', auth, employeeController.createEntry)
// delete:id
router.delete('/delete-entry/:id', auth, employeeController.deleteEntry)
// update:id
router.put('/update-entry/:id', auth, employeeController.updateEntry)
// read
router.put('/entries', auth, employeeController.getEntries)
// read:id
router.get('/employee/:id', auth, employeeController.getEmployee)



////////////////// Drop down Endpoints ////////////////
// Add dropdown (Applies for) element
router.post('/add-applied-for', auth, dropdownController.addAppliedFor)
// Add dropdown (Employee Types) element
router.post('/add-employee-type', auth, dropdownController.addEmplyeeType)
// get all dropdown element
router.get('/applied-for', auth, dropdownController.getAppliedFor)
router.get('/employee-type', auth, dropdownController.getEmplyeeType)
// Delete Dropdown element by ID
router.delete('/delete-employee-type/:id', auth, dropdownController.deleteEmployeeType)
router.delete('/delete-applied-for/:id', auth, dropdownController.deleteAppliedFor)

module.exports = router;