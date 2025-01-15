import React, { useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";

function RefreshHandler({setIsAuthenticated}){
    const navigate=useNavigate();
    const location=useLocation();
    useEffect(()=>{
        const data=localStorage.getItem('userData');
        const token=localStorage.getItem('authToken');
        if(token){
            setIsAuthenticated(true);
            if(location.pathname==='/'||location.pathname==='/login'){
                navigate('/dashboard',{replace:false});
            }
        }
    },[location,navigate,setIsAuthenticated])
    return(
        <div></div>
    )
}

export default RefreshHandler;