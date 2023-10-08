import { useEffect } from 'react'


const LogoutHandler = ({ logout }) => {
    useEffect(() => {
        logout();
        
    }, [logout]);
    
    return null; // or any loading message or redirect logic if needed
};

export default LogoutHandler