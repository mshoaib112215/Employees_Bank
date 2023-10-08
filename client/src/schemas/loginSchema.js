import * as yup from 'yup'

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()-_=+{}[\]|;:'",.<>/?\\`~]*$/;

const loginSchema = yup.object().shape({
    username: yup.string().min(5).max(30).required("Username is required"),
    password: yup.string().min(8).matches(passwordPattern, "Password is not strong").max(25).required()
})
export default loginSchema;