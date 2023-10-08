import React, { useState, useEffect } from 'react'
import TextInput from './TextInput'
import { useFormik } from 'formik';
import employeeSchema from '../schemas/employeeSchema'
import { appendToEmployee } from '../store/employeeSlice'
import { createEntry, getAppliedFor, getEmployeeTypes } from '../api/internal';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import CityDropdown from './CityDropdown';
import Loader from './Loader';
import Templetes from '../components/Templetes'


const AddEntryForm = ({ setAlert, setIsAddClicked, isAddClicked, setEmployeeData, dataEntry = false }) => {

    const [showErrors, setShowErrors] = useState(false);
    const [remarks, setRemarks] = useState('');
    const applied_fors = useSelector((state) => state.applied_for);
    const employee_types = useSelector((state) => state.employee_type);

    const [types, setTypes] = useState([])
    const [employeeTypes, setEmployeeTypes] = useState([])
    const dispatch = useDispatch();
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

    
    const handleSelectChange = (selected) => {
        handleChange('city')(selected.value); // Pass the selected value to handleChange for 'city'
    };
    useEffect(() => {
        const fetch = async () => {
            // try {

            var all_types = applied_fors
            var all_employee_types = employee_types;
            // const sortedTypes = all_types.sort((a, b) => a.value.localeCompare(b.value));

            // console.log(sortedTypes)
            // const sortedEmployeeTypes = all_employee_types.sort((a, b) => a.value.localeCompare(b.value));
            setTypes(all_types)
            setEmployeeTypes(all_employee_types);
            // }
            // catch (err) {
            //     console.error('Error fetching data:', err);
            // }
        }
        fetch()
    }, [])
    const { values, touched, handleBlur, handleChange, errors, resetForm } = useFormik({
        initialValues: {
            applied_for: '',
            name: '',
            email: '',
            gender: '',
            phone_no: '',
            cnic: '',
            type: '',
            status: '',
            remarks: '',
            city: '',
            applied_date: '',
        },
        validationSchema: employeeSchema
    });
    const handleAddEntry = async (addMore = false) => {
        setShowErrors(true)
        if (Object.keys(errors).length > 0) {
            console.log(errors)
            setAlert({ message: "Please fill Required fields", type: "error" })
            return
        }


        setAlert({ message: <Loader isTransparent />, type: "loading" })
        //get values from form
        const remarks = values.remarks;
        if (remarks === '') {
            values.remarks = 'No remarks'
        }
        // send them to the function
        values.cnic = parseInt(values.cnic.replace(/-/g, '').slice(0, 13));
        values.phone_no = parseInt(values.phone_no.replace(/-/g, '').slice(0, 11));


        const response = await createEntry(values)
        console.log("Data is here: ")
        console.log(response)
        if (response?.status === 200) {
            dispatch(appendToEmployee(response.data.employee))
            setAlert({ message: "Added successfully", type: "success" })
            if (!addMore) {
                setIsAddClicked(!isAddClicked)
            }
            else {
                resetForm()
                setRemarks('')
            }
            setEmployeeData(prev => [...prev, response.data.employee])  

            if (dataEntry) {

                Navigate('/records')
            }
        }
        else {

            setAlert({ message: "Failed to add user, Make sure Email, Phone Number, CNIC are unique ", type: "error" })
        }
        // function will add it to the database
        // if return 200 then okay otherwise show error


    }
    useEffect(() => {
        values.remarks = remarks
        console.log(values.remarks)
    }, [remarks])

    const handleChangeRemarks = (e) => {
        setRemarks(e.target.value)
    }
    return (
        <div className="fixed inset-0 pt-10 overflow-y-scroll  flex justify-center h-screen  bg-gray-500 bg-opacity-50 z-[100]" >

            <div className="bg-white absolute  rounded-3xl p-4 pb-10 w-[80vw] mb-10 sm:w-1/2 h-[90vh] 3xl:h-fit ">

                <button className="rounded-full  absolute text-3xl top-[.5rem] right-[.5rem]  bg-red-600 p-2 w-10 h-10 flex justify-center items-center " onClick={() => setIsAddClicked(!isAddClicked)}>
                    <svg width="35" height="35" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#fff" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z" />
                    </svg>
                </button>

                <h2 className="mb-4 text-3xl">Add Entry</h2>
                <div>
                    <div className='flex h-[70vh] 3xl:h-auto  flex-col   px-4 overflow-y-scroll custom-scrollbar' >
                        <div className='flex gap-2 md:flex-row flex-col '>

                            <TextInput
                                label="Name"
                                isImportant
                                placeholder="Name"
                                autoFocus
                                type="text"
                                name="name"
                                border='border-[1px] border-gray-800 '
                                value={values.name}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={showErrors && errors.name && touched.name}
                                errormessage={errors.name}
                            />
                            <TextInput
                                label="Email"
                                isImportant
                                placeholder="abc@example.com"
                                type="text"
                                name="email"
                                border='border-[1px] border-gray-800'
                                value={values.email}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={showErrors && errors.email && touched.email}
                                errormessage={errors.email}
                            />
                        </div>
                        <div className='flex gap-2 md:flex-row flex-col '>

                            {/* <CityDropdown
                                label="City"
                                isImportant
                                cities={["bwp", "sama"]}
                                type="text"
                                name="city"
                                border='border-[1px] border-gray-800'

                                value={values.city}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={showErrors && errors.city && touched.city}
                                errormessage={errors.city}
                            /> */}

                            <div className='flex flex-col flex-1'>
                                <label className='text-gray-900 text-lg 3xl:text-2xl mb-1'>City<span className='text-red-500 text-lg font-semibold'>*</span></label>
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
                                            height: '120%',
                                            borderRadius: '7px',
                                            fontSize: '19px',
                                            ":focus": {
                                                border: 'none'
                                            }

                                        }),
                                        select: (provided, state) => ({
                                            ...provided,
                                            outline: 'none',
                                        }),
                                        option: (provided, state) => ({
                                            ...provided,
                                            padding: '2px', // Adjust padding as needed
                                            paddingLeft: '10px',
                                            marginTop: '2px',
                                            background: state.isSelected ? 'gray' : 'white', // Change background color when selected
                                            color: state.isSelected ? 'white' : 'black',
                                            ':hover': {
                                                background: 'gray', // Change background color on hover
                                                cursor: 'pointer', // Change cursor on hover
                                                color: 'white'
                                            },

                                        })

                                    }}
                                />
                                {showErrors && errors.city && touched.city && (
                                    <div className="text-red-500 text-sm">{errors.city}</div>
                                )}
                            </div>
                            <TextInput
                                label="Phone Number"
                                isImportant
                                type="text"
                                placeholder="xxxx-xxxxxxx"

                                name="phone_no"
                                border='border-[1px] border-gray-800'
                                value={values.phone_no}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={showErrors && errors.phone_no && touched.phone_no}
                                errormessage={errors.phone_no}
                            />
                        </div>
                        <div className='flex gap-2 md:flex-row flex-col '>


                            <div className='flex flex-col items-start gap-2 flex-1 w-full '>


                                <label className='text-lg 3xl:text-2xl'>Gender<span className='text-red-500 text-lg font-semibold'>*</span></label>
                                <select
                                    className={`border-[1px] px-2 py-[.65rem] border-gray-500 w-full 3xl:text-2xl rounded-md mb-2 ${showErrors && errors.gender && touched.gender ? 'border-red-500' : ''
                                        }`}
                                    name="gender"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.gender}
                                >
                                    <option value="" className='py-3'>Select one...</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Others">Others</option>
                                </select>
                                {showErrors && errors.gender && touched.gender && (
                                    <div className="text-red-500 text-sm">{errors.gender}</div>
                                )}
                            </div>
                            <div className='flex flex-col items-start gap-2 flex-1 w-full '>

                                <label className='text-lg 3xl:text-2xl'>Applied For<span className='text-red-500 text-lg font-semibold'>*</span></label>
                                <select
                                    className={`border-[1px] border-gray-500 px-2 py-[.65rem] w-full 3xl:text-2xl rounded-md ${showErrors && errors.applied_for && touched.applied_for ? 'border-red-500' : ''
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
                                {showErrors && errors.applied_for && touched.applied_for && (
                                    <div className="text-red-500 text-sm">{errors.applied_for}</div>
                                )}
                            </div>

                        </div>
                        <div className='flex gap-2 md:flex-row flex-col '>
                            <TextInput
                                label="CNIC"
                                isImportant
                                type="text"
                                name="cnic"
                                border='border-[1px] border-gray-800'
                                placeholder="xxxxx-xxxxxxx-x"
                                value={values.cnic}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={showErrors && errors.cnic && touched.cnic}
                                errormessage={errors.cnic}
                            />
                            <div className='flex flex-col items-start gap-1 flex-1 w-full '>


                                <label className='text-lg mb-0 3xl:text-2xl'>Type<span className='text-red-500 text-lg font-semibold'>*</span></label>
                                <select
                                    className={`border-[1px] px-2 py-[.65rem] border-gray-500 w-full 3xl:text-2xl rounded-md ${showErrors && errors.type && touched.type ? 'border-red-500' : ''
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
                                {showErrors && errors.type && touched.type && (
                                    <div className="text-red-500 text-sm">{errors.type}</div>
                                )}
                            </div>
                        </div>
                        <div className='flex gap-2 sm:flex-col flex-row '>
                            <div className="flex flex-col flex-1">

                                <label className='text-lg  3xl:text-2xl mb-1'>Applied Date<span className='text-red-500 text-lg font-semibold'>*</span></label>
                                <div className='flex 3xl:text-2xl '>
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

                                        className={`border border-r-0  border-black px-2 py-2 w-[calc(50%-2.6rem)] text-black w-76 outline-none rounded-md rounded-r-none mb-1`}

                                    />

                                    <input
                                        type="date"
                                        name="applied_date"
                                        id="applied_date"
                                        value={''}

                                        onChange={handleChange}
                                        onBlur={handleBlur}

                                        error={showErrors && errors.applied_date && touched.applied_date}
                                        className={` border-[1px] border-l-0 border-black px-2 py-[0.60rem] text-black w-[2.4rem] select-text 3xl:w-[2.9rem] rounded-md  rounded-l-none mb-1`}
                                    />

                                </div>
                                {showErrors && errors.applied_date && touched.applied_date && (
                                    <div className="text-red-500 text-sm">{errors.applied_date}</div>
                                )}
                            </div>

                            <div className='w-1/2 flex gap-3   flex-col'>

                                <label className='text-lg  3xl:text-2xl'>Status<span className='text-red-500 text-lg font-semibold'>*</span></label>
                                <div className="flex gap-5">

                                    <div className='flex  gap-2 3xl:text-2xl'>
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
                                    <div className='flex gap-2 mt-1 3xl:text-2xl'>
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
                                </div>
                                {showErrors && errors.status && touched.status && (
                                    <div className="text-red-500 text-sm">{errors.status}</div>
                                )}
                            </div>
                        </div>
                        
                        <Templetes remarks = {remarks} setRemarks = {setRemarks}/>

                        <div className='mt-4 flex flex-col gap-2' >
                            <label htmlFor="remarks" className='text-lg 3xl:text-2xl '>Remarks/Comments</label>
                            <textarea
                                className={`border-[1px] 3xl:text-2xl border-gray-700 3xl:h-36 sm:h-24 w-full p-1 resize-none rounded-md outline-none ${errors.remarks && touched.remarks ? 'border-red-500' : ''
                                    }`}
                                name="remarks"
                                id="remarks"
                                cols="30"
                                rows="10"
                                onBlur={handleBlur}
                                onChange={handleChangeRemarks}
                                value={remarks}
                            ></textarea>
                            {showErrors && errors.remarks && touched.remarks && (
                                <div className="text-red-500 text-sm">{errors.remarks}</div>
                            )}
                        </div>

                        <div className='flex justify-center gap-3 text-lg 3xl:text-2xl'>

                            <input className='bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed text-white p-2 sm:w-1/3 flex-1 3xl:flex-none 3xl:w-1/3 self-end rounded-full hover:shadow-md shadow-black my-3 hover:bg-blue-400 transition-all' type="submit" disabled={values.name == '' > 0 ? true : false} value="Submit" onClick={() => handleAddEntry(false)} />
                            <input className='bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed text-white p-2 flex-1 sm:w-1/3 self-end 3xl:flex-none 3xl:w-1/3 rounded-full my-3 hover:bg-blue-400' type="submit" disabled={values.name == '' > 0 ? true : false} value="Submit & Add More" onClick={() => handleAddEntry(true)} />
                        </div>
                    </div>
                </div>
            </div>

        </div>

    )
}

export default AddEntryForm