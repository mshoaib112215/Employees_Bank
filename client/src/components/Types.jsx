import React, { useState } from 'react'
import { deleteAllRec, deleteTemplate, deleteType } from '../api/internal'
import { deleteEmployeeType } from '../api/internal'
import Loader from './Loader'
import { useDispatch } from 'react-redux'
import { deleteEmployeeTypes } from '../store/employeeTypeSlice'
import { deleteAppliedFor } from '../store/appliedForSlice'
import TextInput from './TextInput'
import { useSelector } from 'react-redux'
import { updateTamplate } from '../api/internal'
import { deleteTemplates, updateTemplate } from '../store/templatesSlice'
import { deleteSelected } from '../store/employeeSlice'

const Types = ({ type, setTypes, setAlert, isEmployee = false, isTempalte = false }) => {
    const [saving, setSaving] = useState(false);

    const [deleted, setDeleted] = useState(false)
    const dispatch = useDispatch();
    const [edit, setEdit] = useState(false)
    const [templateName, setTemplateName] = useState('');
    const [templateDesc, setTemplateDesc] = useState('');
    const allTeplates = useSelector((state) => state.templates);
    const allAppliedFor = useSelector((state) => state.applied_for);
    const allEmployees = useSelector((state) => state.employee);
    const applied_fors = allEmployees.filter((item) => item.applied_for == type.value)
    const employee_types = allEmployees.filter((item) => item.type == type.value)



    const handleUpdate = async (id) => {
        setSaving(true)
        let response
        try {
            const data = {
                value: templateName,
                description: templateDesc
            }
            response = await updateTamplate(id, data)
            if (response.status === 200) {
                const updatedTemplate = { _id: id, ...data };
                dispatch(updateTemplate(updatedTemplate));
                setAlert({ message: "Updated successfully", type: "success" })
                setSaving(false)
            }
            else {
                setAlert({ message: "Something went wrong", type: "error" })
            }
        }
        catch (error) {
        }
        finally{
            setSaving(false)

        }
    }


    const handleDelete = async (id, assoc_entry) => {
        setDeleted(false)
        const assoc_ids = assoc_entry.map((item) => item._id)
        setAlert({ message: <Loader isTransparent />, type: "loading" });
        let response
        try {
            if (isEmployee) {

                response = await deleteAllRec(assoc_ids)
                if (response.status !== 400) {
                    response = await deleteEmployeeType(id);
                    dispatch(deleteEmployeeTypes(id));
                    assoc_ids.forEach(item => {
                        dispatch(deleteSelected(item))
                    });
                }
                else {
                    setAlert({ message: "Internal error in deleting associated Entries", type: "error" });
                }
            }
            else {
                response = await deleteAllRec(assoc_ids)
                if (response.status !== 400) {

                    response = await deleteType(id);
                    dispatch(deleteAppliedFor(id));
                    assoc_ids.forEach(item => {
                        dispatch(deleteSelected(item))
                    });
                }
                else {
                    setAlert({ message: "Internal error in deleting associated Entries", type: "error" });

                }
            }
            if (!isTempalte) {

                if (response.deletedCount >= 1) {
                    setAlert({ message: "Deleted Successfully", type: "success" });
                    setTypes(prevTypes => prevTypes.filter(type => type._id !== id));
                }
                else {
                    setAlert({ message: "Deletion Error", type: "error" });
                }
            }
            if (isTempalte) {

                response = await deleteTemplate(id);
                if (response.data.deletedCount >= 1) {
                    setAlert({ message: "Deleted Successfully", type: "success" });
                    dispatch(deleteTemplates(id));
                }
                else {
                    setAlert({ message: "Deletion Erasdror", type: "error" });
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex justify-center">

            <div className='flex justify-between sm:w-3/4 w-full  items-center capitalize'>
                <div className="flex gap-1 items-center">

                    <svg width="20" height="20" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#000000" d="M8.293 2.293a1 1 0 0 1 1.414 0l4.5 4.5a1 1 0 0 1 0 1.414l-4.5 4.5a1 1 0 0 1-1.414-1.414L11 8.5H1.5a1 1 0 0 1 0-2H11L8.293 3.707a1 1 0 0 1 0-1.414Z" />
                    </svg>
                    <li className=' px-3 text-lg font-semibold py-2 capitalize rounded'>{type.value} {`${!isTempalte ? (!isEmployee ? "(" + applied_fors.length + ")" : "(" + employee_types.length + ")") : ''}`}</li>
                </div>

                <div className='flex gap-3 items-center'>
                    {isTempalte &&
                        <div className=' px-3 py-[.35rem] rounded-md border-green-400 border bg-green-400 hover:bg-green-300 cursor-pointer ' onClick={() => { setEdit(true); setTemplateName(allTeplates.find(template => template._id === type._id).value); setTemplateDesc(allTeplates.find(template => template._id === type._id).description) }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                                    <path d="m16.474 5.408l2.118 2.117m-.756-3.982L12.109 9.27a2.118 2.118 0 0 0-.58 1.082L11 13l2.648-.53c.41-.082.786-.283 1.082-.579l5.727-5.727a1.853 1.853 0 1 0-2.621-2.621Z" />
                                    <path d="M19 15v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3" />
                                </g>
                            </svg>
                        </div>}
                    <button className='bg-red-400 hover:bg-red-300 border border-red-400 text-white h-fit justify-self-center px-3 py-1 my-1 rounded' onClick={() => setDeleted(true)}>Delete</button>
                </div>
            </div>
            {deleted && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-[100] backdrop-blur-md backdrop-filter">
                    <div className="bg-white rounded-lg p-4">
                        <p className="mb-4"><span className='font-semibold'>{`${!isTempalte ? (!isEmployee ? applied_fors.length : employee_types.length) : ''}`}</span> {`${!isTempalte ? 'entries are associated with it.' : ''} `}Are you sure you want to delete this entry?</p>
                        <div className="flex justify-end">
                            <button className="border border-red-500 px-3 py-1 rounded-md mr-2 hover:bg-red-500 hover:text-white" onClick={() => setDeleted(false)}>Cancel</button>
                            <button className="bg-red-500 text-white px-3  py-1 rounded-md hover:bg-red-600" onClick={() => handleDelete(type._id, !isTempalte ? (!isEmployee ? applied_fors : employee_types) : {})}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
            {edit ? (
                <div className="fixed inset-0 pt-20 pb-6 flex justify-center items-center bg-gray-500 bg-opacity-50 z-[100] backdrop-blur-md backdrop-filter" >
                    <div className="bg-white rounded-3xl p-4 pb-10 w-[80vw] sm:w-1/2 h-fit  relative custom-shadow">
                        <button className="rounded-full absolute text-3xl top-[.5rem] right-[.5rem]  bg-red-600 p-2 w-10 h-10 flex justify-center items-center " onClick={() => setEdit(false)}>
                            <svg width="35" height="35" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#fff" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z" />
                            </svg>
                        </button>

                        <h2 className="mb-4 3xl:text-4xl text-2xl">Edit Template</h2>

                        <div>
                            <div className='flex 3xl:text-2xl text-black flex-col h-auto px-4' >
                                {saving ?

                                    <Loader isTransparent /> :
                                    <>
                                        <TextInput
                                            label="Name"
                                            type="text"
                                            name="name"
                                            border='border-[1px]  border-gray-800'
                                            placeholder="e.g: Suitable"
                                            onChange={(e) => setTemplateName(e.target.value)}
                                            value={templateName}
                                        />
                                        <label htmlFor="remarks" className='text-lg 3xl:text-2xl '>Description:</label>
                                        <textarea
                                            className={`border-[1px] 3xl:text-2xl border-gray-700 3xl:h-36 sm:h-24 w-full p-1 resize-none rounded-md outline-none `}
                                            name="template"
                                            id="template"
                                            cols="30"
                                            rows="10"
                                            onChange={(e) => setTemplateDesc(e.target.value)}
                                            value={templateDesc}
                                        ></textarea>
                                    </>
                                }
                                <div className='flex justify-center mt-3'>

                                    <button className='p-2 px-10 bg-blue-600 w-fit border-none outline-none rounded-full text-lg text-white' onClick={() => handleUpdate(type._id)}>Update</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : ""}
        </div>
    )
}

export default Types