import * as yup from 'yup'

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()-_=+{}[\]|;:'",.<>/?\\`~]*$/;

const user = yup.object().shape({
    name: yup.string().required("Empty field is not allowed"),
    username: yup.string().min(5, "Username must be at least 5 characters").max(15, "Username must be at most 15 characters").required("Empty field is not allowed"),
    email: yup.string().email().required("Empty field is not allowed"),
    role: yup.string().required("Empty field is not allowed"),
    password: yup.string().matches(passwordPattern, "Password is not strong").required('Empty field is not allowed'),
    confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Passwords must match").required('Empty field is not allowed')
})

export default user