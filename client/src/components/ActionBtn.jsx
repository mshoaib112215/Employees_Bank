import React, { useState, useEffect } from 'react';

import { deleteEntry, deleteUser } from '../api/internal';
import EditEntryForm from './EditEntry';
import { useSelector, useDispatch } from 'react-redux';
import { deleteAllUser } from '../store/allUserSlice';
import { deleteAllRecords } from '../store/employeeSlice';
import Loader from './Loader';
import PreviewEntry from '../components/PreviewEntry'

const ActionBtn = ({ entryId, clicked, index, setClicked, mouseX, display, side, setAlert, setData, data, currentRecords, user = false, role }) => {

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [previewClicked, setPreviewClicked] = useState(false);
    const userId = useSelector((state) => state.user._id);
    const allEmployees = useSelector((state) => state.employee)
    const dispatch = useDispatch();

    const onDelete = async (entryId) => {
        setShowDeleteConfirmation(false);
        if (user) {
            dispatch(deleteAllUser(entryId));
        } else {
            dispatch(deleteAllRecords(entryId));
        }

        setAlert({ message: <Loader isTransparent={true} />, type: 'loading' });
        let response;
        if (user) {
            response = await deleteUser(entryId, userId);
        }
        else {
            response = await deleteEntry(entryId);
        }
        if (response < 1) {
            setAlert({ message: 'Sorry, something went wrong', type: 'Error' });
            setData(data);
        }
        else {
            setAlert({ message: 'Deleted Successfully', type: 'success' });

        }


    };
    useEffect(() => {
        setData(allEmployees)
    }, [allEmployees])
    const offset = -55;
    return (
        <>
            <div id='actionBtn' className={`absolute flex justify-center ${clicked === index ? '' : 'hidden'}`} style={{ left: mouseX > 225 ? mouseX + offset + "px" : !side && display ? "225px" : !display ? "21px" : '' }}>
                <button className={`rounded-full absolute left-8 border-2 p-2 w-12 h-12 ${ user ? 'animate-move-up' : 'animate-move-up2'} flex justify-center items-center border-green-200 transition-all bg-green-100 hover:bg-green-200`} onClick={() => { setShowEditForm(true); setClicked(null) }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <g fill="none" stroke="#22c55e" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                            <path d="m16.474 5.408l2.118 2.117m-.756-3.982L12.109 9.27a2.118 2.118 0 0 0-.58 1.082L11 13l2.648-.53c.41-.082.786-.283 1.082-.579l5.727-5.727a1.853 1.853 0 1 0-2.621-2.621Z" />
                            <path d="M19 15v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3" />
                        </g>
                    </svg>
                </button>
                {!user &&<button className={`rounded-full absolute left-8 border-2 p-2 w-12 h-12 animate-move-up flex justify-center items-center border-blue-200 transition-all bg-blue-100 hover:bg-blue-200`} onClick={() => { setPreviewClicked(true); setClicked(null) }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#919191" d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5Z" />
                    </svg>
                </button>}

                <button className="rounded-full absolute text-3xl top-[-3.9rem] left-[1.5rem]  border-2 bg-white p-2 w-16 h-16 flex justify-center items-center " onClick={() => setClicked(null)}>
                    <svg width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#878787" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z" />
                    </svg>
                </button>
                {role != 'admin' &&
                    <button className={`rounded-full absolute left-8 border-2 border-red-200 bg-red-100 hover:bg-red-200 z-10 p-2 w-12 h-12 animate-move-down transition-all flex justify-center items-center `} onClick={() => { setShowDeleteConfirmation(true); setClicked(null) }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#ff6161" d="M7 21q-.825 0-1.413-.588T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.588 1.413T17 21H7ZM17 6H7v13h10V6ZM9 17h2V8H9v9Zm4 0h2V8h-2v9ZM7 6v13V6Z" />
                        </svg>
                    </button>
                }

            </div>
            {showDeleteConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-20 backdrop-blur-md backdrop-filter">
                    <div className="bg-white rounded-lg p-4">
                        <p className="mb-4">Are you sure you want to delete this entry?</p>
                        <div className="flex justify-end">
                            <button className="border border-red-500 px-3 py-1 rounded-md mr-2 hover:bg-red-500 hover:text-white" onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
                            <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600" onClick={() => onDelete(entryId)}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
            {showEditForm && <EditEntryForm
                setAlert={setAlert}
                showEditForm={showEditForm}
                setData={setData}
                setShowEditForm={setShowEditForm}
                currentRecords={currentRecords}
                id={entryId}
                users={user}
            />}
            {previewClicked && <PreviewEntry
                setPreviewClicked={setPreviewClicked}
                previewClicked={previewClicked}
                currentRecords={currentRecords}
                id={entryId}
            />}



        </>
    );
};

export default ActionBtn;
