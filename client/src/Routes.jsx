import React, { useState } from 'react';
import Login from './pages/Login';
import Alert from './components/Alert';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Protected from '../Protected/Protected';
import useAutoLogin from "./hooks/useAutoLogin";
import Loader from "./components/Loader";
import { useSelector } from 'react-redux/es/hooks/useSelector';
import Dashboard from './dashboard/Dashboard'



const Routers = () => {
  const isAuth = useSelector((state) => state.user.auth);
  const [alert, setAlert] = useState(null);
  const hideAlert = () => {
    setAlert(null);
  };
  
  
  // { console.log(isAuth) }
  
  const loading = useAutoLogin();

  return loading ? (
    <Loader />
  ) : (
    <>
      {alert && <Alert message={alert.message} type={alert.type} onHide={hideAlert} />}
      <Router>
        <Routes>

        {/* {console.log(isAuth)} */}
          {!isAuth && <Route
            path="/login"
            element={<Login setAlert={setAlert}
            />}/> 
            }

          <Route
            path="*"
            element={
              <Protected isAuth={isAuth}>
                {loading ? <Loader /> :
                  <Dashboard setAlert={setAlert} />}
              </Protected>
            }
          />



        </Routes>
      </Router>
    </>
  );
};

export default Routers;
