import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import ReactPaginate from 'react-paginate';
import BarChart from '../components/BarChart'
import axios from 'axios';
import { getEntries, getUsers } from '../api/internal';
import DistributedBarChart from '../components/PieChart';
import TableRow from "../components/TableRow"
import Loader from '../components/Loader'
import { filter } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { setEmployees } from '../store/employeeSlice'
import { setAllUser } from '../store/allUserSlice'
// import Search from '../components/Search';

const Home = ({ once, setOnce }) => {

    const [hrCount, setHrCount] = useState(0);
    const [employeeCount, setEmployeeCount] = useState(0);
    const [chartData, setChartData] = useState({ categories: [], series: [] });
    const [showFilters, setShowFilters] = useState(false)

    const [employeeData, setEmployeeData] = useState([]);
    const [employeeChartData, setEmployeeChartData] = useState({ labels: [], series: [] });
    const [countEmployees, setCountEmployees] = useState(0);
    const [isLoading, setLoading] = useState(true);
    const [recordsPerPage, setRecordsPerPage] = useState(10); // Default value
    const [currentPage, setCurrentPage] = useState(0);
    const dispatch = useDispatch();

    const storeEmployees = useSelector((state) => state.employee);
    const storeAllUsers = useSelector((state) => state.allUsers);

    let employees;
    let pageCount
    // useEffect(() => {

    // Sort the employeeData array by applied_date
    const sortedData = [...employeeData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


    // Pagination logic
    pageCount = Math.ceil(sortedData.length / recordsPerPage);

    const offset = currentPage * recordsPerPage;
    const currentRecords = sortedData.slice(offset, offset + recordsPerPage);

    let all_data = []

    all_data = currentRecords

    // }, [employeeData])



    ////////////////// Search //////////////////
    const cities = [...new Set(employeeData.map(employee => employee.city))];
    const applied_fors = [...new Set(employeeData.map(employee => employee.applied_for))];
    const types = [...new Set(employeeData.map(employee => employee.type))];
    const genders = [...new Set(employeeData.map(employee => employee.gender))];
    const Status = [...new Set(employeeData.map(employee => employee.status))];

    const [city, setCity] = useState('');
    const [appliedFor, setAppliedFor] = useState('');
    const [type, setType] = useState('');
    const [gender, setGender] = useState('');
    const [status, setStatus] = useState('');



    const [searchText, setSearchText] = useState('');

    const filteredRecords = currentRecords.filter(currentRecord => {
        const nameMatches = currentRecord.name.toLowerCase().includes(searchText.toLowerCase());
        const cityMatches = currentRecord.city.toLowerCase().includes(city.toLowerCase());
        const appliedForMatches = currentRecord.applied_for.toLowerCase().includes(appliedFor.toLowerCase());
        const typeMatches = currentRecord.type.toLowerCase().includes(type.toLowerCase());
        const genderMatches = currentRecord.gender.toLowerCase().includes(gender.toLowerCase());
        const statusMatches = currentRecord.status.toLowerCase().includes(status.toLowerCase());

        // Combine the filter conditions using logical AND (&&) operators
        return (
            nameMatches &&
            cityMatches &&
            appliedForMatches &&
            typeMatches &&
            genderMatches &&
            statusMatches
        );
    });



    ////////////////////////////////
    useEffect(() => {
        async function fetchData() {

            try {
                let response
                let usersData
                if (storeAllUsers.length == 0) {
                    response = await getUsers();
                    dispatch(setAllUser(response.data.users))
                    usersData = response.data.users
                }
                else {
                    usersData = storeAllUsers;
                }

                if (storeEmployees.length == 0) {
                    response = await getEntries();
                    dispatch(setEmployees(response.data.result))
                    employees = response.data.result;
                }
                else {

                    employees = storeEmployees;
                }

                const HrRoleCount = usersData.filter((user) => user.role == 'HR').length;
                const employeeCount = usersData.filter((user) => user.role == 'Data Entry').length;
                const employeesCount = employees.length

                setHrCount(HrRoleCount)
                setEmployeeCount(employeeCount)


                setCountEmployees(employeesCount)
                // Count the occurrences of each applied_for category
                const categoryCounts = {};
                employees.forEach((employee) => {
                    const category = employee.applied_for;
                    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
                });

                // Prepare data for the pie chart
                const labels = Object.keys(categoryCounts);
                const series = Object.values(categoryCounts);

                setEmployeeData(employees);
                setEmployeeChartData({ labels, series });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            finally {

                setLoading(false);
            }
        }

        fetchData();
    }, [storeAllUsers, storeEmployees]);

    useEffect(() => {
        async function fetchData() {
            try {
                employees = employeeData
                // Extract months from createdAt dates and group users by month
                const groupedData = employees.reduce((acc, employee) => {
                    const createdAt = new Date(employee.createdAt);
                    const monthYear = createdAt.toLocaleString('en-US', { month: 'long', year: 'numeric' });
                    if (!acc[monthYear]) {
                        acc[monthYear] = [];
                    }
                    acc[monthYear].push(employee);
                    return acc;
                }, {});

                // Calculate user counts for each month
                const categories = Object.keys(groupedData);
                const series = [{ name: 'Number of Users', data: categories.map(month => groupedData[month].length) }];


                setChartData({ categories, series });
            } catch (error) {
                console.error('Error fetching data:', error);
            }


        }

        fetchData();
    }, [employeeData]);


    return (
        <div className="w-full">
            <h1 className='text-4xl font-semibold text-[#6b7280] py-3'>
                Dashboard
            </h1>
            <div className="flex justify-evenly sm:flex-row flex-col gap-7 ">

                <div className='flex-1 flex flex-col items-center shadow-md p-6 pt-3 h-32 text-lg md:text-2xl sm:text-xl border-none rounded-3xl text-gray-500  bg-white font-semibold'>

                    {isLoading ?
                        <Loader isTransparent={true} />
                        :
                        (
                            <div className='text-5xl flex items-center w-full justify-between md:text-7xl self-center text-gray-500 sm:text-3xl font-semibold font-mono'>
                                <svg className = 'absolute' width = {120} height={120} xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 544.09 494.12"><defs>
                                    <style>
                                        {`.cls-10{fill:#b8ebff;}.cls-2{fill:#ffd600;}.cls-3{fill:#00a2ff;}`}
                                    </style>
                                    </defs><path class="cls-10" d="M303.51,13A239.6,239.6,0,0,0,198.7,37,22.33,22.33,0,0,1,176.78,55.3a21.89,21.89,0,0,1-7.53-1.41A241.77,241.77,0,0,0,97.47,129.3,31.28,31.28,0,0,1,76.4,183.75c-1.05,0-2.08-.06-3.1-.16a240.47,240.47,0,0,0-10.37,69.95c0,132.87,107.71,240.58,240.58,240.58S544.09,386.41,544.09,253.54,436.38,13,303.51,13Z" /><circle class="cls-10" cx="76.4" cy="152.42" r="25.67" /><circle class="cls-10" cx="64.26" cy="102.34" r="12.84" /><circle class="cls-10" cx="12.84" cy="62.48" r="12.84" /><circle class="cls-10" cx="51.42" cy="9.89" r="6.42" /><circle class="cls-10" cx="85.57" cy="9.17" r="9.17" /><circle class="cls-10" cx="108.01" cy="75.31" r="12.84" /><circle class="cls-10" cx="67.1" cy="42.83" r="12.84" /><circle class="cls-10" cx="131.23" cy="26.16" r="16.67" /><circle class="cls-10" cx="176.78" cy="32.97" r="16.67" /><path d="M443.43,126.2c-39.23.14-78.46.07-117.69.07-8.46,0-12.21,3.79-12.22,12.34v9.3H231.66c-12.77,0-48.26,0-55.24,0-10.08,0-15,4.94-15,15V352.54c0,10.42,4.91,15.37,15.27,15.37H328.91q45.46,0,90.93,0c8.8,0,14.16-5.34,14.23-14.14,0-4.36.05-34.37,0-41.4q0-20,0-39.94v-3.53c3.38,0,6.35-.15,9.29,0,6.22.37,10.58-2,12.73-8V134.28C454,128.27,449.66,126.18,443.43,126.2Z" /><path class="cls-2" d="M170.06,188.7V163.47c0-6,.94-6.93,7-6.93,6.34,0,38.05,0,52.13,0h84V188.7Z" /><path class="cls-3" d="M425.44,352.61c0,5.42-1.23,6.67-6.54,6.67H262.3V197.72h51.22V207q0,25.17,0,50.36c0,7.37,4,11.41,11.35,11.49h3.29c0,4.52,0,8.62,0,12.73.07,5.17,2.86,7.92,8.08,8,4.51,0,9,0,13.52,0,6.21,0,8.87-2.71,8.89-9,0-3.81,0-7.61,0-11.48h19.88a3.47,3.47,0,0,1,.23.77c0,3.84,0,7.67.06,11.51.06,5.38,2.79,8.14,8.15,8.2,4.41,0,8.82,0,13.24,0,6.43,0,9.09-2.66,9.11-9.07,0-3.8,0-7.6,0-11.49h16.08v3.25q0,20.46,0,40.91C425.42,321.29,425.45,348.77,425.44,352.61Z" /><path class="cls-3" d="M384.44,260.26h59.28c3.7,0,3.75,0,3.75-3.66v-118c0-3.69,0-3.71-3.69-3.71h-118c-3.55,0-3.65.1-3.65,3.78q0,58.84,0,117.69c0,3.77.1,3.87,3.87,3.87Z" /><path class="cls-2" d="M253.29,359.28V197.69H170.06v2.65q0,76.53,0,153.07c0,4.42,1.42,5.86,5.84,5.86h77.39Z" /><path class="cls-2" d="M336.94,280.79h12.88V269.06H336.94Z" /><path class="cls-2" d="M400.56,269H387.7v11.77h12.86Z" /><path d="M292.84,305.17c2.68,0,5.37-.08,8,0,3.84.15,6.72,2.51,6.92,6.34.29,5.82.29,11.68,0,17.51-.18,3.91-3.07,6.46-7.05,6.58-5.36.15-10.73.16-16.09,0-4.34-.13-7.06-3-7.16-7.39q-.16-7.91,0-15.81c.1-4.39,2.89-7.11,7.25-7.24,2.68-.08,5.37,0,8,0Z" /><path class="cls-2" d="M286.31,313.92v13h12.87v-13Z" /><path d="M343.3,305.16c2.58,0,5.17-.05,7.76,0,4.43.1,7.36,2.62,7.53,7,.23,5.46.22,10.93,0,16.38-.17,4.32-3.12,7-7.5,7.1-5.17.12-10.35.13-15.52,0-4.51-.11-7.29-3-7.37-7.48-.1-5.27-.11-10.54,0-15.81.1-4.36,2.92-7.05,7.32-7.18C338.12,305.1,340.71,305.16,343.3,305.16Z" /><path class="cls-2" d="M337,313.93v12.89h12.91V313.93Z" /><path d="M394.29,305.16c2.49,0,5-.05,7.48,0,4.41.11,7.35,2.68,7.51,7,.21,5.45.2,10.93,0,16.38-.16,4.2-3,6.93-7.26,7.05-5.36.14-10.73.16-16.09,0a6.93,6.93,0,0,1-7-7.2c-.1-5.36-.11-10.73,0-16.1.09-4.31,3-7,7.35-7.14C388.93,305.1,391.61,305.16,394.29,305.16Z" /><path class="cls-2" d="M400.57,313.94H387.7v12.94h12.87Z" /><path d="M277.53,274.15c0-2.68-.11-5.37,0-8a6.9,6.9,0,0,1,7.21-7c5.36-.07,10.73-.08,16.09,0,3.84.07,6.75,2.46,6.94,6.29.29,5.92.29,11.87,0,17.79-.19,3.75-3.1,6.22-7,6.33q-8,.22-16.09,0c-4.35-.13-7-3-7.19-7.37-.1-2.67,0-5.36,0-8Z" /><path class="cls-2" d="M299.17,280.82V268H286.31v12.86Z" /><path d="M292.86,213.05c2.68,0,5.36-.07,8,0,3.74.14,6.64,2.4,6.84,6.06a178.74,178.74,0,0,1,0,18.08c-.19,3.74-3.12,6.17-7,6.27-5.36.15-10.73.16-16.09,0a6.91,6.91,0,0,1-7.12-7.12q-.19-8,0-16.09c.1-4.4,2.88-7.08,7.27-7.21,2.68-.08,5.36,0,8.05,0Z" /><path class="cls-2" d="M286.37,221.76v13h12.76v-13Z" /><path d="M192.43,173.22a4.28,4.28,0,0,1-4.07,4.32,4.17,4.17,0,0,1-4.5-4.13,4.28,4.28,0,0,1,4-4.38A4.42,4.42,0,0,1,192.43,173.22Z" /><path d="M203.39,177.55a4.11,4.11,0,0,1-4.13-4.19,4.25,4.25,0,0,1,4.32-4.34,4.35,4.35,0,0,1,4.17,4.25A4.18,4.18,0,0,1,203.39,177.55Z" /><path d="M214.18,173.39a4.24,4.24,0,1,1,8.48-.15,4.24,4.24,0,0,1-8.48.15Z" /><path d="M422,170.13c-.12-4.52-2.77-7-7.3-7.08-5.08,0-10.19.27-15.25-.09-4.86-.35-8.67.93-11.35,5.09-1.06,1.64-2.54,2-4.41,2-9.4-.09-18.8-.06-28.2,0-5.19,0-7.7,2.4-7.72,7.48q-.06,18.86,0,37.7c0,4.87,2.39,7.4,7.18,7.41q29.93.09,59.86,0c4.57,0,7.06-2.6,7.2-7.18.07-2.54.07-23.76,0-34.59C422.08,177.24,422.08,173.68,422,170.13Z" /><path class="cls-2" d="M356.53,213.76V178.6h3c8,0,15.93-.24,23.88.09,4.85.2,8.58-1.06,11.41-5.1a4.46,4.46,0,0,1,2.93-1.83c5.07-.18,10.16-.08,15.68-.08,0,3.18,0,6.15,0,9.07,0,10.54,0,30.88,0,33Z" /><path class="cls-3" d="M422,237.93a4.29,4.29,0,0,1-4.5,4.17,4.24,4.24,0,0,1,.39-8.47A4.33,4.33,0,0,1,422,237.93Z" /><path d="M213.21,217.14c6.32,0,12.65,0,19,0,3.44,0,5.29,1.52,5.3,4.25s-1.87,4.36-5.24,4.37q-19,0-37.93,0c-3.28,0-5.29-1.77-5.22-4.43s2-4.16,5.15-4.18C200.56,217.12,206.89,217.14,213.21,217.14Z" /><path d="M213.49,247.65c-6.33,0-12.65,0-19,0-3.37,0-5.36-1.61-5.43-4.24s2-4.38,5.51-4.38q18.69,0,37.37,0c3.63,0,5.55,1.53,5.52,4.33s-2,4.28-5.61,4.29C225.75,247.66,219.62,247.65,213.49,247.65Z" /><path d="M213.21,260.88c6.42,0,12.84,0,19.25,0,3.21,0,5,1.59,5,4.24s-1.82,4.36-4.95,4.37q-19.11.06-38.22,0c-3.28,0-5.29-1.79-5.22-4.44s2-4.16,5.15-4.17C200.56,260.87,206.89,260.88,213.21,260.88Z" /><path d="M213.52,304.6c6.22,0,12.45,0,18.68,0,3.44,0,5.28,1.54,5.28,4.28s-1.88,4.33-5.26,4.34q-19,0-37.93,0c-3.27,0-5.28-1.79-5.2-4.45s2-4.14,5.17-4.16C200.68,304.58,207.1,304.6,213.52,304.6Z" /><path d="M213.2,326.47c6.32,0,12.64,0,19,0,3.47,0,5.3,1.5,5.32,4.24s-1.86,4.37-5.22,4.37q-19,0-37.94,0c-3.28,0-5.29-1.77-5.23-4.42s2-4.17,5.14-4.19C200.55,326.45,206.87,326.47,213.2,326.47Z" /><path d="M377,242.15c-8.05,0-16.1,0-24.14,0-3.19,0-4.89-1.41-5-3.95a3.88,3.88,0,0,1,3.24-4.41,15.72,15.72,0,0,1,3.43-.24q22.56,0,45.13,0c.76,0,1.53,0,2.3,0,2.73.24,4.49,1.93,4.51,4.27s-1.84,4.27-4.74,4.29C393.43,242.19,385.19,242.15,377,242.15Z" /></svg>
                                <div className='flex flex-col text-right w-full'>

                                    {countEmployees}
                                    <div className='text-gray-500 text-2xl whitespace-nowrap '>
                                        Entries
                                    </div>
                                </div>
                            </div>

                        )}

                </div>
                <div className='flex-1 flex flex-col items-center shadow-md p-6 pt-3 h-32 text-lg md:text-2xl sm:text-xl border-none rounded-3xl text-gray-500  bg-white font-semibold'>


                    {isLoading ?
                        <Loader isTransparent={true} />
                        :
                        (
                            <div className='text-5xl flex items-center w-full justify-between md:text-7xl self-center text-gray-500 sm:text-3xl font-semibold font-mono'>


                                <svg className='absolute' width={120} height={120} xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 544.09 494.12"><defs>
                                    <style>
                                        {`.cls-10{fill:#b8ebff;}.cls-2{fill:#ffd600;}.cls-3{fill:#00a2ff;}`}
                                    </style>

                                    </defs><path class="cls-10" d="M303.51,13A239.6,239.6,0,0,0,198.7,37,22.33,22.33,0,0,1,176.78,55.3a21.89,21.89,0,0,1-7.53-1.41A241.77,241.77,0,0,0,97.47,129.3,31.28,31.28,0,0,1,76.4,183.75c-1.05,0-2.08-.06-3.1-.16a240.47,240.47,0,0,0-10.37,69.95c0,132.87,107.71,240.58,240.58,240.58S544.09,386.41,544.09,253.54,436.38,13,303.51,13Z" /><circle class="cls-10" cx="76.4" cy="152.42" r="25.67" /><circle class="cls-10" cx="64.26" cy="102.34" r="12.84" /><circle class="cls-10" cx="12.84" cy="62.48" r="12.84" /><circle class="cls-10" cx="51.42" cy="9.89" r="6.42" /><circle class="cls-10" cx="85.57" cy="9.17" r="9.17" /><circle class="cls-10" cx="108.01" cy="75.31" r="12.84" /><circle class="cls-10" cx="67.1" cy="42.83" r="12.84" /><circle class="cls-10" cx="131.23" cy="26.16" r="16.67" /><circle class="cls-10" cx="176.78" cy="32.97" r="16.67" /><path d="M407.14,342.92c-.13-19.93-9.23-34.11-27.54-42.18q-24.66-10.87-49.45-21.48a3.25,3.25,0,0,1-2.34-3.6c.12-5.88-.06-11.77.12-17.65a6.25,6.25,0,0,1,1.65-3.9A51.62,51.62,0,0,0,344.5,227c.89-4.58,1-9.31,1.57-14.39,1.72,0,3.6.1,5.46,0a11,11,0,0,0,10.65-10.89c.13-5.06.09-10.13,0-15.2a9.93,9.93,0,0,0-5.67-9.22c-2.22-1.08-2.68-2.36-2.58-4.56.43-10-.66-19.77-5.07-28.83-11.55-23.77-30.76-35.7-57.13-35.08-24.8.58-42.62,12.65-53.44,34.93-4.49,9.25-5.5,19.21-5.17,29.36.06,1.87-.25,3.05-2.22,4-4.13,1.95-6,5.58-6.11,10.1s-.05,9,0,13.57c.06,7,4.66,11.7,11.7,11.88,1.6,0,3.2,0,4.66,0a4.48,4.48,0,0,1,.32.87,9.94,9.94,0,0,1,.05,1.09c-.33,15.79,5.26,29.12,16.6,40.11a4.82,4.82,0,0,1,1.1,3.1c.11,5.79-.06,11.59.11,17.37.06,2.15-.61,3.15-2.6,4-16.64,7-33.23,14.18-49.84,21.28a42.91,42.91,0,0,0-21.55,19.39,3,3,0,0,1-3.19,1.77c-3.16-.08-6.33,0-9.5,0-8.23,0-13,4.76-13,12.95,0,12.48.21,25-.09,37.45-.11,4.82,1,8.64,3.76,11.39a12,12,0,0,0,8.46,3.32h51.7a12.24,12.24,0,0,0,1.74.08c7.23-.11,14.46,0,21.69,0,1.39,0,143.23.05,154.85-.06l0,0h0a5.39,5.39,0,0,0,5.43-5.08c0-.22,0-.44,0-.67C407.1,368.26,407.22,355.59,407.14,342.92Z" /><path class="cls-2" d="M236.22,329.7c4,0,5.06,1.06,5.07,4.94q0,19.55,0,39.1c0,3.74-1.11,4.78-4.92,4.78H172.85c-4,0-5.09-1.08-5.09-5.17q0-19.28,0-38.55c0-4,1.13-5.1,5.21-5.1Z" /><path class="cls-3" d="M351.36,183.94a4.42,4.42,0,0,1,2.59,3.11c.29,4.67.14,9.37.12,14.06a3,3,0,0,1-3.15,3.31c-1.61.08-3.23,0-5.14,0V183.8C347.7,183.8,349.67,183.41,351.36,183.94Z" /><path class="cls-3" d="M241.37,204.37c-2,0-4,.39-5.66-.13a4.51,4.51,0,0,1-2.67-3.08c-.29-4.68-.17-9.4-.1-14.1a3.16,3.16,0,0,1,3.25-3.31c1.61-.13,3.24,0,5.18,0Z" /><path class="cls-2" d="M306.89,258.34a42.84,42.84,0,0,1-12.57,2l.87,0A45.71,45.71,0,0,0,306.89,258.34Z" /><path class="cls-2" d="M337.1,220.43c-1.1,17.91-13.72,32.64-30.11,37.88l-.1,0a45.71,45.71,0,0,1-11.7,2l-.87,0H293l-.86,0a45.71,45.71,0,0,1-11.71-2l-.09,0c-16.39-5.24-29-20-30.11-37.88-.84-13.6-.51-27.3-.3-41a18.25,18.25,0,0,1,23.55-17.34,16.7,16.7,0,0,1,3,1.28A54.54,54.54,0,0,0,285,167a34,34,0,0,0,8.68,1.74h.05a33.87,33.87,0,0,0,8.67-1.74,54.65,54.65,0,0,0,8.5-3.55,17.51,17.51,0,0,1,3-1.29,18.27,18.27,0,0,1,23.55,17.35C337.62,193.13,337.93,206.83,337.1,220.43Z" /><path class="cls-2" d="M293,260.37a42.84,42.84,0,0,1-12.57-2,45.71,45.71,0,0,0,11.71,2Z" /><path class="cls-3" d="M302.56,117.37l-.13,0c-.34-.06-.7-.11-1.06-.15l-1.05-.14-1.64-.18c-.42,0-.85-.08-1.29-.1,0,0,0,0,0,0l-.31,0-.3,0-.56,0h0c-.39,0-.77,0-1.16,0-.89,0-1.79,0-2.69,0-.39,0-.78,0-1.16,0h0l-.56,0-.65,0c-.43,0-.87.06-1.3.1l-.8.08-.81.1c-.29,0-.58.06-.87.11s-.84.11-1.26.18l-.12,0c-24,3.92-43.45,23.44-43.31,52v.25c0,2,.08,3.94.26,6,.42-1.16.7-1.74.87-2.37A26.14,26.14,0,0,1,263,153.78a26.92,26.92,0,0,1,15.08,1.52,113.18,113.18,0,0,0,13.45,4.87,16.74,16.74,0,0,0,2.09.4,17.3,17.3,0,0,0,2.08-.4,113.82,113.82,0,0,0,13.45-4.87,26.89,26.89,0,0,1,15.07-1.52,26.18,26.18,0,0,1,20.49,19.48c.16.63.43,1.21.86,2.37q.25-3.07.26-6v-.24C346,140.82,326.54,121.29,302.56,117.37Z" /><path class="cls-2" d="M270.21,322.68c-3.26-5.54-6.4-10.87-9.53-16.21s-6.18-10.59-9.43-16.15c2.68-1.17,5.19-2.32,7.75-3.35a2,2,0,0,1,1.71.24c8.76,6.67,17.48,13.4,26.45,20.29Z" /><path class="cls-3" d="M293.52,302.12C285.2,295.71,277,289.4,268.78,283a3,3,0,0,1-1-2c-.09-6.31-.05-12.61-.05-19.15,17.19,9,34.4,9,51.69,0,0,6.48,0,12.69-.05,18.9a3.34,3.34,0,0,1-1.06,2.31C310.09,289.39,301.85,295.7,293.52,302.12Z" /><path class="cls-2" d="M318.44,320c-.5.85-1,1.67-1.62,2.66L299.9,307.51l11.32-8.73c4.73-3.64,9.42-7.34,14.23-10.88a3.86,3.86,0,0,1,3-.45c2.37.8,4.62,1.95,7.18,3.08-1.23,2.12-2.39,4-3.46,6a8.88,8.88,0,0,0-.44.95C327.08,305.36,319.92,317.49,318.44,320Z" /><path class="cls-3" d="M248.86,378.57a14.14,14.14,0,0,0,.57-4.07c0-13.57.08-27.14,0-40.71,0-7.54-4.95-12.21-12.59-12.23-13.21,0-26.42,0-39.63,0h-3.36A27.24,27.24,0,0,1,202.9,312a95.07,95.07,0,0,1,11.56-5.88c9.58-4.24,19.23-8.3,29.11-12.54.55.88,1.1,1.67,1.59,2.5l19.73,33.69c2.39,4.08,4.69,4.43,8.21,1.29l14.1-12.62c-1.27,6.64-2.41,12.58-3.55,18.51-2.69,13.88-5.34,27.77-8.1,41.64H248.86Z" /><path class="cls-2" d="M283.83,378.57c3.17-15.81,6.2-31.65,9.27-47.48a1.6,1.6,0,0,1,.64-1q1.33,6.74,2.65,13.47c2.27,11.68,4.47,23.38,6.84,35.05Z" /><path class="cls-3" d="M311.48,378.57c-3.78-19.06-7.43-38.14-11.1-57.21-.13-.67-.12-1.37-.22-2.65,4.22,3.77,8,7.19,11.87,10.59,1.08,1,2.1,2,3.26,2.86,2.06,1.53,4.59,1.26,5.91-.92,3.63-5.94,18.15-30.47,21.56-36.54a4.37,4.37,0,0,0,.23-.49l.17-.29c.68.24,1.34.43,2,.7,10.52,4.57,21.06,9.09,31.55,13.73,14.77,6.54,22.18,18,22.31,34.09q.13,18.07,0,36.17C387.13,378.58,347.17,378.57,311.48,378.57Z" /><path d="M226.4,357l1.33-.8c4.3-2.66,6.42-7,5.55-11.4a11.09,11.09,0,0,0-9.83-9.11,52.2,52.2,0,0,0-8.93-.07,3.82,3.82,0,0,0-3.77,4.16q0,13.28,0,26.55a4.06,4.06,0,0,0,3.89,4.36c2.31.1,4.09-1.7,4.21-4.34.07-1.58,0-3.17,0-5.49,2.68,3,4.82,5.54,7,8,2,2.21,4.32,2.45,6.18.77s1.8-3.91-.17-6.23C230.13,361.25,228.29,359.17,226.4,357Zm-1.73-8.29c-1.3,1.82-3.23,1.78-5.15,1.51-.17.06-.33-.06-.51,0v-6.6c.18.07.34-.06.51,0,1.92-.27,3.85-.3,5.15,1.52a3.49,3.49,0,0,1,.37,1.78A3.53,3.53,0,0,1,224.67,348.71Z" /><path d="M183.68,348.45h10.68c0-2.8,0-5.48,0-8.17,0-2.91,1.68-4.76,4.07-4.72s4,1.82,4,4.55q.1,13,0,26c0,2.72-1.74,4.52-4,4.55s-4-1.82-4.06-4.74,0-5.93,0-9.07H183.74c0,2.81,0,5.66,0,8.52,0,3.38-1.52,5.31-4.06,5.28s-4.06-2-4.07-5.35q0-12.21,0-24.41a8.76,8.76,0,0,1,.27-2.4,3.71,3.71,0,0,1,4-2.92,3.62,3.62,0,0,1,3.72,3.59C183.79,342.17,183.68,345.14,183.68,348.45Z" /><path d="M375.12,346.51c0-1.44.06-2.89-.06-4.33a4,4,0,0,0-4-3.94,4,4,0,0,0-4,3.95,19.66,19.66,0,0,0-.06,2.17c0,8,.06,15.91,0,23.86,0,2.49.44,4.61,2.5,6.16h3.26c2-1.57,2.5-3.68,2.46-6.17C375.05,361,375.13,353.74,375.12,346.51Z" /><path d="M300.71,239a28.62,28.62,0,0,0,3.21-.06c1.78-.2,2.92-1.84,2.92-4s-1.16-3.75-2.93-4a10.7,10.7,0,0,0-1.6-.06c-5.89,0-11.78.06-17.66,0a4.56,4.56,0,0,0-4.56,2.5v3.26a4.57,4.57,0,0,0,4.57,2.46C290,238.94,295.36,239,300.71,239Z" /><circle cx="272.6" cy="197.56" r="6.21" /><circle cx="314.33" cy="197.56" r="6.21" /></svg>
                                <div className='flex flex-col text-right w-full'>

                                    {hrCount}
                                    <div className='text-gray-500 text-2xl whitespace-nowrap  '>

                                        HR Accounts
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
                <div className='flex-1 flex flex-col items-center shadow-md p-6 pt-3 h-32 text-lg md:text-2xl sm:text-xl border-none rounded-3xl text-gray-500  bg-white font-semibold'>


                    {isLoading ?
                        <Loader isTransparent={true} />
                        :
                        (
                            <div className='text-5xl flex items-center w-full justify-between md:text-7xl self-center text-gray-500 sm:text-3xl font-semibold font-mono'>

                                <svg className='absolute' width={120} height={120} xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 544.09 494.12"><defs>
                                    <style>
                                        {`.cls-10{fill:#b8ebff;}.cls-2{fill:#ffd600;}.cls-3{fill:#00a2ff;}`}
                                    </style>
                                    </defs><path class="cls-10" d="M303.51,13A239.6,239.6,0,0,0,198.7,37,22.33,22.33,0,0,1,176.78,55.3a21.89,21.89,0,0,1-7.53-1.41A241.77,241.77,0,0,0,97.47,129.3,31.28,31.28,0,0,1,76.4,183.75c-1.05,0-2.08-.06-3.1-.16a240.47,240.47,0,0,0-10.37,69.95c0,132.87,107.71,240.58,240.58,240.58S544.09,386.41,544.09,253.54,436.38,13,303.51,13Z" /><circle class="cls-10" cx="76.4" cy="152.42" r="25.67" /><circle class="cls-10" cx="64.26" cy="102.34" r="12.84" /><circle class="cls-10" cx="12.84" cy="62.48" r="12.84" /><circle class="cls-10" cx="51.42" cy="9.89" r="6.42" /><circle class="cls-10" cx="85.57" cy="9.17" r="9.17" /><circle class="cls-10" cx="108.01" cy="75.31" r="12.84" /><circle class="cls-10" cx="67.1" cy="42.83" r="12.84" /><circle class="cls-10" cx="131.23" cy="26.16" r="16.67" /><circle class="cls-10" cx="176.78" cy="32.97" r="16.67" /><path d="M417.56,370.44a4.73,4.73,0,0,0-1.18-3.7,4.86,4.86,0,0,0-3.85-1.15c-2,.08-4.08.06-6.24,0h-1.21c.18-.94.33-1.76.45-2.58s.23-1.85.32-2.74c7.84-.76,11.32-1.88,11.51-7.44,0-.54.05-1.09.07-1.64.17-3.91.37-8.34-1.54-11.53-1.34-2.23-4.28-3.09-7.39-4-1-.28-2-.58-2.91-.91,0-.13,0-.27,0-.41a22.91,22.91,0,0,1,.06-3.78c.3-2.36-.05-4-1.09-5.13-1.43-1.56-3.82-1.67-5.49-1.62-6.89.23-14.44.24-23.77,0a6.08,6.08,0,0,0-4.46,1.33c-1.27,1.26-1.42,3.14-1.4,4.63.1,8.92.09,18,.07,26.82,0,2.92,0,5.86,0,8.79h-3.31c4.39-7,1.79-13.48-1.56-20.07-1.16-2.27-2.23-4.66-3.26-7-1.11-2.5-2.26-5.08-3.55-7.56-4.6-8.91-6.42-16.23-5.87-23.73a16.09,16.09,0,0,0-9.28-16c-4.05-1.93-5.58-5.41-7.35-9.45-.39-.88-.79-1.79-1.22-2.7-3.06-6.4-7.17-10.35-12.21-11.73a32.62,32.62,0,0,0-8.83-.95l-6.26.13-1.78.05H275.25l-4.09,0c-3,0-5.75,0-8.58,0A17.11,17.11,0,0,0,247,276.25c-1,1.87-1.83,3.8-2.67,5.67-.76,1.7-1.55,3.45-2.39,5.12-.94,1.85-1.7,2.53-2.17,2.77-7.73,4-11.35,10.48-11.41,20.45a32.78,32.78,0,0,1-2.63,12.15c-3.16,7.53-6.75,15-10.22,22.31-.88,1.83-1.76,3.67-2.63,5.5-2.55,5.39-2.33,10.53.66,15.29a.93.93,0,0,0,0,.1h-9.26c-10.21,0-19.84,0-29.68-.06-1.63,0-3.44.14-4.63,1.41a5.29,5.29,0,0,0-1.11,4.17l0,.73h-.06v11a3.39,3.39,0,1,0,6.7,0V372.29H410.86v10.54a3.39,3.39,0,1,0,6.7,0v-11h0C417.54,371.39,417.54,370.91,417.56,370.44Z" /><path class="cls-2" d="M405.93,342.29l1.2.13a20.35,20.35,0,0,1,3.06.45,21.49,21.49,0,0,1,.38,9.77,15.42,15.42,0,0,1-3.25,1.11l-1.39.38Z" /><path class="cls-2" d="M249.74,285.6a34.55,34.55,0,0,1,4.5-8.22,14.39,14.39,0,0,1,8.53-4.37l48.68-.48h.09a20.22,20.22,0,0,1,9.69,1.25c4.84,2.09,7,7.43,9.13,12.59.22.56.44,1.1.67,1.63H248.67C249,287.18,249.39,286.38,249.74,285.6Z" /><path class="cls-3" d="M235,308.92c.05-9.16,5.13-14.21,14.33-14.21,22.68,0,52.57,0,82.53,0,8.41,0,13.71,4.94,13.83,12.85.17,11.49.12,23.17.08,34.47q0,6.38,0,12.74a2.56,2.56,0,0,1-.09.6H234.94V341.93q0-5,0-10C234.92,324.37,234.92,316.58,235,308.92Z" /><path class="cls-2" d="M228.53,355v.32c-4.6,2.9-3,6.61-1.74,9.33.13.31.26.6.39.89a9.82,9.82,0,0,1-6.58-1.91,7.48,7.48,0,0,1-3-5.75c-.17-3.49,1.67-6.88,3.45-10.16.6-1.11,1.22-2.25,1.75-3.37l5.7-10.42C228.54,340.88,228.54,347.89,228.53,355Z" /><path class="cls-2" d="M339.38,365.64h-.06c-13,0-26.2,0-39.19,0H267.87c-2.89,0-5.77,0-8.65,0-6.47,0-13.16,0-19.73,0-3.34,0-4.86-.72-6.18-3.31h113.6C345.33,365,342.8,365.64,339.38,365.64Z" /><path class="cls-2" d="M360.84,361.88c-1.62,2.16-4.51,3.39-7.94,3.44,1.13-3.66.48-7.6-.15-11.43a46.43,46.43,0,0,1-.66-5.14c-.2-4-.11-8,0-12,0-.32,0-.63,0-.95l9.38,18.48A7.53,7.53,0,0,1,360.84,361.88Z" /><path class="cls-2" d="M399.13,362c0,2.9-2.24,3.53-4.09,3.55-5.14.06-10.21.05-15.05,0-1.44,0-3.87-.46-3.91-3.21-.14-7.91-.11-15.65-.09-23.85q0-3.9,0-7.84h23.19c0,2.65,0,5.27,0,7.88C399.23,346.63,399.24,354.26,399.13,362Z" /><path d="M290,336.21h.34A8,8,0,0,0,296,334a8.2,8.2,0,0,0-5.58-14h-.12a8.14,8.14,0,0,0-.28,16.27Z" /><path class="cls-2" d="M290.3,326.36h0a1.72,1.72,0,1,1-.08,3.43,1.63,1.63,0,0,1-1.61-1.74A1.7,1.7,0,0,1,290.3,326.36Z" /><path d="M458.93,172.08c-3.39-35.7-34-64.07-69.63-64.57-13.61-.2-27.45-.15-40.84-.1q-8.49,0-17,0v0H315.18c-13.42,0-27.29,0-40.94,0a89.84,89.84,0,0,0-12.92.94,72.1,72.1,0,0,0-59.23,84.23,71.83,71.83,0,0,0,59.74,58.07,3.51,3.51,0,0,1,2.67,1.62,30.23,30.23,0,0,0,24.63,13h.41a30.34,30.34,0,0,0,24.61-12.42,2.91,2.91,0,0,1,2.74-1.39c25.07.06,48,.06,70,0a70.21,70.21,0,0,0,10.71-.69C436.25,244.92,462.63,211.06,458.93,172.08Z" /><path class="cls-3" d="M262.6,220.11c-.74,1.38-1.34,1.85-2.45,1.73v-59h38.12v42.3a31.27,31.27,0,0,0-13.36-.87C274.83,206,267.32,211.31,262.6,220.11Z" /><rect class="cls-3" x="260.13" y="139.32" width="38.09" height="16.03" /><path class="cls-2" d="M289.55,258.07h-.05a23.42,23.42,0,0,1,.08-46.83h.05A23.51,23.51,0,0,1,313,234.79,23.5,23.5,0,0,1,289.55,258.07Z" /><path class="cls-3" d="M316.9,220.81a30.19,30.19,0,0,0-10.24-11.72,2.38,2.38,0,0,1-.85-1.3c-.07-13.28-.06-26.78-.05-39.84v-5.06h54.18v58.89c-.36,0-.71,0-1,0H347c-9.26,0-18.85,0-28.27,0C317.61,221.86,317.32,221.69,316.9,220.81Z" /><rect class="cls-3" x="305.89" y="139.32" width="53.98" height="16.02" /><path class="cls-2" d="M437.83,220a63.92,63.92,0,0,1-44.15,24c-2.37.22-4.74.34-7,.34q-26.14,0-52.27,0H318.69a32.09,32.09,0,0,0,1-15.23h88c4.38,0,5.33-.95,5.33-5.36V136.9c0-4-1.12-5.1-5.19-5.1h-150c-4.07,0-5.19,1.15-5.19,5.35v86.36c0,4.62.94,5.55,5.61,5.56h1.09A31.74,31.74,0,0,0,260,243c-.81-.15-1.55-.3-2.28-.47a64.88,64.88,0,0,1-32.3-107,64.25,64.25,0,0,1,47.49-20.77c35.3-.12,72.71-.12,114.38,0,33.09.1,60.13,24.07,64.31,57A63.79,63.79,0,0,1,437.83,220Z" /><rect class="cls-3" x="367.43" y="139.27" width="38.2" height="16.08" /><rect class="cls-3" x="367.46" y="162.88" width="38.2" height="58.81" /><path d="M368.4,291.49a16.33,16.33,0,1,0,0-32.66h0a16.33,16.33,0,1,0,0,32.66Z" /><path class="cls-2" d="M368.27,284.24a9.19,9.19,0,0,1-8.94-9.17,9.11,9.11,0,0,1,9.1-8.91h.09a9,9,0,0,1,8.9,9.14,9.08,9.08,0,0,1-9,8.94Z" /><path d="M311.94,173.86h36.53c3,0,4.5-1.22,4.54-3.62a3.45,3.45,0,0,0-.91-2.59,4.7,4.7,0,0,0-3.6-1.07H312c-3.49,0-4,2.4-4,3.43a3.61,3.61,0,0,0,.91,2.7A4.13,4.13,0,0,0,311.94,173.86Z" /><path d="M348.47,187.29c3,0,4.49-1.22,4.54-3.62a3.45,3.45,0,0,0-.91-2.59,4.73,4.73,0,0,0-3.6-1.08H325.61c-4.46,0-8.92,0-13.38,0a4.28,4.28,0,0,0-3.6,1.45,3.39,3.39,0,0,0-.53,3c.68,2.8,3.32,2.78,4.31,2.8q18,0,36,0Z" /><path d="M374.12,188.11h0c2.77,0,5.54,0,8.3,0H389q4.42,0,8.85,0h0a4.81,4.81,0,0,0,3.52-1.1,3.47,3.47,0,0,0,.95-2.6c0-2.42-1.55-3.65-4.55-3.65H374.1a4.84,4.84,0,0,0-3.55,1.12,3.49,3.49,0,0,0-.95,2.6C369.62,186.89,371.14,188.11,374.12,188.11Z" /><path d="M398,194.21H374c-3.51,0-4.32,1.9-4.37,3.5a3.51,3.51,0,0,0,.92,2.69,4.74,4.74,0,0,0,3.49,1.15h23.93a4.72,4.72,0,0,0,3.5-1.16,3.51,3.51,0,0,0,.92-2.69C402.3,196.11,401.49,194.21,398,194.21Z" /><path d="M266.81,187.33h.09c2.77,0,5.59,0,8.32,0h16.27a3.77,3.77,0,0,0,2.81-1.05,3.6,3.6,0,0,0,1-2.67,3.45,3.45,0,0,0-3.68-3.52l-.94,0H267a4.73,4.73,0,0,0-3.55,1.12,3.53,3.53,0,0,0-.92,2.63C262.53,185.12,263.13,187.33,266.81,187.33Z" /><path d="M275.49,200.74h6.71c2.82,0,5.64,0,8.46,0,1.11,0,4.49,0,4.6-3.53a3.47,3.47,0,0,0-.91-2.64,4.74,4.74,0,0,0-3.53-1.12H266.87c-3.75,0-4.35,2.23-4.38,3.56a3.52,3.52,0,0,0,.95,2.63,4.76,4.76,0,0,0,3.43,1.1H267C269.81,200.73,272.65,200.74,275.49,200.74Z" /></svg>
                                <div className='flex flex-col justify-center  text-right w-full'>

                                    {employeeCount}
                                    <div className='text-gray-500 text-2xl text-right '>
                                        DE Accounts
                                    </div>
                                </div>
                            </div>
                        )}

                </div>
            </div>
            <div className='flex flex-col items-center w-full'>
                <h2 className='text-xl sm:text-3xl font-semibold text-gray-600 mt-3'>Employee Data Entries by Month</h2>
                <BarChart
                    categories={chartData.categories}
                    series={chartData.series}

                />
                <h2 className='text-xl sm:text-3xl font-semibold text-gray-600 mt-3'>Employee Categories Distribution</h2>
                <DistributedBarChart
                    categories={employeeChartData.labels}
                    values={employeeChartData.series}
                />
            </div>

            <div className="py-6 text-lg text-[#6b7280] capitalize">
                <div className="flex justify-between items-center flex-wrap flex-col sm:flex-row">

                    <h2 className="text-3xl  mb-4 font-[600] text-[#6b7280] text-center w-full">Recent Entries</h2>
                    {/* Pagination component */}


                </div>


                <div className="overflow-x-auto text-lg text-[#6b7280] capitalize">

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
                            <td colSpan="12"><Loader /></td> // Use your loader component here
                        ) : (
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredRecords?.length === 0 ? (
                                    <tr>
                                        <td colSpan="12" className='text-center'>No data available</td>
                                    </tr>
                                ) : (
                                    <>
                                        {filteredRecords.map((entry, index) => (
                                            <TableRow key={index} entry={entry} setClicked={() => { }} isHome={true} />
                                        ))}
                                    </>
                                )}
                            </tbody>
                        )}


                    </table>
                </div>
                {/* Pagination component
                <div className="flex justify-center items-center mt-4 flex-wrap">
                    <ReactPaginate
                        previousLabel={'<'}
                        nextLabel={'>'}
                        breakLabel={'...'}
                        pageCount={pageCount}
                        onPageChange={handlePageChange}
                        containerClassName={'flex gap-2 flex-wrap'}
                        pageClassName={'px-3 py-1 border bg-white   rounded-lg cursor-pointer'}
                        previousClassName={'px-3 py-1 bg-white border rounded-lg cursor-pointer'}
                        nextClassName={'px-3 bg-white py-1 border rounded-lg cursor-pointer'}
                        activeClassName={'!bg-blue-500 text-white'}
                        disabledClassName={'text-gray-300 cursor-not-allowed'}
                    />
                </div> */}
            </div>
        </div>
    );
};

export default Home;
