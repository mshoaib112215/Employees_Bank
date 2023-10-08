import * as yup from 'yup'

const employeeSchema = yup.object().shape({
    applied_for: yup.string().required("Applied For is Required"),
    name: yup.string().required("Name is Required"),
    email: yup.string().email().required("Email is Required"),
    gender: yup.string().required("Gender is Required"),
    phone_no: yup
        .string()
        .test("len", "Phone number must have exactly 11 digits", (val) => val.toString().length === 12)
        .required("Phone Number is Required"),

    cnic: yup
        .string()
        .test("len", "CNIC must have exactly 13 digits", (val) => val.toString().length === 14)
        .required("CNIC is Required"),
    type: yup.string().required(),
    status: yup.string().required(),
    remarks: yup.string(),
    city: yup.string().required(),
    applied_date: yup.date().required("Applied Date is Required"),

})
export default employeeSchema;