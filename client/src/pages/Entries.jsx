import React, { useEffect } from 'react'
import AddEntryForm from '../components/AddEntryForm'

const Entries = ({setAlert, isAddClicked, setIsAddClicked}) => {
  useEffect(()=>{
    console.log(isAddClicked)
    setIsAddClicked(!isAddClicked)
  }, [])
  return (
    isAddClicked && <AddEntryForm setAlert={setAlert} isAddClicked={isAddClicked} dataEntry = {true} setIsAddClicked={setIsAddClicked} setEmployeeData={[]} />
  )
}

export default Entries