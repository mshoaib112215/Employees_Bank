import React, { useState, useEffect } from 'react'

const PreviewEntry = ({ setPreviewClicked, currentRecords, previewClicked, id }) => {
    const [record, setRecord] = useState(null)
    const [remarks, setRemarks] = useState('');
    const keyOrder = ["name", "email", "gender", 'phone', "cnic", 'applied_for', "city", "type", "status", 'createdAt', "applied_date", "remarks"];
    const keyMapping = {
        type: "Employee Type",
        cnic: 'CNIC',
        phone: 'Phone No',
        applied_for: "Applied For",
        applied_date: "Applied Date",
        createdAt: "Created At",


    };
    useEffect(() => {
        setRecord(currentRecords.filter(entry => entry._id == id))
    }, [currentRecords])
    useEffect(() => {
        { console.log(record) }

        setRemarks(record?.[0]?.remarks)

    }, [record])

    return (

        <div className="fixed inset-0 pt-10 overflow-y-scroll  flex justify-center h-screen  bg-gray-500 bg-opacity-50 z-[100]" >

            <div className="bg-white absolute  rounded-3xl p-4 pb-10 w-[80vw] mb-10 sm:w-[40%] h-fit ">
                <div className="bg-white  rounded-lg p-4 w-screen sm:w-full relative">
                    <button className="rounded-full absolute text-3xl top-[.5rem] right-[.5rem]  bg-red-600 p-2 w-10 h-10 flex justify-center items-center " onClick={() => setPreviewClicked(!previewClicked)}>
                        <svg width="35" height="35" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#fff" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z" />
                        </svg>
                    </button>

                    <h2 className="mb-4 text-3xl">Entry Preview</h2>
                    <div className=''>
                        {record?.map((entry, index) => (
                            <div key={index}>
                                {keyOrder
                                    .filter(key => entry[key] !== undefined) // Only include keys that exist in the current entry
                                    .map((key, subIndex) => {
                                        // Use the key mapping if available, or use the original key
                                        const formattedKey = keyMapping[key] || key;

                                        return (
                                            <div key={subIndex} className='flex text-xl 3xl:text-2xl'>
                                                <p className='w-[30%] font-semibold mb-2'>{formattedKey}:</p>
                                                <p className='whitespace-normal w-[70%] mb-2'>{
                                                    key == 'phone' ?
                                                        0 + entry[key].toString().substring(0, 3) + '-' + entry[key].toString().substring(3)
                                                        :
                                                        key == 'cnic' ?
                                                            entry[key].toString().substring(0, 5) + '-' + entry[key].toString().substring(5, 12) + "-" + entry[key].toString().substring(12, 13)
                                                            :
                                                            key == "applied_date" ?
                                                                new Date(entry[key]).toLocaleDateString('en-GB')
                                                                :
                                                                key == "createdAt" ?
                                                                    new Date(entry[key]).toLocaleDateString('en-GB')
                                                                    :
                                                                    entry[key]}
                                                </p>
                                            </div>
                                        );
                                    })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PreviewEntry