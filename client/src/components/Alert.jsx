import React, { useState, useEffect } from 'react';

const Alert = ({ message = "Nothing found", type, onHide, flex = false }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsVisible(false);
            onHide(); // Call onHide to hide the alert from the parent
        }, type==='loading'? 100000 : 2000);

        return () => clearTimeout(timeout);
    }, [onHide]);

    if (!isVisible) {
        return null; // Hide the component when not visible
    }

    const alertClassName = type === 'success' ? 'bg-green-500' : type === 'loading' ? "bg-white shadow-md" : 'bg-red-500';

    return (
        <div className={`fixed top-3 ${flex ? "flex" : ""}right-3 w-fit ${alertClassName} rounded-lg  text-white p-5 text-center z-[1000]`}>
            {message}
            <button className="text-white bg-gray-800 rounded-md px-2 py-1 ml-2" onClick={onHide}>
                Close
            </button>
        </div>
    );
};
export default Alert;
