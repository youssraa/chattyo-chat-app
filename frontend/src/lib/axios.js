import axios from 'axios' ;


export const axiosInstance = axios.create({
    baseURL :import.meta.env.MOD_ENV === "development" ? " http://localhost:5001/api" : "/api" ,
    withCredentials : true 
    
})