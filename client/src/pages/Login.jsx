import React, { useState } from 'react'
import TextInput from '../components/TextInput';
import loginSchema from '../schemas/loginSchema';
import fullLogo from '../../src/assets/candi-trak-1.svg'
import { useFormik } from 'formik';
import { getAvatar, login } from '../api/internal';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../store/userSlice'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'
import Loader from '../components/Loader';

const Login = ({ setAlert }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);




  const { values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema: loginSchema
  })


  const handleLogin = async () => {
    setLoading(true)
    const data = {
      username: values.username.toLowerCase(),
      password: values.password,
    }
    const response = await login(data);
    // if (response.code === 'ERR_BAD_REQUEST') 
    if (response.status === 200) {
      let avatarImage = '';
      const avatar = await getAvatar(response.data.user._id)
      if (avatar.data.result != null) {

        avatarImage = avatar.data.result.image;
      }
      const user = {
        _id: response.data.user._id,
        email: response.data.user.email,
        username: response.data.user.username,
        role: response.data.user.role,
        name: response.data.user.name,
        auth: response.data.auth,
        avatar: avatarImage,
        createdAt: response.data.user.createdAt
      }
      dispatch(setUser(user));

      setAlert({ message: 'Login successful', type: 'success' });
      if (user.role == 'HR') {
        navigate('/')

      }
      else if (user.role == 'Data Entry') {
        navigate('/records')

      }
      else {
        navigate('/')
      }

    }
    else {
      setAlert({ message: 'Login failed, Double check you Credentials', type: 'errro' });
    }
    setShowErrors(true)
    setLoading(false)


  };
  return (
    <>


      <div className="flex w-screen bg-image h-screen justify-center items-center">
        <div className="sm:w-1/3 w-11/12 h-100 bg-gray-200 shadow-md text p-5 rounded-lg backdrop-blur-md  bg-opacity-40 " style={{ boxShadow: "#00000069 2px 2px 20px 9px" }} >
          {!loading ?
            <>
              <img src={fullLogo} alt="Candi Track" />
              <h1 className='mb-5 text-3xl  w-full font-semibold'>Login</h1>
              <div className='flex flex-col'>
                <TextInput
                  label="Username/Email"
                  type="text"
                  name="username"
                  // placeholder="Username/Email"
                  isImportant={true}
                  value={values.username}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={showErrors && errors.username && touched.username}
                  errormessage={errors.username}
                />
                <TextInput
                  label="Password"
                  type="password"
                  name="password"
                  isImportant={true}
                  // placeholder="****"
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={showErrors && errors.password && touched.password}
                  errormessage={errors.password} />

                <input type="submit" className="p-3 hover:bg-[#1c75bc] duration-500 w-1/2 text-white text-lg self-center rounded-lg  my-3 bg-[#fbb040] transition-all ease-in-out" value="Login" onClick={handleLogin} />
              </div>
            </>
            :
            <Loader isTransparent={true} />
          }
        </div>

      </div>

    </>
  )
}

export default Login        