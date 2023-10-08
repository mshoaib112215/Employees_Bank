import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar';
import { Home, Users, Entries, Records } from '../pages'
import fullLogo from '../../public/full logo.svg'

import axios from 'axios';
import { getAppliedFor, getEmployeeTypes, getTemplates, logoutUser } from '../api/internal';
import Loader from '../components/Loader';
import LogoutHandler from '../components/Logout'
import { useDispatch, useSelector } from 'react-redux';
import { resetUser } from '../store/userSlice';
import { resetEmployees } from '../store/employeeSlice';
import { resetAllUser } from '../store/allUserSlice';
import SettingPage from '../pages/SettingPage';
import { useEffect } from 'react';
import { getEntries, getUsers } from '../api/internal';
import TableRow from '../components/TableRow'
import { setEmployees } from '../store/employeeSlice';
import { setAllUser } from '../store/allUserSlice';
import { resetAppliedFor, setAppliedFor } from '../store/appliedForSlice';
import { resetEmployeeType, setEmployeeType } from '../store/employeeTypeSlice';
import { resetTemplates, setTemplates } from '../store/templatesSlice';

const Dashboard = ({ setAlert }) => {
    const [side, setSide] = useState(false)
    const [display, setDisplay] = useState(true);
    const [isAddClicked, setIsAddClicked] = useState(false)
    const [loggingOut, setLoggingOut] = useState(false);
    const dispatch = useDispatch();
    const [isLoading, setLoading] = useState(true);
    const [once, setOnce] = useState(true)
    const [isLogout, setIsLogout] = useState(true);
    const storeEmployees = useSelector((state) => state.employee);
    const [employeeData, setEmployeeData] = useState([]);
    const storeUser = useSelector((state) => state.allUsers);
    const storeAppliedFors = useSelector((state) => state.applied_for);
    const storeEmployeesType = useSelector((state) => state.employee_type);


    const role = useSelector((state) => state.user.role)
    const id = useSelector((state) => state.user._id)

    const navigate = useNavigate();
    const logout = async () => {
        setLoggingOut(true); // Set loading state

        setAlert({ message: <Loader isTransparent />, type: 'loading' })
        try {

            const response = await logoutUser();
            if (response.status === 200) {


                dispatch(resetUser());
                dispatch(resetEmployees());
                dispatch(resetAllUser());
                dispatch(resetAppliedFor());
                dispatch(resetEmployeeType());
                dispatch(resetTemplates())
                setAlert({ message: "Logout Successfully", type: 'success' })
                navigate('/login');
            }
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setLoggingOut(false); // Reset loading state
        }
    }
    useEffect(() => {
        async function fetchData() {
            try {
                let employees
                if (storeEmployees.length === 0) {
                    const response = await getEntries();
                    employees = response.data.result;
                    const sortedData = [...employees].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    dispatch(setEmployees(sortedData))
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);
    useEffect(() => {
        async function fetchUser() {
            try {
                let users
                if (storeUser.length === 0) {

                    users = await getUsers();
                    dispatch(setAllUser(users.data.users))
                }

            }
            catch (error) {
                // console.log(error)
            }
        }
        fetchUser();
    }, [])
    useEffect(() => {
        async function fetchAppliedFor() {
            try {
                let res
                if (storeAppliedFors.length === 0) {

                    res = await getAppliedFor();
                    dispatch(setAppliedFor(res.result))
                }
            }
            catch (error) {
                // console.log(error)
            }
        }
        fetchAppliedFor();
    }, [])
    useEffect(() => {
        async function fetchEmployeeType() {
            try {
                let res
                if (storeEmployeesType.length === 0) {
                    res = await getEmployeeTypes();
                    dispatch(setEmployeeType(res.result))
                }

            }
            catch (error) {
                // console.log(error)
            }
        }
        fetchEmployeeType();
    }, [])

    const [show404, setShow404] = useState(false);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShow404(true);
        }, 500);
        return () => clearTimeout(timeoutId); 
    }, []);
    // for tempales
    useEffect(() => {
        async function fetchTemplates() {
            try {
                let res
                if (storeEmployeesType.length === 0) {

                    res = await getTemplates();
                    dispatch(setTemplates(res.data.result))
                }

            }
            catch (error) {
                console.log(error)
            }
        }
        fetchTemplates();
    }, []);



    return (
        <>

            <Sidebar setAlert={setAlert} side={side} setSide={setSide} display={display} setDisplay={setDisplay} />
            <Navbar setAlert = {setAlert}/>
            <div className={`flex ${!display && "!ml-0"} ${side ? "ml-16" : "ml-[12.7rem] 3xl:ml-[12rem]"} sm:p-4 p-1 sm:pt-16 pt-16  bg-[#e8e8e880]  h-full bottom-0`}>
                <Routes>
                    {(role == 'admin' || role == 'HR') && <Route path="/" element={<Home once={once} setOnce={setOnce} />} />}
                    {role == 'admin' && <Route path="/users" element={<Users display={display} side={side} setAlert={setAlert} isAddClicked={isAddClicked} setIsAddClicked={setIsAddClicked} />} />}
                    {role == 'admin' && <Route path="/settings" element={<SettingPage setAlert={setAlert} />} />}
                    {(role == 'admin' || role == 'HR') && <Route path="/records" element={<Records display={display} side={side} setAlert={setAlert} isAddClicked={isAddClicked} setIsAddClicked={setIsAddClicked} />} />}
                    <Route path="/logout" element={<div className={`fixed  inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-20 `}>
                        <div className="bg-white rounded-lg p-4">
                            <p className="mb-4">Are you sure you want to logout?</p>
                            <div className="flex justify-end">
                                <button className="border border-gray-500 px-3 py-1 rounded-md mr-2 hover:bg-gray-500 hover:text-white" onClick={() => navigate('/')}>Cancel</button>
                                <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-gray-600" onClick={logout}>Logout</button>
                            </div>
                        </div>
                    </div>} />


                    <Route
                        path="*"
                        element={
                            role != 'Data Entry' ?
                                <div className='flex justify-center gap-6 items-center flex-col w-screen text-xl h-screen '>
                                    {show404 ? (
                                        <h1 className='fixed top-[40%] text-6xl font-bold text-red-700'>404 Not Found</h1>
                                    ) : null}
                                </div>
                                :
                                <div className='flex mt-10  gap-6 items-center flex-col w-full text-xl h-screen '>
                                    <h1 className='text-6xl font-bold text-gray-600 sm:w-[40%] w-[100%]'>
                                        <img className='w-full' src={fullLogo} alt="Candi Track" />
                                    </h1>
                                    <h2 className=' mb-10'>Select
                                        <span className=' bg-yellow-600 px-2 py-1 mx-2 rounded-lg text-white'>Data Entry</span>option to do Data Entry
                                    </h2>

                                    {/* Table */}
                                    <div className="w-full">

                                        <h2 className="text-2xl font-semibold mb-4 text-[#6e6e6e]">Your Recent Entries</h2>

                                        <div className="overflow-x-scroll text-lg text-[#6e6e6e] capitalize">
                                            <table className="min-w-full whitespace-nowrap">
                                                <thead>
                                                    <tr className="bg-gray-50">
                                                        <th className="px-4 py-2">Name</th>
                                                        <th className="px-4 py-2">Email</th>
                                                        <th className="px-4 py-2">Phone</th>
                                                        <th className="px-4 py-2">Gender</th>
                                                        <th className="px-4 py-2">City</th>
                                                        <th className="px-4 py-2">CNIC</th>
                                                        <th className="px-4 py-2">Applied For</th>
                                                        <th className="px-4 py-2">Type</th>
                                                        <th className="px-4 py-2">Status</th>
                                                        <th className="px-4 py-2">Created By</th>
                                                        <th className="px-4 py-2">Created At</th>
                                                        <th className="px-4 py-2">Applied Date</th>

                                                    </tr>
                                                </thead>
                                                {isLoading ? ( // Step 3: Conditionally render loader or content
                                                    <td colSpan="13"><Loader /></td> // Use your loader component here
                                                ) : (
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {storeEmployees.length === 0 ? (
                                                            <tr>
                                                                <td colSpan="13" className='text-center'>No data available</td>
                                                            </tr>
                                                        ) : (
                                                            <>

                                                                {storeEmployees.map((entry, index) => (
                                                                    <React.Fragment key={index}>
                                                                        <TableRow entry={entry} setClicked={() => { }} index={index} isEmployee={true} isHome={true}/>

                                                                    </React.Fragment>
                                                                ))}
                                                            </>
                                                        )}
                                                    </tbody>
                                                )}


                                            </table>
                                        </div>
                                    </div>
                                </div>
                        }
                    />
                </Routes>


            </div>
        </>
    )
}

export default Dashboard