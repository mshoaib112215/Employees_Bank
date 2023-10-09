import React, { useState, useEffect } from 'react'
import TextInput from './TextInput'
import { useFormik } from 'formik';
import user from '../schemas/user'
import { createUser } from '../api/internal';
import Loader from './Loader';
import { appendAllUser } from '../store/allUserSlice'
import { useDispatch, useSelector } from 'react-redux';


const AddUserForm = ({ setAlert, setIsAddClicked, isAddClicked, dataEntry = false }) => {

    const [showErrors, setShowErrors] = useState(false);
    const dispatch = useDispatch();
    const { values, touched, handleBlur, handleChange, errors, resetForm } = useFormik({
        initialValues: {
            username: '',
            email: '',
            name: '',
            role: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: user
    });
    const handleAddEntry = async (addMore = false) => {
        setShowErrors(true)
        setAlert({ message: <Loader isTransparent />, type: "loading" })

        if (Object.keys(errors).length > 0) {
            console.log(Object.keys(errors).length)
            console.log(errors)
            setAlert({ message: "Please fill Required fields", type: "error" })

            return
        }

        //get values from form
        const remarks = values.remarks;
        if (remarks === '') {
            values.remarks = 'No remarks'
        }
        // send them to the function


        const response = await createUser(values)
        if (response?.status === 201) {
            setAlert({ message: "Added successfully", type: "success" })

            console.log(response.data.user)
            dispatch(appendAllUser(response.data.user))
            if (addMore) {
                resetForm();
            }
            else {
                setIsAddClicked(!isAddClicked)
            }
        }
        else {

            setAlert({ message: "Failed to add user, Make sure Email & Username is unique ", type: "error" })
        }

        // function will add it to the database
        // if return 200 then okay otherwise show error

    }


    return (
        <div className="fixed inset-0 pt-20 pb-6 flex justify-center  bg-gray-500 bg-opacity-50 z-20 backdrop-blur-md backdrop-filter" >
            <div className="bg-white rounded-3xl p-4 pb-10 w-[80vw] sm:w-1/2 h-fit  relative custom-shadow">
                <button className="rounded-full absolute text-3xl top-[.5rem] right-[.5rem]  bg-red-600 p-2 w-10 h-10 flex justify-center items-center " onClick={() => setIsAddClicked(!isAddClicked)}>
                    <svg width="35" height="35" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#fff" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z" />
                    </svg>
                </button>

                <h2 className="mb-4 3xl:text-4xl text-3xl">Add Entry</h2>
                <div>
                    <div className='flex 3xl:text-2xl text-black flex-col h-auto px-4  overflow-y-scroll custom-scrollbar' >
                        <div className='flex gap-2 md:flex-row flex-col '>

                            <TextInput
                                label="Name"
                                isImportant
                                type="text"
                                name="name"
                                border='border-[1px]  border-gray-800'
                                placeholder="Name"
                                value={values.name}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={showErrors && errors.name && touched.name}
                                errormessage={errors.name}
                            />
                            <TextInput
                                label="Username"
                                isImportant
                                type="text"
                                name="username"
                                border='border-[1px] border-gray-800'
                                placeholder="Username"
                                value={values.username}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={showErrors && errors.username && touched.username}
                                errormessage={errors.username}
                            />
                        </div>
                        <div className='flex gap-2 md:flex-row flex-col '>

                            <TextInput
                                label="Email"
                                isImportant
                                type="text"
                                name="email"
                                border='border-[1px] border-gray-800'
                                placeholder="abc@example.com"
                                value={values.email}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={showErrors && errors.email && touched.email}
                                errormessage={errors.email}
                            />
                            <div className='flex flex-col flex-1 w-full'>

                                <label className='text-lg 3xl:text-2xl mb-2'>Role<span className='text-red-500 text-lg font-semibold'>*</span></label>
                                <select
                                    className={`border-[1px] px-2 border-gray-500 w-full py-2 rounded-md mb-2 ${showErrors && errors.role && touched.role ? 'border-red-500' : ''
                                        }`}
                                    name="role"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.role}
                                >
                                    <option value="">Select one...</option>
                                    <option value="HR">HR</option>
                                    <option value="Data Entry">Data Entry</option>
                                </select>
                                {showErrors && errors.role && touched.role && (
                                    <div className="text-red-500 text-sm">{errors.role}</div>
                                )}
                            </div>
                        </div>
                        <div className='flex gap-2 md:flex-row flex-col '>

                            <TextInput
                                label="Password"
                                type="password"
                                isImportant
                                name="password"
                                border='border-[1px] border-gray-800'
                                placeholder="User@1234"
                                value={values.password}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={showErrors && errors.password && touched.password}
                                errormessage={errors.password}
                            />
                            <TextInput
                                label="Confirm Password"
                                isImportant
                                type="password"
                                name="confirmPassword"
                                border='border-[1px] border-gray-800'
                                placeholder="User@1234"
                                value={values.confirmPassword}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={showErrors && errors.confirmPassword && touched.confirmPassword}
                                errormessage={errors.confirmPassword}
                            />
                        </div>
                        <div className="flex justify-center gap-3">

                            <input className='bg-[#26b0ff]  disabled:bg-gray-500 disabled:cursor-not-allowed text-white p-2 w-1/3 self-end rounded-full my-3 hover:bg-blue-400' type="submit" disabled={values.name == '' > 0 ? true : false} value="Submit" onClick={() => handleAddEntry(false)} />

                            <input className='bg-[#26b0ff] disabled:bg-gray-500 disabled:cursor-not-allowed text-white p-2 w-1/3 self-end rounded-full my-3 hover:bg-blue-400' type="submit" disabled={values.name == '' > 0 ? true : false} value="Submit & Add More" onClick={() => handleAddEntry(true)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default AddUserForm