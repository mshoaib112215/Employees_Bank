import * as yup from 'yup'

const applied_for_types = yup.object().shape({
    value: yup.string().required("Empty field is not allowed")
})
export default applied_for_types;