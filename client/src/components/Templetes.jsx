import React, { useState } from 'react'
import { useSelector } from 'react-redux';

const Templetes = ({ remarks, setRemarks}) => {
    const [templeteClick, setTempleteClick] = useState(false);
    const templates = useSelector((state)=>state.templates);

    return (
        <>
            <div className='mt-3 relative'>

                <button className='text-lg   hover:border-blue-400  3xl:text-2xl border px-3 py-2 rounded-lg border-black flex items-center gap-4' onClick={() => setTempleteClick(!templeteClick)}>Templates
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 1024 1024"><path fill="%23c7c7c7" d="M104.704 338.752a64 64 0 0 1 90.496 0l316.8 316.8 316.8-316.8a64 64 0 0 1 90.496 90.496L557.248 791.296a64 64 0 0 1-90.496 0L104.704 429.248a64 64 0 0 1 0-90.496z" /></svg>
                </button>
                {templeteClick &&
                    <ul className='absolute p-3 bg-white custom-shadow min-w-[200px] rounded-lg'>
                        {templates.map((item, index)=>(

                            <li key = {index} className='w-full my-2 p-2 py-1 border border-[#6b6b6b] capitalize rounded-lg hover:bg-blue-400 hover:border-blue-400 hover:text-white font-semibold text-lg transition-all text-[#6b6b6b] select-none cursor-pointer' onClick={() => {setRemarks(item.description); setTempleteClick(false)}}>{item.value}</li>
                        
                        ))}
                    </ul>
                }
            </div>

        </>
    )
}

export default Templetes