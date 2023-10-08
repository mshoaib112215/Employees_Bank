import * as yup from 'yup'

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()-_=+{}[\]|;:'",.<>/?\\`~]*$/;

const userEdit = yup.object().shape({
    name: yup.string().required("Empty field is not allowed"),
    email: yup.string().email().required("Empty field is not allowed"),
    role: yup.string().required("Empty field is not allowed"),
    password: yup.string().matches(passwordPattern, "Password is not strong"),
    confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Passwords must match")
})

export default userEdit