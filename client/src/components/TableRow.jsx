import React, { useState, useEffect, useRef } from 'react';
import { getUsers } from '../api/internal'; // Adjust the path as needed
import { getEmployeeTypes, getAppliedFor } from '../api/internal'
import { useSelector } from 'react-redux';
import { isEmptyObject } from 'jquery';
import { FastField } from 'formik';



const TableRow = ({ entry, setClicked, index, users = false, isEmployee, checkAllClick, setSelectedValues, selectedValues, filteredRecords, setCheckAllClick, isHome }) => {
    const [creatorName, setCreatorName] = useState('');
    const ID = useSelector((state) => state.user._id);
    const role = useSelector((state) => state.user.role);
    const [phoneCopied, setPhoneCopied] = useState(false)
    const [cnicCopied, setCnicCopied] = useState(false)
    isEmployee = isEmployee ? true : false;
    const [changing, setChanging] = useState(false)




    if (entry.created_by != ID) {
        if (isEmployee) {

            return null
        }
    }
    useEffect(() => {
        if (checkAllClick) {
            setChanging(false)
        }
    }, [checkAllClick])
    const allUserData = useSelector((state) => state.allUsers)
    // Split the date and time components 
    const dateTime = new Date(entry.createdAt);
    const dateTime_entry_date = new Date(entry.applied_date);
    // const dateTime = new Date(entry.appliedDate);
    // Format the date as "08-Aug-2023"
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const date = dateTime.toLocaleDateString(undefined, options);
    // console.log(new Date(entry.createdAt))
    const entry_date = dateTime_entry_date.toLocaleDateString(undefined, options);

    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const time = dateTime.toLocaleTimeString(undefined, timeOptions);

    useEffect(() => {
        async function fetchUser() {
            try {
                if (entry.created_by) {

                    const userData = allUserData.filter(user => user._id === entry.created_by)[0];
                    setCreatorName(userData.name);
                }
                else {
                    setCreatorName('Unknown');
                }

                // console.log(creatorName)
            } catch (error) {
                setCreatorName('Error');
                console.log(error)
            }

        }
        fetchUser();
    }, [entry.created_by]);


    const handleCheckboxChange = (entryId) => {

        setSelectedValues((prevSelectedValues) => {
            if (prevSelectedValues.includes(entryId.toString())) {

                return prevSelectedValues.filter((id) => id !== entryId.toString());
            } else {

                return [...prevSelectedValues, entryId.toString()];
            }
        });
    };

    useEffect(() => {

        if (!isHome){

            getAllValues()
        }

    }, [checkAllClick]);
    const getAllValues = () => {
        if (checkAllClick) {
            // When "Check All" is clicked, store all checkbox valuesconso
            const checkedValues = filteredRecords.map(item => (item._id).toString());
            setSelectedValues(checkedValues);
        } else if(!checkAllClick && !changing) {
            // When "Check All" is unchecked, clear the selected values
            setSelectedValues([]);
        }
        console.log(!checkAllClick && !changing)
    }
    return (
        <>
            {/* {console.log(checkedArray)} */}
            {/* <button onClick={getCheckedValues}>get values</button> */}
            {!users ?
                <tr className='relative cursor-pointer' onClick={() => setClicked(index)}>
                    {!isHome && role == 'admin' && <td className="p-4 whitespace-nowrap ">
                        <input
                            type="checkbox"
                            className="pl-5 w-4 custom-checkbox"
                            onChange={e => {
                                handleCheckboxChange(entry._id);
                            }}
                            value={entry._id}
                            onClick={e => {
                                e.stopPropagation();
                                setChanging(true);
                                e.checked; 
                            }}
                            checked={!changing && checkAllClick? true: null}
                        />
                        
                    </td>}
                    <td className="p-4 whitespace-nowrap ">{entry.name}</td>


                    <td className="p-4 whitespace-nowrap  lowercase">{entry.email}</td>
                    <td className="p-4 whitespace-nowrap  flex">0{entry.phone.toString().substring(0, 3)}-
                        <span>{entry.phone.toString().substring(3)}</span>
                        <button
                            className="ml-2 px-2 py-1 flex bg-blue-50 text-white rounded-md hover:bg-blue-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText('0' + entry.phone), setPhoneCopied(true)
                                setTimeout(() => {
                                    setPhoneCopied(false);
                                }, 2000);
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <g fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                                    <path d="M16 3H4v13" />
                                    <path d="M8 7h12v12a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V7Z" />
                                </g>
                            </svg>
                            {<span className='ml-2 text-xs text-black'>{phoneCopied ? 'Copied!' : <span className="mx-[0.42rem]">Copy</span>}</span>}

                        </button>
                    </td>
                    <td className="p-4 whitespace-nowrap ">{entry.gender}</td>
                    <td className="p-4 whitespace-nowrap ">{entry.city}</td>
                    <td className="p-4 whitespace-nowrap  flex">
                        {entry.cnic.toString().substring(0, 5)}-
                        <span>{entry.cnic.toString().substring(5, 12)}-</span>
                        {entry.cnic.toString().substring(12)}
                        <button
                            className="ml-2 px-2 py-1 flex bg-blue-50 text-white rounded-md hover:bg-blue-100"
                            onClick={(e) => {
                                e.stopPropagation();

                                navigator.clipboard.writeText(entry.cnic);
                                setCnicCopied(true);
                                setTimeout(() => {
                                    setCnicCopied(false);
                                }, 2000);
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <g fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                                    <path d="M16 3H4v13" />
                                    <path d="M8 7h12v12a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V7Z" />
                                </g>
                            </svg>
                            <span className='ml-2 text-xs text-black'>{cnicCopied ? 'Copied!' : <span className="mx-[0.42rem]">Copy</span>}</span>
                        </button>
                    </td>

                    <td className="p-4 whitespace-nowrap ">{entry.applied_for}</td>
                    <td className="p-4 whitespace-nowrap ">{entry.type}</td>
                    <td className="p-4 whitespace-nowrap ">{entry.status}</td>
                    <td className="p-4 whitespace-nowrap ">{creatorName}</td>
                    <td className="p-4 whitespace-nowrap ">{date} <span className='p-1 rounded-md bg-blue-600 uppercase text-white'>{time}</span></td>
                    <td className="p-4 whitespace-nowrap ">{entry_date} </td>
                </tr>
                :
                <tr className='relative cursor-pointer' onClick={() => setClicked(index)}>
                    <td className="p-4 whitespace-nowrap ">{entry.name}</td>
                    <td className="p-4 whitespace-nowrap ">{entry.username}</td>
                    <td className="p-4 whitespace-nowrap  lowercase">{entry.email}</td>
                    <td className="p-4 whitespace-nowrap  "><span className={`p-1 rounded-md ${entry.role === 'HR' ? 'bg-yellow-600' : entry.role === 'admin' ? 'bg-green-600' : 'bg-blue-600'} capitalize text-white`}>{entry.role}</span></td>
                </tr>}


        </>

    );
};

export default TableRow;
