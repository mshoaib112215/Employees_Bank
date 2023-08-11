const mongoose = require('mongoose');

const { Schema } = mongoose;

const employeeModel = new Schema({
    applied_for: {type: mongoose.Schema.Types.ObjectId, ref: 'AppliedFor', required: true, unique: true},
    name: {type: String, required: true},
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    cnic: { type: Number, required: true },
    applied_date: { type: Date, required: true },
    city: { type: String, required: true },
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeType', unique : true }, // intern/Permanent/Student
    status: {type: String, required: true},
    remarks: {type: String},
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
},
    { timestamps: true }
);

module.exports = mongoose.model('Employee_Model', employeeModel, 'employeeModel');