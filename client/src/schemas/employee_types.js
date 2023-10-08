import * as yup from 'yup'

const employee_types = yup.object().shape({
    value: yup.string().required("Empty field is not allowed")
})
export default employee_types;