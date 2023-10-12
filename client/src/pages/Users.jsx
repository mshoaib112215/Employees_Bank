  import React, { useState, useEffect } from 'react'
  import { filter, throttle } from 'lodash';
  import ActionBtn from '../components/ActionBtn';
  import ReactPaginate from 'react-paginate';
  import { getUsers } from '../api/internal';
  import TableRow from '../components/TableRow';
  import TextInput from '../components/TextInput';
  import AddEntryForm from '../components/AddEntryForm'
  import { useDispatch, useSelector } from 'react-redux';
  import AddUserForm from '../components/AddUserForm';
  import Loader from '../components/Loader'
  import { appendAllUser, setAllUser } from '../store/allUserSlice';


  const Users = ({ display, side, setAlert }) => {

    const [role, setRole] = useState(null)
    const [showFilters, setShowFilters] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searching, setSearching] = useState(false)

    const [clicked, setClicked] = useState(null)
    const [handelAddUser, setHandelAddUser] = useState(false)
    const [isLoading, setLoading] = useState(true); // Step 2: Add loading state
    const allUserData = useSelector((state) => state.allUsers)
    const dispatch = useDispatch();
    let users;
    // Sort the userData array by applied_date
    
    let sortedData = [...allUserData].sort((a, b) => new Date(a.applied_date) - new Date(b.applied_date));
  
    // Pagination loginc
    const [recordsPerPage, setRecordsPerPage] = useState(10); // Default value
    

    const [currentPage, setCurrentPage] = useState(0);
    const offset = currentPage * recordsPerPage;
    const currentRecords = sortedData.slice(offset, offset + recordsPerPage);
    const handlePageChange = ({ selected }) => {
      setCurrentPage(selected);
    };
    const handleRecordsPerPageChange = (e) => {
      const newRecordsPerPage = e.target.value === 1000 ? sortedData.length : parseInt(e.target.value, 10);
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


    useEffect(() => {
      async function fetchData() {
        try {
          if (!allUserData) {
            const response = await getUsers();
            dispatch(setAllUser(response.data.users));

          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
        finally {
          setLoading(false);
        }
      }

      fetchData();
    }, [dispatch, allUserData]);

    useEffect(() => {
      const anyValueSelected = role !== '';
      setSearching(!anyValueSelected ? false : true);
      setRecordsPerPage(anyValueSelected ? sortedData.length : 10)
    }, [role]);

    const filteredRecords = currentRecords.filter(currentRecord => {
      const nameMatches =
        currentRecord.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (currentRecord.username.toString().includes(searchText.toLowerCase())) || // Convert to string
        (currentRecord.email.toString().includes(searchText.toLowerCase()));

      const roleSelected = role ? currentRecord.role.toLowerCase().includes(role.toLowerCase()) : true;
      const adminRole = currentRecord.role !== 'admin';
      // Combine the filter conditions using logical AND (&&) operators

      return (
        nameMatches &&
        roleSelected&&
        adminRole

      );
    });
    const pageCount = Math.ceil(filteredRecords.length / recordsPerPage);
    const clearSerach = () => {
      setSearchText('');
      setRole('');

    }


    return (
      <>
        <div className="py-6 w-full ">
          <div className="flex justify-between items-center">

            <h2 className="text-2xl font-semibold mb-4 ">Users</h2>
            {/* Pagination component */}
            <div className="flex gap-7">



              <div className='flex items-center mb-4'>

                <button className="bg-[#1c75bc] px-3 py-2 w-52 h-12 hover:bg-[#1c74bcce] text-white rounded-full transition-all" onClick={() => setHandelAddUser(!handelAddUser)}>Add User</button>
              </div>
            </div>
          </div>

          <div className="flex mb-4 items-end flex-wrap gap-2  text-lg   outline-none">
                <div className='flex flex-col gap-2 animate-expand outline-none'>
                  
              <select onChange={(e) => { setRole(e.target.value) }} value={role} className="border rounded p-1 outline-none" >
                    <option  value=''>By Role...</option>
                    <option value={'HR'}>HR</option>
                    <option value={'Data Entry'}>Data Entry</option>

                  </select>
                </div>
            <input
              type="text"
              className="border rounded  px-2 outline-none py-1 h-fit w-auto sm:w-[350px] "
              placeholder="By Name, Username, Email"
              disabled={handelAddUser}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button className='flex cursor-pointer gap-2 underline p-1 text-gray-500 hover:text-[#1c75bc] text-sm border-none rounded-md' onClick={() => clearSerach()}>
              {/* <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="#fff" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z" />
              </svg> */}
              Clear Filters
            </button>
            <div className='mb-1 flex-1 text-end'>
              <h2>Total Records: <span className='font-semibold'>{searchText.length > 0 || searching ? filteredRecords.length : sortedData.length -1}</span></h2>

            </div>
          </div>
          <div className="overflow-x-auto text-lg capitalize rounded-xl custom-shadow">
            <table className="min-w-full whitespace-nowrap text-[15px] text-left font-semibold">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Username</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Role</th>
                </tr>
              </thead>
              {isLoading ? ( // Step 3: Conditionally render loader or content
                <td colSpan="4"><Loader /></td> // Use your loader component here
              ) : (
                <tbody className="bg-white divide-y divide-gray-200">

                  {filteredRecords.length < 1 ? (
                    <tr>
                      <td colSpan="4" className='text-center'>No data available</td>
                    </tr>
                  ) : (
                    <>

                      {filteredRecords.map((entry, index) => (
                        
                        <React.Fragment key={index}>
                          <TableRow entry={entry} setClicked={setClicked} index={index} users={true} isHome={true} />
                          <ActionBtn
                            entryId={entry._id}
                            clicked={clicked}
                            setClicked={setClicked}
                            index={index}
                            mouseX={mouseX}
                            display={display}
                            role={entry.role}
                            side={side}
                            setAlert={setAlert}
                            currentRecords={currentRecords}
                            setData={setAllUser}
                            data={allUserData}
                            user={true}
                          />
                        </React.Fragment>
                      
                      ))}
                    </>
                  )}

                </tbody>
              )}


            </table>
          </div>
          {/* Pagination component */}
          <div className="flex justify-center gap-3 sm:justify-end   items-center mt-4 flex-wrap">

            <p className='mr-2'>
              Showing {currentPage + 1} of {pageCount} Pages
            </p>

           
            <div className="flex justify-center items-center ">
              <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={''}
                pageCount={pageCount}
                onPageChange={handlePageChange}
                containerClassName={'flex gap-2 '}
                pageClassName={'hidden'}
                previousClassName={'px-3 py-1 bg-white border rounded-lg cursor-pointer'}
                nextClassName={'px-3 bg-white py-1 border rounded-lg cursor-pointer'}
                activeClassName={'!bg-[#1c75bc] text-white'}
                disabledClassName={'text-gray-300 cursor-not-allowed'}
              />
              <div className="flex items-center ml-3">
                <span className="mr-2">Records per page:</span>
                <select

                  value={searchText.length > 0 || searching ? (1000) : recordsPerPage}
                  disabled={searchText.length > 0 || searching ? true : false}

                  onChange={handleRecordsPerPageChange}
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
        </div>
        {/* Add entry form */}

        {handelAddUser && (
          <AddUserForm setAlert={setAlert} isAddClicked={handelAddUser} setIsAddClicked={setHandelAddUser}  />
        )}
      </>
    )
  }

  export default Users