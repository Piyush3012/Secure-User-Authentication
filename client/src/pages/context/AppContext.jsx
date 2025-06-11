import { createContext, useEffect } from "react";
import { useState } from "react";
import { ToastContainer,toast } from "react-toastify";
import axios from "axios";

export const AppContext=createContext();

//app context provider 
export const AppContextProvider=(props)=>{

    axios.defaults.withCredentials=true
    
    const backendUrl=import.meta.env.VITE_BACKEND_URL
    const [isLoggedIn,setIsLoggedIn]=useState(false);
    const [userData,setUserData]=useState(false);
    

    //function to get the user data 

    const getAuthState=async()=>{
        try {
            const {data}=await axios.get(backendUrl + '/api/auth/is-Auth')
            if(data.success){
                setIsLoggedIn(true)
                await getUserData()
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something Went Wrong!!')
        }
    }

    const getUserData=async()=>{
        try {
            const {data}=await axios.get(backendUrl + '/api/user/data')
            data.success ? setUserData(data.userData): toast.error(data.message)
        } catch (error) {
            console.log(error);
            const message = error?.response?.data?.message || 'Failed to fetch user data';
            toast.error(message);
        }

    }

    //we are using the useeffect hook to make the change in the UI when the page is reloading

    useEffect(()=>{
     getAuthState()
    },[])
    const value={
        backendUrl,
        isLoggedIn,setIsLoggedIn,
        userData,setUserData,
        getUserData
    }
    return ( 
        <AppContext.Provider value={value}> 
            {props.children}
        </AppContext.Provider>
    )
}
