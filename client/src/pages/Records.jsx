import React, { useState, useEffect } from 'react'
import { throttle } from 'lodash';
import ActionBtn from '../components/ActionBtn';
import ReactPaginate from 'react-paginate';
import { getEntries, deleteAllRec } from '../api/internal';
import TableRow from '../components/TableRow';
import TextInput from '../components/TextInput';
import AddEntryForm from '../components/AddEntryForm'
import { useSelector } from 'react-redux';
import Loader from '../components/Loader'
import { deleteSelected } from '../store/employeeSlice'
import { useDispatch } from 'react-redux';

const Records = ({ display, side, setAlert, isAddClicked, setIsAddClicked }) => {


  const [employeeData, setEmployeeData] = useState([]);
  const [clicked, setClicked] = useState(null)
  const [isLoading, setLoading] = useState(true);
  const role = useSelector((state) => state.user.role)
  const [showFilters, setShowFilters] = useState(false)
  const [searching, setSearching] = useState(false);
  const [checkAllClick, setCheckAllClick] = useState(false);
  const [deleteSelectedRecordsClick, setDeleteSelectedRecordsClick] = useState(false)
  const [selectedValues, setSelectedValues] = useState([]);
  const dispatch = useDispatch();


  ////////////////// Search //////////////////
  const cities = [...new Set(employeeData.map(employee => employee.city))];
  const applied_fors = [...new Set(employeeData.map(employee => employee.applied_for))];
  const types = [...new Set(employeeData.map(employee => employee.type))];
  const genders = [...new Set(employeeData.map(employee => employee.gender))];
  const Status = [...new Set(employeeData.map(employee => employee.status))];
  const storeEmployees = useSelector((state) => state.employee);
  const storeUser = useSelector((state) => state.allUsers);
  const [allIds, setAllIds] = useState(null);

  const [city, setCity] = useState('');
  const [appliedFor, setAppliedFor] = useState('');
  const [type, setType] = useState('');
  const [gender, setGender] = useState('');
  const [status, setStatus] = useState('');
  const [createdBy, setCreatedBy] = useState('');



  let employees;
  // Sort the employeeData array by applied_date
  const sortedData = [...employeeData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Pagination loginc
  const [recordsPerPage, setRecordsPerPage] = useState(10); // Default value
  

  const [currentPage, setCurrentPage] = useState(0);
  const offset = currentPage * recordsPerPage;
  const currentRecords = sortedData.slice(offset, offset + recordsPerPage);
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleRecordsPerPageChange = (e) => {
    const newRecordsPerPage = e.target.value === 1000 || searching ? sortedData.length : parseInt(e.target.value, 10);
    setRecordsPerPage(newRecordsPerPage);
    setCurrentPage(0); // Reset to the first page
  };

  // On mouse move on the table
  const [mouseX, setMouseX] = useState(null);


  // Listen to the mousemove event to track the mouse coordinates
  useEffect(() => {
    const handleMouseMove = throttle((event) => {
      setMouseX(event.clientX);
    }, 10);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const deleteAll = async()=>{
    

    setDeleteSelectedRecordsClick(false);
    setAlert({ message: <Loader isTransparent={true} />, type: 'loading' });
    
    try{
      const res = await deleteAllRec(selectedValues)
      console.log(res)
      if (res.status != 200) {
        setAlert({ message: 'Sorry, something went wrong', type: 'Error' });
        setData(data);
      }
      else {
        setAlert({ message: 'Deleted Successfully', type: 'success' });
        const tableCheckboxes = document.querySelectorAll('.custom-checkbox')
        console.log(tableCheckboxes)
        tableCheckboxes.forEach(checkbox => {
          checkbox.checked = false; // Set the checkbox to checked

        });
        dispatch(deleteSelected(selectedValues));
        setCheckAllClick(false)
        
      }
    }

    catch(error){
      console.log(error)
    }
  }

  //////////////////////////////////// Search ///////////////////////
  const [searchText, setSearchText] = useState('');

  const filteredRecords = currentRecords.filter(currentRecord => {


    let newSearchText;
    if (searchText.startsWith('0')) {

      newSearchText = searchText.toString().replace('0', '')
    }
    else {
      newSearchText = searchText
    }
    const nameMatches =
      currentRecord.name.toLowerCase().includes(newSearchText.toLowerCase()) ||
      (currentRecord.cnic.toString().includes(newSearchText.toLowerCase())) || // Convert to string
      (currentRecord.phone.toString().includes(newSearchText.toLowerCase()));
    const cityMatches = currentRecord.city.toLowerCase().includes(city.toLowerCase());
    const appliedForMatches = currentRecord.applied_for.toLowerCase().includes(appliedFor.toLowerCase());
    const typeMatches = currentRecord.type.toLowerCase().includes(type.toLowerCase());
    const genderMatches = currentRecord.gender.toLowerCase().includes(gender.toLowerCase());
    const statusMatches = currentRecord.status.toLowerCase().includes(status.toLowerCase());
    const created_by = currentRecord.created_by.toLowerCase().includes(createdBy.toLowerCase());
    // Combine the filter conditions using logical AND (&&) operators

    return (
      nameMatches &&
      cityMatches &&
      appliedForMatches &&
      typeMatches &&
      genderMatches &&
      statusMatches &&
      created_by

    );
  });
  const pageCount = Math.ceil(filteredRecords.length / recordsPerPage);
  const clearSerach = () => {
    setSearchText('');
    setCity('');
    setAppliedFor('');
    setType('');
    setGender('');
    setStatus('');
    setCreatedBy('');
  }




  ////////////////////////////////
  useEffect(() => {
    async function fetchData() {
      try {
        if (!storeEmployees) {

          const response = await getEntries();
          employees = response.data.result;
          if (employees) {
            setEmployeeData(employees);
          }
        }
        else {

          setEmployeeData(storeEmployees);
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
    const anyValueSelected = city !== '' || type !== '' || gender !== '' || appliedFor !== '' || status !== '' || createdBy !== '';
    setCurrentPage(0);

    setSearching(!anyValueSelected ? false : true);
    setRecordsPerPage(anyValueSelected ? sortedData.length : 10)
  }, [city, type, gender, appliedFor, status, createdBy]);

  useEffect(() => {

    if (searchText.length > 0) {
      setRecordsPerPage(sortedData.length)
      setCurrentPage(0);

    }
    else {
      setRecordsPerPage(10)
    }

  }, [searchText])


  useEffect(() => {
    console.log(selectedValues)
  }, [selectedValues])
  return (
    <>
      <div className="py-6 w-full">
        <div className="flex justify-between flex-col sm:flex-row items-center">

          {/* Pagination component */}
          <div className="flex gap-2 justify-between w-full ">
            <h2 className="text-2xl font-semibold mb-4 ">Employee Entries</h2>

            <div className='flex items-center mb-4 '>

              <button className="bg-[#1c75bc] px-3 py-2 w-52 h-12 hover:bg-blue-400 text-white rounded-full" onClick={() => setIsAddClicked(!isAddClicked)}>Add Record</button>
            </div>
          </div>
        </div>
        <div className="flex mb-4 items-end flex-wrap gap-2 text-lg   outline-none">
          {showFilters ?
            <>
              <div className='flex flex-col gap-2 animate-expand outline-none'>

                <label>Cities</label>
                <select onChange={(e) => { setCity(e.target.value) }} value={city} className="border rounded p-1">
                  <option value=''>Select one...</option>
                  {cities.map((city, index) => (
                    <option key={index} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div className='flex flex-col gap-2 animate-expand outline-none'>

                <label>Types</label>
                <select onChange={(e) => { setType(e.target.value) }} value={type} className="border rounded p-1">
                  <option value=''>Select one...</option>

                  {types.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className='flex flex-col gap-2 animate-expand outline-none'>

                <label>Gender</label>
                <select onChange={(e) => { setGender(e.target.value) }} value={gender} className="border rounded p-1">
                  <option value=''>Select one...</option>

                  {genders.map((gender, index) => (
                    <option key={index} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>
              <div className='flex flex-col gap-2 animate-expand outline-none'>

                <label>Applied For</label>
                <select onChange={(e) => { setAppliedFor(e.target.value) }} value={appliedFor} className="border rounded p-1">
                  <option value=''>Select one...</option>

                  {applied_fors.map((applied_for, index) => (
                    <option key={index} value={applied_for}>{applied_for}</option>
                  ))}
                </select>
              </div>
              <div className='flex flex-col gap-2 animate-expand outline-none'>

                <label>Status</label>
                <select onChange={(e) => { setStatus(e.target.value) }} value={status} className="border rounded p-1">
                  <option value=''>Select one...</option>

                  {Status.map((status, index) => (
                    <option key={index} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className='flex flex-col gap-2 animate-expand outline-none'>

                <label>Created By</label>
                <select onChange={(e) => { setCreatedBy(e.target.value) }} value={createdBy} className="border rounded p-1">
                  <option value=''>Select one...</option>

                  {storeUser.map((user, index) => (
                    <option key={index} value={user._id}>{user.name}</option>
                  ))}
                </select>
              </div>
            </>
            :
            <button className='self-center' onClick={() => setShowFilters(true)}><svg width="25" height="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#000000" d="M9 5a1 1 0 1 0 0 2a1 1 0 0 0 0-2zM6.17 5a3.001 3.001 0 0 1 5.66 0H19a1 1 0 1 1 0 2h-7.17a3.001 3.001 0 0 1-5.66 0H5a1 1 0 0 1 0-2h1.17zM15 11a1 1 0 1 0 0 2a1 1 0 0 0 0-2zm-2.83 0a3.001 3.001 0 0 1 5.66 0H19a1 1 0 1 1 0 2h-1.17a3.001 3.001 0 0 1-5.66 0H5a1 1 0 1 1 0-2h7.17zM9 17a1 1 0 1 0 0 2a1 1 0 0 0 0-2zm-2.83 0a3.001 3.001 0 0 1 5.66 0H19a1 1 0 1 1 0 2h-7.17a3.001 3.001 0 0 1-5.66 0H5a1 1 0 1 1 0-2h1.17z" />
            </svg>
            </button>
          }
          <button className={`${!showFilters ? 'hidden' : 'block'} flex items-center h-full  text-xl font-semibold p-1 text-white rounded-md bg-gray-500`} onClick={() => setShowFilters(!showFilters)}>{'<'}</button>
          <input
            type="text"
            className="border rounded  px-2 outline-none py-1 h-fit w-auto sm:w-[350px] "
            placeholder="Search by name, CNIC or Phone #"
            value={searchText}
            disabled={isAddClicked ? true : false}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button className='flex cursor-pointer gap-2 underline p-1 text-gray-500 hover:text-[#1c75bc] text-sm border-none rounded-md' onClick={() => clearSerach()}>
            {/* <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#000" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z" />
            </svg> */}
            Clear Filters
          </button>
          <div className='mb-1 flex-1 text-end'>
            <h2>Total Records: <span className='font-semibold'>{searchText.length > 0 || searching ? filteredRecords.length : sortedData.length}</span></h2>

          </div>
        </div>

        {role == 'admin' && <button disabled={selectedValues.length === 0} className='flex cursor-pointer gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed bg-red-600 text-white p-1 text-sm border-none rounded-md mb-3' onClick={() => setDeleteSelectedRecordsClick(true)}>Delete selected records</button>}

        <div className="overflow-x-auto text-lg capitalize rounded-xl custom-shadow">
          <table className="min-w-full whitespace-nowrap text-[14px] 3xl:text-[15px] text-left  font-semibold">
            <thead>
              <tr className="bg-gray-50 ">
                {role == 'admin' && <th className="px-4 py-2"><input type="checkbox" checked={checkAllClick} className='pl-5 custom-checkbox' onClick={() => setCheckAllClick(!checkAllClick)} /></th>}
                <th className="px-4 py-1">Name</th>
                <th className="px-4 py-1">Email</th>
                <th className="px-4 py-1">Phone</th>
                <th className="px-4 py-1">Gender</th>
                <th className="px-4 py-1">City</th>
                <th className="px-4 py-1">CNIC</th>
                <th className="px-4 py-1">Applied For</th>
                <th className="px-4 py-1">Type</th>
                <th className="px-4 py-1">Status</th>
                <th className="px-4 py-1">Created By</th>
                <th className="px-4 py-1">Created At</th>
                <th className="px-4 py-1">Applied Date</th>

              </tr>
            </thead>
            {isLoading ? ( // Step 3: Conditionally render loader or content
              <td colSpan="13"><Loader /></td> // Use your loader component here
            ) : (
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="13" className='text-center'>No data available</td>
                  </tr>
                ) : (
                  <>

                    {filteredRecords.map((entry, index) => (
                      <React.Fragment key={index}>
                        <TableRow entry={entry} setClicked={setClicked} index={index} checkAllClick={checkAllClick} selectedValues={selectedValues} setSelectedValues={setSelectedValues} filteredRecords={filteredRecords} setCheckAllClick={setCheckAllClick} />
                        {role == 'admin' &&
                          <ActionBtn
                            entryId={entry._id}
                            clicked={clicked}
                            setClicked={setClicked}
                            index={index}
                            mouseX={mouseX}
                            display={display}
                            side={side}
                            setAlert={setAlert}
                            currentRecords={currentRecords}
                            setData={setEmployeeData}
                          />}
                      </React.Fragment>
                    ))}
                  </>
                )}
              </tbody>
            )}


          </table>
        </div>

        {/* Pagination component */}

        <div className="flex justify-center gap-3  sm:justify-end items-center mt-4 flex-wrap">
          <p className='mr-2'>
            Showing {currentPage + 1} of {pageCount} Pages
          </p>
         
          <ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            breakLabel={''}
            pageCount={pageCount}
            onPageChange={handlePageChange}
            containerClassName={'flex gap-2 flex-wrap select-none'}
            pageClassName={'hidden'}
            previousClassName={'px-3 py-1 flex-wrap bg-white border rounded-lg cursor-pointer'}
            nextClassName={'px-3 bg-white py-1 border flex-wrap rounded-lg cursor-pointer'}
            activeClassName={'!bg-[#1c75bc] text-white'}
            disabledClassName={'text-gray-300 cursor-not-allowed'}
          />
          <div className="flex items-center ">
            <span className="mr-2">Records per page:</span>

            <select
              onChange={handleRecordsPerPageChange}
              value={searchText.length > 0 || searching ? (1000) : recordsPerPage}

              disabled={searchText.length > 0 || searching ? true : false}
              className="px-2 w-14 outline-none py-1 border rounded-lg"
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={1000}>All</option>
              {/* Add more options as needed */}
            </select>
          </div>
        </div>
      </div>
      {/* Add entry form */}

      {isAddClicked && (
        <AddEntryForm setAlert={setAlert} isAddClicked={isAddClicked} setIsAddClicked={setIsAddClicked} setEmployeeData={setEmployeeData} />
      )}
      {deleteSelectedRecordsClick && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-[100] backdrop-blur-md backdrop-filter">
          <div className="bg-white rounded-lg p-4">
            <p className="mb-4">Are you sure you want to delete this entry?</p>
            <div className="flex justify-end">
              <button className="border border-red-500 px-3 py-1 rounded-md mr-2 hover:bg-red-500 hover:text-white" onClick={() => setDeleteSelectedRecordsClick(false)}>Cancel</button>
              <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600" onClick={() => deleteAll()}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Records