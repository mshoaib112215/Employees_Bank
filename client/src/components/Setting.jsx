import React, { useState, useEffect } from 'react'
import { getAppliedFor } from '../api/internal'
import Types from './Types'
import TextInput from './TextInput'
import { useFormik } from 'formik'
import { addAppliedFor } from '../api/internal'
import applied_for_types from '../schemas/applied_for_types'
import employee_types from '../schemas/employee_types'
import Pagination from './Pagination'
import { addTemplate } from '../api/internal'
import { addEmployeeType } from '../api/internal'
import Loader from './Loader'
import { useDispatch, useSelector } from 'react-redux'
import { appendAppliedFor } from '../store/appliedForSlice'
import { appendEmployeeType } from '../store/employeeTypeSlice'
import { appendTemplates } from '../store/templatesSlice'

const Setting = ({ setAlert }) => {
    const [saving, setSaving] = useState(false);
    const [types, setTypes] = useState([])
    const [employeeTypes, setEmployeeTypes] = useState([])
    const [clickAdd, setClickAdd] = useState(false)
    const [clickAdd2, setClickAdd2] = useState(false)
    const [clickAdd3, setClickAdd3] = useState(false)
    const [employeeTypeClick, setEmployeeTypeClick] = useState(false)
    const [appliedForClick, setAppliedForClick] = useState(true)
    const [templateClick, setTemplateClick] = useState(false);
    const [loading, setLoading] = useState(true)
    const [templateName, setTemplateName] = useState('');
    const [templateDesc, setTemplateDesc] = useState('');
    const [showErrors, setShowErrors] = useState(false)
    const dispatch = useDispatch();


    const applied_fors = useSelector((state) => state.applied_for);
    const employee_types = useSelector((state) => state.employee_type);
    const template = useSelector((state) => state.templates);

    const [currentPage, setCurrentPage] = useState(1);
    const [currentPage2, setCurrentPage2] = useState(1);
    const [currentPage3, setCurrentPage3] = useState(1);
    const itemsPerPage = 15;

    const [searchQuery1, setSearchQuery1] = useState('');
    const [searchQuery2, setSearchQuery2] = useState('');
    const [searchQuery3, setSearchQuery3] = useState('');
    let filteredTypes;
    let filteredEmployeeTypes;
    let filteredTemplates;

    // Filter the list of types based on the search query

    filteredTypes = types.filter(type =>
        type.value.toLowerCase().includes(searchQuery1.toLowerCase())
    );
    filteredEmployeeTypes = employeeTypes.filter(type =>
        type.value.toLowerCase().includes(searchQuery2.toLowerCase())
    );
    filteredTemplates = template.filter(template =>
        template.value.toLowerCase().includes(searchQuery3.toLowerCase())
    );

    const { values, touched, errors, handleChange, handleBlur, resetForm } = useFormik({
        initialValues: {
            value: "",
        },
        validationSchema: applied_for_types
    })
    const { values: values2, touched: touched2, errors: errors2, handleChange: handleChange2, handleBlur: handleBlur2, resetForm: resetForm2 } = useFormik({
        initialValues: {
            value: "",
        },
        validationSchema: employee_types
    })


    useEffect(() => {
        async function fetchData() {
            try {
                const all_types = applied_fors;
                const all_employee_types = employee_types;

                setTypes(all_types);
                setEmployeeTypes(all_employee_types);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);
    const handleAdd = async () => {
        setShowErrors(true)
        setSaving(true)


        if (Object.keys(errors).length > 0 || values.value == '') {
            console.log(Object.keys(errors).length)
            console.log(errors.value)
            setSaving(false)
            setAlert({ message: "Please fill Required fields", type: "error" })
            return
        }

        try {
            const response = await addAppliedFor(values);
            if (response.status === 200) {
                setTypes((types) => [...types, { value: values.value, _id: response.data.result._id }]);
                dispatch(appendAppliedFor(response.data.result));
                setAlert({ message: "Added successfully", type: "success" });
                setClickAdd(false)
                resetForm();
            }
            else {

                setAlert({ message: "Something went wrong \"Make you are not adding duplicate value\"", type: "error" });
            }
        }
        catch (error) {
            console.log(error);
        }
        setSaving(false)
    }
    const handleAddEmployee = async () => {
        setShowErrors(true)
        setSaving(true)


        if (Object.keys(errors2).length > 0 || values2.value == '') {
            console.log(errors2)
            setAlert({ message: "Please fill Required fields", type: "error" })
            return
        }
        try {
            const response = await addEmployeeType(values2);
            if (response.status === 200) {
                setEmployeeTypes((types) => [...types, { value: values2.value, _id: response.data.result._id }]);
                dispatch(appendEmployeeType(response.data.result));
                
                setAlert({ message: "Added successfully", type: "success" });
                setClickAdd2(false)
                resetForm2();
            }
            else {
                setAlert({ message: "Something went wrong \"Make you are not adding duplicate value\"", type: "error" });
            }
        }
        catch (error) {
            console.log(error);
        }

        setSaving(false)
    }
    const handleAddTemplate = async () => {
        setShowErrors(true)
        setSaving(true)

        if (templateName == '' || templateDesc == '') {
            console.log(Object.keys(errors).length)
            console.log(errors)
            setAlert({ message: "Please fill Required fields", type: "error" })
            return
        }
        let response;

        try {
            response = await addTemplate({ value: templateName, description: templateDesc })
            if (response.status === 200) {
                setAlert({ message: "Added successfully", type: "success" })
                dispatch(appendTemplates(response.data.result))
                setTemplateName('')
                setTemplateDesc('')
                setClickAdd3(false)
            }
            else if (response.status === 401) {
                setAlert({ message: "Something went wrong, Template name and description must be unique", type: "error" })
            }

        }
        catch (error) {

            setAlert({ message: "Something went wrong, Template name and description must be unique and not empty", type: "error" })
        }
        setSaving(false)
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfLastItem2 = currentPage2 * itemsPerPage;
    const indexOfLastItem3 = currentPage3 * itemsPerPage;

    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const indexOfFirstItem2 = indexOfLastItem2 - itemsPerPage;
    const indexOfFirstItem3 = indexOfLastItem3 - itemsPerPage;

    const currentTypes = filteredTypes.slice(indexOfFirstItem, indexOfLastItem);
    const currentEmployeeTypes = filteredEmployeeTypes.slice(indexOfFirstItem2, indexOfLastItem2);
    const currentTemplates = filteredTemplates.slice(indexOfFirstItem3, indexOfLastItem3);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const paginate2 = (pageNumber) => setCurrentPage2(pageNumber);
    const paginate3 = (pageNumber) => setCurrentPage3(pageNumber);

    return (
        <>
            <div className="rounded-lg p-0 sm:p-4 w-full h-[100vh] relative">
                <h2 className="mb-4  font-semibold  text-3xl" >Settings</h2>

                {/* Applied For */}
                <div className='bg-white  rounded-lg p-4 custom-shadow'>
                    <div className='flex justify-start select-none gap-5 items-center mb-5'>

                        <h3 className={`text-xl cursor-pointer transition-all duration-100 h-fit   ${appliedForClick ? 'underline underline-offset-8 font-semibold' : ''}`}
                            onClick={() => { setAppliedForClick(true); setEmployeeTypeClick(false); setTemplateClick(false); setShowErrors(false) }}>Applied For</h3>

                        <h3 className={`text-xl cursor-pointer transition-all duration-100 h-fit ${employeeTypeClick ? 'underline underline-offset-8 font-semibold' : ''}`}
                            onClick={() => { setAppliedForClick(false); setEmployeeTypeClick(true); setTemplateClick(false); setShowErrors(false) }}>Employee Types</h3>

                        <h3 className={`text-xl cursor-pointer transition-all duration-100 h-fit ${templateClick ? 'underline underline-offset-8 font-semibold' : ''}`}
                            onClick={() => { setAppliedForClick(false); setEmployeeTypeClick(false); setTemplateClick(true); setShowErrors(false) }}>Templates</h3>

                    </div>
                    {appliedForClick &&
                        <>
                            <div className="flex justify-end ">

                                <button className='bg-[#1c75bc] px-3 py-2 hover:bg-blue-400 text-white rounded-full mb-4 ' onClick={() => setClickAdd(!clickAdd)}>Add New</button>
                            </div>
                            <div className="flex justify-center">

                                <div className="flex flex-col sm:flex-row justify-center items-center relative w-full sm:w-1/2">

                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery1}
                                        onChange={e => setSearchQuery1(e.target.value)}
                                        className="border border-black w-full  rounded-lg outline-none p-1 px-2 py-2 pl-10 mb-5"
                                    />
                                    <div className="absolute left-0 top-2 flex items-center pl-2 pointer-events-none">
                                        <svg width="23" height="23" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path fill="#616161" d="m18.031 16.617l4.283 4.282l-1.415 1.415l-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9s9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617Zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.867-3.133-7-7-7s-7 3.133-7 7s3.133 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15Z" />
                                        </svg>
                                    </div>
                                    <p className="font-semibold whitespace-nowrap  mb-4 ml-3 text-xl">

                                        Total records: {filteredTypes.length}
                                    </p>
                                </div>

                            </div>
                            <ul >
                                {loading ?
                                    <Loader /> :
                                    (
                                        currentTypes.map((type, index) => (
                                            <Types setTypes={setTypes} setAlert={setAlert} key={index} type={type} />
                                        ))
                                    )
                                }
                            </ul>
                            <div className="flex justify-center mt-6">

                                <Pagination
                                    itemsPerPage={itemsPerPage}
                                    totalItems={filteredTypes.length}
                                    currentPage={currentPage}
                                    paginate={paginate}
                                />
                            </div>
                        </>
                    }

                    {employeeTypeClick &&
                        <>
                            <div className="flex justify-end">

                                <button className='bg-[#1c75bc]  px-3 py-2 hover:bg-blue-400 text-white rounded-full mb-4 ' onClick={() => setClickAdd2(!clickAdd2)}>Add New</button>
                            </div>
                            <div className="flex justify-center">

                                <div className="flex flex-col sm:flex-row justify-center items-center relative w-full sm:w-1/2">

                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery2}
                                        onChange={e => setSearchQuery2(e.target.value)}
                                        className="border border-black w-full rounded-lg outline-none p-1 px-2 py-2 pl-10 mb-5"
                                    />
                                    <div className="absolute left-0 top-2 flex items-center pl-2 pointer-events-none">
                                        <svg width="23" height="23" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path fill="#616161" d="m18.031 16.617l4.283 4.282l-1.415 1.415l-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9s9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617Zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.867-3.133-7-7-7s-7 3.133-7 7s3.133 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15Z" />
                                        </svg>
                                    </div>
                                    <p className="font-semibold whitespace-nowrap mb-4 ml-3 text-xl">

                                        Total records: {filteredEmployeeTypes.length}
                                    </p>
                                </div>

                            </div>


                            <ul>
                                {loading ?
                                    <Loader /> :
                                    (

                                        currentEmployeeTypes.map((type, index) => (
                                            <Types setTypes={setEmployeeTypes} setAlert={setAlert} key={index} type={type} isEmployee={true} />
                                        ))

                                    )
                                }
                            </ul>
                            <div className="flex justify-center mt-6">

                                <Pagination
                                    itemsPerPage={itemsPerPage}
                                    totalItems={filteredEmployeeTypes.length}
                                    currentPage={currentPage2}
                                    paginate={paginate2}
                                />
                            </div>

                        </>
                    }

                    {/* /////////////////// Templates */}
                    {templateClick &&
                        <>
                            <div className="flex justify-end">

                                <button className='bg-[#1c75bc]  px-3 py-2 hover:bg-blue-400 text-white rounded-full mb-4 ' onClick={() => setClickAdd3(!clickAdd3)}>Add New</button>
                            </div>
                            <div className="flex justify-center">

                                <div className="flex flex-col sm:flex-row justify-center items-center relative w-full sm:w-1/2">

                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery3}
                                        onChange={e => setSearchQuery3(e.target.value)}
                                        className="border border-black w-full rounded-lg outline-none p-1 px-2 py-2 pl-10 mb-5"
                                    />
                                    <div className="absolute left-0 top-2 flex items-center pl-2 pointer-events-none">
                                        <svg width="23" height="23" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path fill="#616161" d="m18.031 16.617l4.283 4.282l-1.415 1.415l-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9s9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617Zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.867-3.133-7-7-7s-7 3.133-7 7s3.133 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15Z" />
                                        </svg>
                                    </div>
                                    <p className="font-semibold whitespace-nowrap mb-4 ml-3 text-xl">
                                        Total records: {filteredTemplates.length}
                                    </p>
                                </div>

                            </div>


                            <ul>
                                {loading ?
                                    <Loader /> :
                                    (

                                        currentTemplates.map((type, index) => (
                                            <Types setTypes={setEmployeeTypes} setAlert={setAlert} key={index} type={type} isEmployee={true} isTempalte={true} />
                                        ))

                                    )
                                }
                            </ul>
                            <div className="flex justify-center mt-6">

                                <Pagination
                                    itemsPerPage={itemsPerPage}
                                    totalItems={filteredTemplates.length}
                                    currentPage={currentPage3}
                                    paginate={paginate3}
                                />
                            </div>

                        </>
                    }
                </div>

                {clickAdd &&
                    <div className="fixed inset-0 pt-[30vh] pb-6 flex justify-center  bg-gray-500 bg-opacity-50 z-[100] backdrop-blur-md backdrop-filter">
                        <div className="bg-white  rounded-lg p-4 w-screen mx-5 h-fit sm:w-1/2 relative custom-shadow">
                            <button className="rounded-full absolute text-3xl top-[.5rem] right-[.5rem]  bg-red-600 p-2 w-10 h-10 flex justify-center items-center " onClick={() => setClickAdd(!clickAdd)}>
                                <svg width="35" height="35" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#fff" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z" />
                                </svg>
                            </button>

                            <h2 className="mb-4 text-2xl">Add New</h2>
                            {console.log()}
                            {saving ?

                                <Loader isTransparent /> :
                                <>
                                    <div className='flex flex-col'>
                                        <TextInput
                                            label="Applied For"
                                            isImportant
                                            type="text"
                                            name="value"
                                            border='border-[1px] border-gray-800'
                                            placeholder="Value"
                                            value={values.value}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            error={showErrors && errors.value && touched.value}
                                            errormessage={errors.value}
                                        />
                                    </div>
                                </>
                            }
                            <div className="self-end w-full flex justify-center">
                                <button className='bg-[#1c75bc] px-3 py-2 w-1/2 mt-3 hover:bg-blue-400 text-white rounded-full ' onClick={handleAdd}>Add</button>
                            </div>
                        </div>
                    </div>

                }
                {clickAdd2 &&
                    <div className="fixed inset-0 pt-[30vh] pb-6 flex justify-center  bg-gray-500 bg-opacity-50 z-[100] backdrop-blur-md backdrop-filter">
                        <div className="bg-white  rounded-lg p-4 w-screen mx-5 h-fit sm:w-1/2 relative custom-shadow">
                            <button className="rounded-full absolute text-3xl top-[.5rem] right-[.5rem]  bg-red-600 p-2 w-10 h-10 flex justify-center items-center " onClick={() => setClickAdd2(!clickAdd2)}>
                                <svg width="35" height="35" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#fff" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z" />
                                </svg>
                            </button>

                            <h2 className="mb-4 text-2xl">Add New</h2>
                            {console.log()}
                            {saving ?

                                <Loader isTransparent /> :
                                <>
                                    <div className='flex flex-col'>
                                        <TextInput
                                            label="Employee Type"
                                            type="text"
                                            isImportant
                                            name="value"
                                            border='border-[1px] border-gray-800'
                                            placeholder="Value"
                                            value={values2.value}
                                            onBlur={handleBlur2}
                                            onChange={handleChange2}
                                            error={showErrors && errors2.value && touched2.value}
                                            errormessage={errors2.value}
                                        />
                                    </div>
                                </>
                            }
                            <div className="self-end w-full flex justify-center">
                                <button className='bg-[#1c75bc] px-3 py-2 w-1/2 mt-3 hover:bg-blue-400 text-white rounded-full ' onClick={handleAddEmployee}>Add</button>
                            </div>
                        </div>
                    </div>

                }
                {clickAdd3 &&
                    <div className="fixed inset-0 pt-[30vh] pb-6 flex justify-center  bg-gray-500 bg-opacity-50 z-[100] backdrop-blur-md backdrop-filter">
                        <div className="bg-white  rounded-lg p-4 w-screen mx-5 h-fit sm:w-1/2 relative custom-shadow" >
                            <button className="rounded-full absolute text-3xl top-[.5rem] right-[.5rem]  bg-red-600 p-2 w-10 h-10 flex justify-center items-center " onClick={() => setClickAdd3(!clickAdd3)}>
                                <svg width="35" height="35" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#fff" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z" />
                                </svg>
                            </button>

                            <h2 className="mb-4 text-2xl">Add New</h2>
                            {console.log()}
                            {saving ?

                                <Loader isTransparent /> :
                                <>
                                    <div className='flex flex-col'>
                                        <TextInput
                                            label="Template Name"
                                            type="text"
                                            isImportant
                                            name="name"
                                            border='border-[1px] border-gray-800'
                                            placeholder="e.g: Suitable"
                                            value={templateName}
                                            onChange={(e) => setTemplateName(e.target.value)}
                                        />
                                        <label htmlFor="remarks" className='text-lg 3xl:text-2xl '>Description<span className='text-red-500 text-lg font-semibold'>*</span></label>
                                        <textarea
                                            className={`border-[1px] 3xl:text-2xl border-gray-700 3xl:h-36 sm:h-24 w-full p-1 resize-none rounded-md outline-none `}
                                            name="template"
                                            id="template"
                                            cols="30"
                                            rows="10"
                                            onChange={(e) => setTemplateDesc(e.target.value)}
                                            value={templateDesc}
                                        ></textarea>
                                    </div>
                                </>
                            }
                            <div className="self-end w-full flex justify-center">
                                <button className='bg-[#1c75bc] px-3 py-2 w-1/2 mt-3 hover:bg-blue-400 text-white rounded-full ' onClick={handleAddTemplate}>Add</button>
                            </div>
                        </div>
                    </div>

                }
            </div >
        </>
    )

}

export default Setting