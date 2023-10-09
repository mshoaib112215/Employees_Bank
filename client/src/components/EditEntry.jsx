import React, { useState, useEffect } from 'react'
import TextInput from './TextInput'
import { useFormik } from 'formik';
import employeeSchema from '../schemas/employeeSchema'
import userEdit from '../schemas/userEdit'
import { getAppliedFor, getUsers, EditUser, getEmployeeTypes, EditEntry, getEntries } from '../api/internal';
import { current } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { setAllUser, resetAllUser } from '../store/allUserSlice';
import { setEmployees, resetEmployees } from '../store/employeeSlice';
import 'react-datepicker/dist/react-datepicker.css';
import Loader from './Loader';
import Select from 'react-select';
import Templetes from '../components/Templetes'



const EditEntryForm = ({ setAlert, setShowEditForm, showEditForm, setData, id, currentRecords, users = false }) => {
    const [types, setTypes] = useState([])
    const [showErrors, setShowErrors] = useState(false);
    const [employeeTypes, setEmployeeTypes] = useState([])
    
    const [record, setRecord] = useState(null)
    
    const [remarks, setRemarks] = useState('');
    const userId = useSelector((state) => state.user._id)
    const dispatch = useDispatch();
    const handleSelectChange = (selected) => {
        handleChange('city')(selected.value); // Pass the selected value to handleChange for 'city'
    };
    const pakCities = [
        "Islamabad",
        "Ahmed Nager",
        "Ahmadpur East",
        "Ali Khan",
        "Alipur",
        "Arifwala",
        "Attock",
        "Bhera",
        "Bhalwal",
        "Bahawalnagar",
        "Bahawalpur",
        "Bhakkar",
        "Burewala",
        "Chillianwala",
        "Chakwal",
        "Chichawatni",
        "Chiniot",
        "Chishtian",
        "Daska",
        "Darya Khan",
        "Dera Ghazi",
        "Dhaular",
        "Dina",
        "Dinga",
        "Dipalpur",
        "Faisalabad",
        "Fateh Jhang",
        "Ghakhar Mandi",
        "Gojra",
        "Gujranwala",
        "Gujrat",
        "Gujar Khan",
        "Hafizabad",
        "Haroonabad",
        "Hasilpur",
        "Haveli",
        "Lakha",
        "Jalalpur",
        "Jattan",
        "Jampur",
        "Jaranwala",
        "Jhang",
        "Jhelum",
        "Kalabagh",
        "Karor Lal",
        "Kasur",
        "Kamalia",
        "Kamoke",
        "Khanewal",
        "Khanpur",
        "Kharian",
        "Khushab",
        "Kot Adu",
        "Jauharabad",
        "Lahore",
        "Lalamusa",
        "Layyah",
        "Liaquat Pur",
        "Lodhran",
        "Malakwal",
        "Mamoori",
        "Mailsi",
        "Mandi Bahauddin",
        "mian Channu",
        "Mianwali",
        "Multan",
        "Murree",
        "Muridke",
        "Mianwali Bangla",
        "Muzaffargarh",
        "Narowal",
        "Okara",
        "Renala Khurd",
        "Pakpattan",
        "Pattoki",
        "Pir Mahal",
        "Qaimpur",
        "Qila Didar",
        "Rabwah",
        "Raiwind",
        "Rajanpur",
        "Rahim Yar",
        "Rawalpindi",
        "Sadiqabad",
        "Safdarabad",
        "Sahiwal",
        "Sangla Hill",
        "Sarai Alamgir",
        "Sargodha",
        "Shakargarh",
        "Sheikhupura",
        "Sialkot",
        "Sohawa",
        "Soianwala",
        "Siranwali",
        "Talagang",
        "Taxila",
        "Toba Tek",
        "Vehari",
        "Wah Cantonment",
        "Wazirabad",
        "Badin",
        "Bhirkan",
        "Rajo Khanani",
        "Chak",
        "Dadu",
        "Digri",
        "Diplo",
        "Dokri",
        "Ghotki",
        "Haala",
        "Hyderabad",
        "Islamkot",
        "Jacobabad",
        "Jamshoro",
        "Jungshahi",
        "Kandhkot",
        "Kandiaro",
        "Karachi",
        "Kashmore",
        "Keti Bandar",
        "Khairpur",
        "Kotri",
        "Larkana",
        "Matiari",
        "Mehar",
        "Mirpur Khas",
        "Mithani",
        "Mithi",
        "Mehrabpur",
        "Moro",
        "Nagarparkar",
        "Naudero",
        "Naushahro Feroze",
        "Naushara",
        "Nawabshah",
        "Nazimabad",
        "Qambar",
        "Qasimabad",
        "Ranipur",
        "Ratodero",
        "Rohri",
        "Sakrand",
        "Sanghar",
        "Shahbandar",
        "Shahdadkot",
        "Shahdadpur",
        "Shahpur Chakar",
        "Shikarpaur",
        "Sukkur",
        "Tangwani",
        "Tando Adam",
        "Tando Allahyar",
        "Tando Muhammad",
        "Thatta",
        "Umerkot",
        "Warah",
        "Abbottabad",
        "Adezai",
        "Alpuri",
        "Akora Khattak",
        "Ayubia",
        "Banda Daud",
        "Bannu",
        "Batkhela",
        "Battagram",
        "Birote",
        "Chakdara",
        "Charsadda",
        "Chitral",
        "Daggar",
        "Dargai",
        "Darya Khan",
        "dera Ismail",
        "Doaba",
        "Dir",
        "Drosh",
        "Hangu",
        "Haripur",
        "Karak",
        "Kohat",
        "Kulachi",
        "Lakki Marwat",
        "Latamber",
        "Madyan",
        "Mansehra",
        "Mardan",
        "Mastuj",
        "Mingora",
        "Nowshera",
        "Paharpur",
        "Pabbi",
        "Peshawar",
        "Saidu Sharif",
        "Shorkot",
        "Shewa Adda",
        "Swabi",
        "Swat",
        "Tangi",
        "Tank",
        "Thall",
        "Timergara",
        "Tordher",
        "Awaran",
        "Barkhan",
        "Chagai",
        "Dera Bugti",
        "Gwadar",
        "Harnai",
        "Jafarabad",
        "Jhal Magsi",
        "Kacchi",
        "Kalat",
        "Kech",
        "Kharan",
        "Khuzdar",
        "Killa Abdullah",
        "Killa Saifullah",
        "Kohlu",
        "Lasbela",
        "Lehri",
        "Loralai",
        "Mastung",
        "Musakhel",
        "Nasirabad",
        "Nushki",
        "Panjgur",
        "Pishin valley",
        "Quetta",
        "Sherani",
        "Sibi",
        "Sohbatpur",
        "Washuk",
        "Zhob",
        "Ziarat"
    ]
    const optionList = pakCities.map(city => ({
        value: city,
        label: city
    }));
    useEffect(() => {
        const fetch = async () => {
            try {
                if (!users) {
                    const resAppliedFor = await getAppliedFor();
                    const resEmployeeTypes = await getEmployeeTypes();
                    var all_types = resAppliedFor.result;
                    var all_employee_types = resEmployeeTypes.result;


                    const sortedTypes = all_types.sort((a, b) => a.value.localeCompare(b.value));
                    const sortedEmployeeTypes = all_employee_types.sort((a, b) => a.value.localeCompare(b.value));
                    setTypes(sortedTypes);
                    setEmployeeTypes(sortedEmployeeTypes);
                }
            }
            catch (err) {
                console.error('Error fetching data:', err);
            }
        }
        fetch()
    }, [id])

    useEffect(() => {
        setRecord(currentRecords.filter(entry => entry._id == id))
    }, [id])
    useEffect(()=>{
        setRemarks(record?.[0]?.remarks)

    },[record])
    let formattedDate;
    if (!users) {

        record && (formattedDate = new Date(record?.[0]?.applied_date).toISOString().split("T")[0])
    }
    let payload;
    if (!users) {
        payload = {
            initialValues: {
                applied_for: record?.[0]?.applied_for || '',
                name: record?.[0]?.name || '',
                email: record?.[0]?.email || '',
                gender: record?.[0]?.gender || '',
                phone_no: record?.[0]?.phone || '',
                cnic: record?.[0]?.cnic || '',
                type: record?.[0]?.type || '',
                status: record?.[0]?.status || '',
                remarks: record?.[0]?.remarks || '',
                city: record?.[0]?.city || '',
                applied_date: formattedDate || '',
            },
            validationSchema: employeeSchema,
            enableReinitialize: true
        };
    }
    else {
        payload = {
            initialValues: {
                email: record?.[0]?.email || '',
                name: record?.[0]?.name || '',
                role: record?.[0]?.role || '',
                password: '',
                confirmPassword: '',
            },
            validationSchema: userEdit,
            enableReinitialize: true
        }
    }
    const { values, touched, handleBlur, handleChange, errors } = useFormik(payload);

    const handleEditEntry = async () => {
        setShowErrors(true)
        setAlert({ message: <Loader flex={true} isTransparent={true} />, type: "loading" })
        if (Object.keys(errors).length > 0) {
            console.log(Object.keys(errors).length)
            console.log(errors)
            setAlert({ message: "Please fill Required fields", type: "error" })
            return
        }
        // send them to the function
        values.cnic = parseInt(values.cnic.replace(/-/g, '').slice(0, 13));
        values.phone_no = parseInt(values.phone_no.replace(/-/g, '').slice(0, 11));


        //get values from form
        if (!users) {
            const remarks = values.remarks;
            if (remarks === '') {
                values.remarks = 'No remarks'
            }
        }
        // send them to the function
        let response;
        if (!users) {

            response = await EditEntry(values, id)
        }
        else {
            response = await EditUser(values, id, userId)
        }
        if (response?.data.modifiedCount >= 1) {
            let data;
            if (!users) {

                response = await getEntries();
                data = response.data.result;

            }
            else {
                response = await getUsers();
                data = response.data.users
            }

            if (data) {
                setData(data);
                if (users) {
                    dispatch(resetAllUser)
                    dispatch(setAllUser(data))
                }
                else {
                    dispatch(resetEmployees)
                    dispatch(setEmployees(data))
                }
                setShowEditForm(false)
                setRemarks('')

            }
            setAlert({ message: "Updated successfully", type: "success" })


        }
        else {

            setAlert({ message: "Failed to add user, Make sure Email, Phone Number, CNIC are unique ", type: "error" })
        }

        setShowErrors(true)
    }

    const handleChangeRemarks = (e) => {
        setRemarks(e.target.value)
    }

    return (
        <div className="fixed inset-0 pt-10 overflow-y-scroll  flex justify-center h-screen  bg-gray-500 bg-opacity-50 z-[100] backdrop-blur-md backdrop-filter" >

            <div className="bg-white absolute  rounded-3xl p-4 pb-10 w-[80vw] mb-10 sm:w-1/2 h-[90vh] 3xl:h-fit ">
                <div className="bg-white  rounded-lg p-4 w-screen sm:w-full relative">
                    <button className="rounded-full absolute text-3xl top-[.5rem] right-[.5rem]  bg-red-600 p-2 w-10 h-10 flex justify-center items-center " onClick={() => setShowEditForm(!showEditForm)}>
                        <svg width="35" height="35" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#fff" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z" />
                        </svg>
                    </button>

                    <h2 className="mb-4 text-3xl">Edit Form</h2>
                    <div >
                        {!users ?
                            <div className='flex h-[70vh] 3xl:h-auto  flex-col   px-4 overflow-y-scroll custom-scrollbar' >
                                <div className='flex gap-2 md:flex-row flex-col '>
                                    <TextInput
                                        label="Name"
                                        type="text"
                                        name="name"
                                        border='border-[1px] border-gray-800'
                                        placeholder="Name"
                                        value={values.name}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={errors.name && touched.name ? 1 : undefined}
                                        errormessage={errors.name}
                                    />
                                    <TextInput
                                        label="Email"
                                        type="email"
                                        name="email"
                                        border='border-[1px] border-gray-800'
                                        placeholder="Email"
                                        value={values.email}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={errors.email && touched.email ? 1 : undefined}
                                        errormessage={errors.email}
                                    />
                                </div>
                                <div className='flex gap-2 md:flex-row flex-col '>
                                    {/* <TextInput
                                        label="City"
                                        type="text"
                                        name="city"
                                        border='border-[1px] border-gray-800'
                                        placeholder="City"
                                        value={values.city}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={errors.city && touched.city ? 1 : undefined}
                                        errormessage={errors.city}
                                    /> */}
                                    <div className='flex flex-col flex-1'>
                                        <label className='text-gray-900 text-lg mb-1'>City<span className='text-red-500 text-lg font-semibold'>*</span></label>
                                        {/* <CityDropdown options={optionList} selectedOption={values.city} onChange={handleChange} onBlur = {handleBlur}/> */}
                                        <Select
                                            options={optionList}
                                            name='city'
                                            placeholder={"Select City"}
                                            value={values.city ? optionList.find(option => option.value === values.city) : ''}
                                            onChange={handleSelectChange}
                                            onBlur={handleBlur}
                                            isSearchable={true}
                                            styles={{
                                                control: (provided, state) => ({
                                                    ...provided,
                                                    border: '1px solid black',
                                                    height: '120%'

                                                }),
                                                option: (provided, state) => ({
                                                    ...provided,
                                                    padding: '2px', // Adjust padding as needed
                                                    paddingLeft: '10px',
                                                    background: state.isSelected ? 'gray' : 'white', // Change background color when selected
                                                    color: state.isSelected ? 'white' : 'black',
                                                    ':hover': {
                                                        background: 'gray', // Change background color on hover
                                                        cursor: 'pointer', // Change cursor on hover
                                                        color: 'white'
                                                    }

                                                })

                                            }}
                                        />
                                        {showErrors && errors.city && touched.city && (
                                            <div className="text-red-500 text-sm">{errors.city}</div>
                                        )}
                                    </div>
                                    <TextInput
                                        label="Phone Number"
                                        type="text"
                                        name="phone_no"
                                        border='border-[1px] border-gray-800'
                                        placeholder="Phone Number"
                                        value={values.phone_no}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={errors.phone_no && touched.phone_no ? 1 : undefined}
                                        errormessage={errors.phone_no}
                                    />
                                </div>
                                <div className='flex gap-2 md:flex-row flex-col '>

                                    <div className='flex flex-col items-start gap-2 flex-1 w-full '>

                                        <label className='text-lg '>Gender</label>
                                        <select
                                            className={`border-[1px] border-black  w-full px-2 py-2 text-black first-letter outline-none rounded-md mb-2 ${errors.gender && touched.gender ? 'border-red-500' : ''
                                                }`}
                                            name="gender"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.gender}
                                        >
                                            <option value="">Select one...</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Others">Others</option>
                                        </select>
                                        {errors.gender && touched.gender && (
                                            <div className="text-red-500 text-sm">{errors.gender}</div>
                                        )}
                                    </div>

                                    <div className='flex flex-col items-start gap-2 flex-1 w-full '>

                                        <label className='text-lg'>Applied For</label>
                                        <select
                                            className={`border-[1px] border-black w-full px-2 py-2 text-black rounded-md ${errors.applied_for && touched.applied_for ? 'border-red-500' : ''
                                                }`}
                                            name="applied_for"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.applied_for}
                                        >
                                            <option value="">Select one...</option>
                                            {types.map((type) => (
                                                <option value={type.value}>{type.value}</option>
                                            ))}
                                        </select>
                                        {errors.applied_for && touched.applied_for && (
                                            <div className="text-red-500 text-sm">{errors.applied_for}</div>
                                        )}
                                    </div>
                                </div>

                                <div className='flex gap-2 md:flex-row flex-col '>

                                    <TextInput
                                        label="CNIC"
                                        type="text"
                                        name="cnic"
                                        border='border-[1px] border-gray-800'
                                        placeholder="CNIC"
                                        value={values.cnic}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={errors.cnic && touched.cnic ? 1 : undefined}
                                        errormessage={errors.cnic}
                                    />
                                    <div className='flex flex-col items-start gap-1 flex-1 w-full '>

                                        <label className='text-lg '>Type</label>
                                        <select
                                            className={`border-[1px] border-black w-full px-2 py-2 text-black rounded-md ${errors.type && touched.type ? 'border-red-500' : ''
                                                }`}
                                            name="type"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.type}
                                        >
                                            <option value="">Select one...</option>
                                            {employeeTypes.map((type) => (
                                                <option value={type.value}>{type.value}</option>
                                            ))}
                                        </select>
                                        {errors.type && touched.type && (
                                            <div className="text-red-500 text-sm">{errors.type}</div>
                                        )}
                                    </div>
                                </div>

                                <label className='text-lg mb-2'>Status</label>
                                <div className='flex gap-2 '>
                                    <input
                                        className="w-4"
                                        type="radio"
                                        name="status"
                                        id="hired"
                                        value="Hired"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        checked={values.status === 'Hired'}
                                    />
                                    <label htmlFor="hired">Hired</label>
                                </div>
                                <div className='flex gap-2 mt-1'>
                                    <input
                                        className="w-4"
                                        type="radio"
                                        name="status"
                                        id="rejected"
                                        value="Rejected"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        checked={values.status === 'Rejected'}
                                    />
                                    <label htmlFor="rejected">Rejected</label>
                                </div>
                                {errors.status && touched.status && (
                                    <div className="text-red-500 text-sm">{errors.status}</div>
                                )}

                                <div className='flex flex-col items-start gap-2 flex-1 w-full'>

                                    <label className='text-lg mt-2'>Applied Date<span className='text-red-500 text-lg font-semibold'>*</span></label>
                                    <div className='flex'>
                                        <input
                                            type="text"
                                            name=""
                                            datepicker
                                            id=""
                                            value={values.applied_date ? new Date(values.applied_date).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            }) : 'Select Date...'}
                                            readOnly={true}

                                            className={`border border-r-0  border-black px-2 py-1 text-black w-76 outline-none rounded-md rounded-r-none mb-1`}

                                        />
                                        <input
                                            type="date"
                                            name="applied_date"
                                            id="applied_date"
                                            value={''}

                                            onChange={handleChange}
                                            onBlur={handleBlur}

                                            error={showErrors && errors.applied_date && touched.applied_date}
                                            className={`border-[1px] border-l-0 border-black px-2 py-1 text-black w-[2.3rem] outline-none rounded-md  rounded-l-none mb-1`}

                                        />
                                    </div>
                                    {showErrors && errors.applied_date && touched.applied_date && (
                                        <div className="text-red-500 text-sm">{errors.applied_date}</div>
                                    )}
                                </div>

                                <Templetes remarks={remarks} setRemarks={setRemarks} />

                                <div className='mt-4 flex flex-col'>
                                    <label htmlFor="remarks" className='text-lg mb-2'>Remarks/Comments</label>
                                    <textarea
                                        className={`border-[1px] border-gray-700 h-16 w-full p-1 resize-none rounded-md outline-none ${errors.remarks && touched.remarks ? 'border-red-500' : ''
                                            }`}
                                        name="remarks"
                                        id="remarks"
                                        cols="30"
                                        rows="10"
                                        onBlur={handleBlur}
                                        onChange={handleChangeRemarks}
                                        value={remarks}
                                    ></textarea>
                                    {errors.remarks && touched.remarks && (
                                        <div className="text-red-500 text-sm">{errors.remarks}</div>
                                    )}
                                </div>
                                <div className="flex justify-center">

                                    <input className='bg-[#26b0ff] disabled:bg-gray-500 disabled:cursor-not-allowed text-white p-2 w-1/3 self-end rounded-full my-3 hover:bg-blue-400' type="submit" disabled={values.name == '' > 0 ? true : false} value="Edit" onClick={handleEditEntry} />
                                </div>
                            </div>
                            :
                            // Users Edit form
                            <div className='flex flex-col text-black  h-[75vh] px-4 overflow-y-scroll custom-scrollbar' >
                                <TextInput
                                    label="Name"
                                    isImportant
                                    type="text"
                                    name="name"
                                    border='border-[1px] border-gray-800'
                                    placeholder="Name"
                                    value={values.name}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    error={showErrors && errors.name && touched.name }
                                    errormessage={errors.name}
                                />

                                <TextInput
                                    isImportant
                                    label="Email"
                                    type="text"
                                    name="email"
                                    border='border-[1px] border-gray-800'
                                    placeholder="Email"
                                    value={values.email}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    error={showErrors && errors.email && touched.email }
                                    errormessage={errors.email}
                                />

                                <label className='text-lg mb-2'>Role<span className='text-red-500 text-lg font-semibold'>*</span></label>
                                <select
                                    className={`border-[1px] px-2 border-gray-500 w-40 py-2 rounded-md mb-2 ${errors.gender && touched.gender ? 'border-red-500' : ''
                                        }`}
                                    name="role"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.role}
                                >
                                    <option value="">Select one...</option>
                                    <option value="HR">HR</option>
                                    <option value="employee">employee</option>
                                </select>
                                {showErrors && errors.role && touched.role && (
                                    <div className="text-red-500 text-sm">{errors.role}</div>
                                )}

                                <TextInput
                                    label="Password"
                                    type="password"
                                    name="password"
                                    border='border-[1px] border-gray-800'
                                    placeholder="Password"
                                    value={values.password}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    error={showErrors && errors.password && touched.password }
                                    errormessage={errors.password}
                                />
                                <TextInput
                                    label="Confirm Password"
                                    type="password"
                                    name="confirmPassword"
                                    border='border-[1px] border-gray-800'
                                    placeholder="Confirm Password"
                                    value={values.confirmPassword}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    error={showErrors && errors.confirmPassword && touched.confirmPassword }
                                    errormessage={errors.confirmPassword}
                                />
                                <div className="flex justify-center">

                                    <input className='bg-[#26b0ff] disabled:bg-gray-500 disabled:cursor-not-allowed text-white p-2 w-1/3 self-end rounded-full my-3 hover:bg-blue-400' type="submit" disabled={values.name == '' > 0 ? true : false} value="Submit" onClick={handleEditEntry} />
                                </div>
                            </div>
                        }
                        {
                            
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditEntryForm