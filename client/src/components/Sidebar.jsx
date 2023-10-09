import React, { useState } from 'react'
import Setting from '../components/Setting'
import { NavLink } from 'react-router-dom'
import AddEntryForm from '../components/AddEntryForm'
import { useSelector } from 'react-redux/es/hooks/useSelector'

const Sidebar = ({ side, setSide, display, setDisplay, setAlert }) => {
  const [clickSetting, setClickSetting] = useState(false)
  const [clickedDataEntry, setClickedDataEntry] = useState(false)
  const role = useSelector((state) => state.user.role)

  return (
    <>
      {display && 
      
        <aside className={`${side ? "" : "w-[13rem]"} flex flex-col gap-1 p-3 pr-0 pt-16 transition-all z-10 3xl:text-2xl 3xl:pr-3 bg-[#3093b4] text-xl sm:h-[100vh] text-[#fff] fixed h-[100vh]`}>
        {(role == 'admin' || role == 'HR') && 
          <NavLink title="dashboard" to={"/"} className="flex items-center gap-3 w-full p-2 mt-5 hover:text-[#f3f3f3] transition-all font-semibold">
          <svg width={`${side ? "35" : "25"}`} height={`${side ? "35" : "25"}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="#fff" d="M13 9V3h8v6h-8ZM3 13V3h8v10H3Zm10 8V11h8v10h-8ZM3 21v-6h8v6H3Z" />
          </svg>
            <span className={`${side ? "hidden absolute" : "block"} flex justify-between items-end w-full`}>
              <p>

            Dashboard
              </p>
              <p>
                  <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M19 12L31 24L19 36" />
                  </svg>
              </p>
          </span>
        </NavLink>}
        {role == 'admin' && <NavLink title="Users" to={"/users"} className="flex items-center gap-3 p-2 hover:text-[#f3f3f3] transition-all font-semibold">
          <svg width={`${side ? "35" : "25"}`} height={`${side ? "35" : "25"}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="#fff" d="M25 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.39 3.39 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.39 3.39 0 0 0 15 11a3.5 3.5 0 0 0 0-7Z" />
          </svg>
            <span className={`${side ? "hidden absolute" : "block"} flex justify-between items-end w-full`}>
              <p>

                Users
              </p>
              <p>
                <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M19 12L31 24L19 36" />
                </svg>
              </p>
            </span>
        </NavLink>}

        <NavLink title="Data Entry" onClick={() => setClickedDataEntry(!clickedDataEntry)} className="flex items-center gap-3 p-2 py-1 hover:text-[#f3f3f3] transition-all font-semibold">
          <svg width={`${side ? "35" : "25"}`} height={`${side ? "35" : "25"}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="#fff" d="M15 11h7v2h-7zm1 4h6v2h-6zm-2-8h8v2h-8zM4 19h10v-1c0-2.757-2.243-5-5-5H7c-2.757 0-5 2.243-5 5v1h2zm4-7c1.995 0 3.5-1.505 3.5-3.5S9.995 5 8 5S4.5 6.505 4.5 8.5S6.005 12 8 12z" />
          </svg>
            <span className={`${side ? "hidden absolute" : "block"} flex justify-between items-end w-full`}>
              <p>

                Data Entry
              </p>
              <p>
                <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M19 12L31 24L19 36" />
                </svg>
              </p>
            </span>
        </NavLink>

        {(role == 'admin' || role == 'HR') && <NavLink title="Records" to={"/records"} className="flex items-center gap-3 p-2 hover:text-[#f3f3f3] transition-all font-semibold" >
          <svg width={`${side ? "35" : "25"}`} height={`${side ? "35" : "25"}`} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path fill="#fff" d="M4 9h4v2H4V9z" />
            <path fill="#fff" d="M16 2h-1V0H5v2H3v1.25L2.4 4H1v1.75L0 7v9h12l4-5V2zM2 5h8v2H2V5zm9 10H1V8h10v7zm1-8h-1V4H4V3h8v4zm2-2.5l-1 1.25V2H6V1h8v3.5z" />
          </svg>
            <span className={`${side ? "hidden absolute" : "block"} flex justify-between items-end w-full`}>
              <p>

                Records
              </p>
              <p>
                <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M19 12L31 24L19 36" />
                </svg>
              </p>
            </span>
        </NavLink>}
        
        {role == 'admin' &&
          <div className='justify-end'>
            <NavLink title="Logout" to={"/settings"} className="flex items-center gap-3 p-2 hover:text-[#f3f3f3] transition-all font-semibold">

              <svg width={`${side ? "35" : "25"}`} height={`${side ? "35" : "25"}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="#fff" d="M19.9 12.66a1 1 0 0 1 0-1.32l1.28-1.44a1 1 0 0 0 .12-1.17l-2-3.46a1 1 0 0 0-1.07-.48l-1.88.38a1 1 0 0 1-1.15-.66l-.61-1.83a1 1 0 0 0-.95-.68h-4a1 1 0 0 0-1 .68l-.56 1.83a1 1 0 0 1-1.15.66L5 4.79a1 1 0 0 0-1 .48L2 8.73a1 1 0 0 0 .1 1.17l1.27 1.44a1 1 0 0 1 0 1.32L2.1 14.1a1 1 0 0 0-.1 1.17l2 3.46a1 1 0 0 0 1.07.48l1.88-.38a1 1 0 0 1 1.15.66l.61 1.83a1 1 0 0 0 1 .68h4a1 1 0 0 0 .95-.68l.61-1.83a1 1 0 0 1 1.15-.66l1.88.38a1 1 0 0 0 1.07-.48l2-3.46a1 1 0 0 0-.12-1.17ZM18.41 14l.8.9l-1.28 2.22l-1.18-.24a3 3 0 0 0-3.45 2L12.92 20h-2.56L10 18.86a3 3 0 0 0-3.45-2l-1.18.24l-1.3-2.21l.8-.9a3 3 0 0 0 0-4l-.8-.9l1.28-2.2l1.18.24a3 3 0 0 0 3.45-2L10.36 4h2.56l.38 1.14a3 3 0 0 0 3.45 2l1.18-.24l1.28 2.22l-.8.9a3 3 0 0 0 0 3.98Zm-6.77-6a4 4 0 1 0 4 4a4 4 0 0 0-4-4Zm0 6a2 2 0 1 1 2-2a2 2 0 0 1-2 2Z" />
              </svg>
                <span className={`${side ? "hidden absolute" : "block"} flex justify-between items-end w-full`}>
                  <p>

                    Settings
                  </p>
                  <p>
                    <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                      <path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M19 12L31 24L19 36" />
                    </svg>
                  </p>
                </span>
            </NavLink>
           

          </div>
        }
        
        <button className='absolute bottom-10 font-extrabold -right-3 rounded-full bg-[#151515]  p-2 pb-3 w-8 flex items-center justify-center h-8' onClick={() => setSide(!side)}>{side ? '>' : '<'}</button>
        <button className='absolute bottom-1 font-semibold -right-3 rounded-full bg-[#151515]  p-2 pb-3 w-8 flex items-center justify-center h-8' onClick={() => setDisplay(!display)}>x</button>
      </aside>}
      {!display && <button className='bottom-1 font-extrabold -left-3 rounded-full bg-[#151515] z-10  text-gray-400 p-2 pb-3 w-8 flex items-center justify-center h-15 fixed' onClick={() => setDisplay(!display)}>{'>'}</button>}
      {clickSetting && <Setting clickSetting={clickSetting} setAlert={setAlert} setClickSetting={setClickSetting} />}
      {clickedDataEntry && <AddEntryForm setAlert={setAlert} isAddClicked={clickedDataEntry} dataEntry={true} setIsAddClicked={setClickedDataEntry} setEmployeeData={[]} />}
    </>
  )
}

export default Sidebar