import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux/es/hooks/useSelector'
import reactLogo from '../../public/Candi Track-02.svg'
import textSvg from '../../public/Candi Track-01.svg'
import { NavLink } from 'react-router-dom'
import TextInput from './TextInput'
import userEdit from '../schemas/userEdit'
import { useFormik } from 'formik'
import { uploadImage, EditUser } from '../api/internal'
import { setAllUser, resetAllUser } from '../store/allUserSlice'
import { resetUser, updateNameAndAvatar } from '../store/userSlice'
import Loader from './Loader'
import { useDispatch } from 'react-redux'



const Navbar = ({ setAlert }) => {
  const name = useSelector((state) => state.user.name)
  const role = useSelector((state) => state.user.role)
  const [profileClick, setProfileClick] = useState(false);
  const [profileClick2, setProfileClick2] = useState(false);
  const user = useSelector((state) => state.user)
  const [showErrors, setShowErrors] = useState(false)

  const dispatch = useDispatch()

  const payload = {
    initialValues: {
      email: user.email || '',
      name: user.name || '',
      role: user.role || '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: userEdit,
    enableReinitialize: true
  }
  const { values, touched, handleBlur, handleChange, errors, resetForm } = useFormik(payload);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);

  };

  const handleEditEntry = async () => {
    setAlert({ message: <Loader flex={true} isTransparent={true} />, type: "loading" })
    let base64Image = '';

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        base64Image = e.target.result;
        try {
          // Send the image data to the server
          const response = await uploadImage(base64Image)
          // Handle the server response (e.g., display success message)
          if (response.status == 200) {
          }
          else {
            console.log('error in uploading')
          }

        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
      reader.readAsDataURL(selectedFile);
    }

    // Old code for edit
    setShowErrors(true)
    if (Object.keys(errors).length > 0) {
      console.log(Object.keys(errors).length)
      console.log(errors)
      setAlert({ message: "Please fill Required fields", type: "error" })
      return
    }

    // send them to the function
    let response;


    response = await EditUser(values, user._id, user._id)

    if (response?.data.modifiedCount >= 1) {

      const newData = {
        avatar: base64Image == '' ? user.avatar : base64Image,
        newName: values.name,
        email: values.email
      }

      console.log(newData)
      dispatch(updateNameAndAvatar(newData))

      resetForm()
      setProfileClick(false)

      setAlert({ message: "Updated successfully", type: "success" })
    }
    else {
      setAlert({ message: "Failed to add user, Make sure Email, Phone Number, CNIC are unique ", type: "error" })
    }


    setShowErrors(true)
  }

  return (
    <>
      <nav className='flex justify-between p-1 bg-gray-500  px-6 border-none  text-white fixed w-screen z-50' style={{ background: "#26738d" }}>
        <NavLink to={`${role == 'HR' ? '/records' : '/'}`} className='flex items-center gap-4'>
          <img className='w-14 ' src={reactLogo} alt="SE Employees Bank" />
          <img className='w-80 absolute -top-3 -left-7 hidden sm:block' src={textSvg} alt="Candi Track" />
          {/* <h1 className='text-xl font-semibold text-[#f3f3f3] hidden sm:block'>Employees Bank</h1> */}
        </NavLink>
        <div className='flex items-center gap-3 px-2 py-0 cursor-pointer    text-white transition-all rounded-lg' onClick={() => setProfileClick(!profileClick)}>

          <img className='w-8 rounded-full h-8 border-2 border-gray-200' src={user.avatar || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDQ4IDQ4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxtYXNrIGlkPSJpcFNBdmF0YXIwIj48cGF0aCBmaWxsPSIjZmZmIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iNCIgZD0iTTUuMDA0IDQyLjIzMWEuNzguNzggMCAwIDAgLjc5MS43NjloMzYuNDA3YS43OC43OCAwIDAgMCAuNzkyLS43Njl2LS45MThjLjAxOC0uMjc3LjA1NS0xLjY1Ny0uODU1LTMuMTg0Yy0uNTc0LS45NjMtMS40MDctMS43OTQtMi40NzYtMi40NzJjLTEuMjkzLS44Mi0yLjkzOC0xLjQxMy00LjkyOC0xLjc3YTI5LjIzNiAyOS4yMzYgMCAwIDEtMy4wMDItLjU4NGMtMi42MzItLjY3Mi0yLjg2Mi0xLjI2Ny0yLjg2NC0xLjI3M2EuNzYzLjc2MyAwIDAgMC0uMDY2LS4xNjljLS4wMjItLjExLS4wNzUtLjUyOC4wMjctMS42NDdjLjI1OC0yLjg0MyAxLjc4My00LjUyMyAzLjAwOC01Ljg3M2MuMzg2LS40MjUuNzUxLS44MjggMS4wMzItMS4yMjJjMS4yMTMtMS43IDEuMzI1LTMuNjM1IDEuMzMtMy43NTVhMiAyIDAgMCAwLS4wODctLjYyOGMtLjEyLS4zNy0uMzQzLS42LS41MDctLjc3YTIuODc0IDIuODc0IDAgMCAxLS4xMTMtLjEyYy0uMDEyLS4wMTQtLjA0NC0uMDUyLS4wMTUtLjI0M2ExOS4wMSAxOS4wMSAwIDAgMCAuMjAzLTEuODU3Yy4wNTYtMS4wMDIuMDk5LTIuNS0uMTYtMy45NTlhNi4wMzEgNi4wMzEgMCAwIDAtLjE3Mi0uODI1Yy0uMjczLTEuMDA0LS43MTEtMS44NjItMS4zMi0yLjU3Yy0uMTA1LS4xMTUtMi42NTMtMi44LTEwLjA1LTMuMzVjLTEuMDIzLS4wNzYtMi4wMzQtLjAzNS0zLjAzLjAxNmE0LjM5IDQuMzkgMCAwIDAtLjg3NS4xMDhjLS43NjQuMTk3LS45NjguNjgxLTEuMDIxLjk1MmMtLjA4OS40NS4wNjcuNzk4LjE3IDEuMDNjLjAxNS4wMzMuMDM0LjA3NC4wMDEuMTgyYy0uMTcxLjI2Ni0uNDQyLjUwNi0uNzE3LjczM2MtLjA4LjA2Ny0xLjkzNCAxLjY2Ny0yLjAzNiAzLjc1NmMtLjI3NSAxLjU4OS0uMjU1IDQuMDY0LjA3IDUuNzc1Yy4wMi4wOTUuMDQ3LjIzNS4wMDIuMzNjLS4zNS4zMTMtLjc0Ni42NjgtLjc0NSAxLjQ3OGMuMDA0LjA4Mi4xMTcgMi4wMTYgMS4zMyAzLjcxN2MuMjguMzk0LjY0NS43OTYgMS4wMyAxLjIyMWwuMDAyLjAwMWMxLjIyNSAxLjM1IDIuNzUgMy4wMyAzLjAwOCA1Ljg3MmMuMTAxIDEuMTIuMDQ4IDEuNTM3LjAyNyAxLjY0OGEuNzU4Ljc1OCAwIDAgMC0uMDY3LjE2OWMtLjAwMS4wMDYtLjIzLjU5OS0yLjg1IDEuMjdjLTEuNTEyLjM4Ny0zIC41ODUtMy4wNDUuNTljLTEuOTM0LjMyNy0zLjU2OS45MDYtNC44NiAxLjcyMWMtMS4wNjUuNjczLTEuOSAxLjUwNy0yLjQ4IDIuNDc3Yy0uOTI4IDEuNTUtLjkwMyAyLjk2Mi0uODkgMy4yMnYuOTIzWiIvPjwvbWFzaz48cGF0aCBmaWxsPSIjZDFkMWQxIiBkPSJNMCAwaDQ4djQ4SDB6IiBtYXNrPSJ1cmwoI2lwU0F2YXRhcjApIi8+PC9zdmc+"} alt="" />
          <h1 className='text-xl  flex justify-between'> 
            <span className='capitalize select-none'>{name}</span>
            <span className={`${profileClick ? "-rotate-90" : "rotate-90"} transition-all origin-center w-[24px] h-[24px] m-1` }>
            <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M19 12L31 24L19 36" />
            </svg>  
            </span>
          </h1>
        </div>
        {profileClick &&
          <div className='absolute right-7 top-[4.3rem] py-4  bg-white text-black rounded-lg custom-shadow'>
            <ul className='flex flex-col w-36 cursor-pointer'>
              <li className='hover:bg-gray-50 px-4 py-1' onClick={() => { setProfileClick2(true); setProfileClick(false) }}>My Profile</li>
              
              <NavLink title="Logout" to={"/logout"} onClick={() => setProfileClick(false)} className='hover:bg-gray-50 px-4 py-1'  >

                  Logout

                  </NavLink>
            </ul>
          </div>
        }
      </nav>
      {profileClick2 &&
        <>

          <div className="fixed inset-0 pt-10 overflow-y-scroll flex justify-center h-screen bg-gray-500 bg-opacity-50 z-[100]">
            <div className="bg-white absolute rounded-3xl p-4 pb-10 w-[80vw] mb-10 sm:w-1/2 h-[90vh] 3xl:h-fit">
              <button
                className="rounded-full absolute text-3xl top-[.5rem] right-[.5rem] bg-red-600 p-2 w-10 h-10 flex justify-center items-center"
                onClick={() => setProfileClick2(false)}
              >
                <svg width="35" height="35" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#fff" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z" />
                </svg>
              </button>
              <h2 className="mb-4 text-3xl">Profile Settings</h2>
              <div>
                <div className='flex h-[70vh] 3xl:h-auto  flex-col   px-4 overflow-y-scroll custom-scrollbar' >


                  <div className="relative w-32 h-52 rounded-full overflow mx-auto mb-4">
                    <input type="file" id="fileInput" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <label htmlFor="fileInput" className='cursor-pointer'>
                      <div className={`w-32 p-1 h-32 rounded-full  ${user.avatar ? '' : 'bg-gray-400'} border border-gray-400 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition`}>
                        {(user.avatar && <img className=" w-full rounded-full h-full border-2  border-gray-200 sm:" src={user.avatar} alt='profile img' />) ||
                          <svg width="90" height="90" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <mask id="ipSAvatar0">
                              <path fill="#a5a5a5" stroke="#a5a5a5" stroke-linejoin="round" stroke-width="3" d="M5.004 42.231a.78.78 0 0 0 .791.769h36.407a.78.78 0 0 0 .792-.769v-.918c.018-.277.055-1.657-.855-3.184c-.574-.963-1.407-1.794-2.476-2.472c-1.293-.82-2.938-1.413-4.928-1.77a29.236 29.236 0 0 1-3.002-.584c-2.632-.672-2.862-1.267-2.864-1.273a.763.763 0 0 0-.066-.169c-.022-.11-.075-.528.027-1.647c.258-2.843 1.783-4.523 3.008-5.873c.386-.425.751-.828 1.032-1.222c1.213-1.7 1.325-3.635 1.33-3.755a2 2 0 0 0-.087-.628c-.12-.37-.343-.6-.507-.77a2.874 2.874 0 0 1-.113-.12c-.012-.014-.044-.052-.015-.243a19.01 19.01 0 0 0 .203-1.857c.056-1.002.099-2.5-.16-3.959a6.031 6.031 0 0 0-.172-.825c-.273-1.004-.711-1.862-1.32-2.57c-.105-.115-2.653-2.8-10.05-3.35c-1.023-.076-2.034-.035-3.03.016a4.39 4.39 0 0 0-.875.108c-.764.197-.968.681-1.021.952c-.089.45.067.798.17 1.03c.015.033.034.074.001.182c-.171.266-.442.506-.717.733c-.08.067-1.934 1.667-2.036 3.756c-.275 1.589-.255 4.064.07 5.775c.02.095.047.235.002.33c-.35.313-.746.668-.745 1.478c.004.082.117 2.016 1.33 3.717c.28.394.645.796 1.03 1.221l.002.001c1.225 1.35 2.75 3.03 3.008 5.872c.101 1.12.048 1.537.027 1.648a.758.758 0 0 0-.067.169c-.001.006-.23.599-2.85 1.27c-1.512.387-3 .585-3.045.59c-1.934.327-3.569.906-4.86 1.721c-1.065.673-1.9 1.507-2.48 2.477c-.928 1.55-.903 2.962-.89 3.22v.923Z" />
                            </mask>
                            <path fill="#000" d="M0 0h48v48H0z" mask="url(#ipSAvatar0)" />
                          </svg>}
                      </div>
                    </label>
                    <h1 className='text-center mt-3'>Click to Upload</h1>
                  </div>

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
                    error={showErrors && errors.name && touched.name}
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
                    error={showErrors && errors.email && touched.email}
                    errormessage={errors.email}
                  />



                  <TextInput
                    label="Password"
                    type="password"
                    name="password"
                    border='border-[1px] border-gray-800'
                    placeholder="Password"
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={showErrors && errors.password && touched.password}
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
                    error={showErrors && errors.confirmPassword && touched.confirmPassword}
                    errormessage={errors.confirmPassword}
                  />
                  <div className="flex justify-center">

                    <input className='bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed text-white p-2 w-1/3 self-end rounded-full my-3 hover:bg-blue-400 outline-none border-none' type="submit" disabled={values.name == '' > 0 ? true : false} value="Submit" onClick={handleEditEntry} />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </>
      }
    </>
  )
}

export default Navbar