import axios from "axios"
const baseUrl = import.meta.env.VITE_BACKEND_URL;
export const apiFunction = async(api, params=[], data={}, method, withAuth)=>{
    let headers={}
    let response;
    if(withAuth){
        const token = localStorage.getItem('token')
        headers.Authorization = `Bearer ${token}`
        headers.role = "student"
    }

    const url = `${baseUrl}/${api}${params.length > 0 ? `/${params.join("/")}`:''}`;

    switch(method){
        case 'GET':
            response = await axios.get(url,{headers})
            break;
        case 'POST':
            response = await axios.post(url,data,{headers})
            break;
        case 'PUT':
            response = await axios.put(url,data,{headers})
            break;
        case 'DELETE':
            response = await axios.delete(url,{headers})
            break;
    }
    return response;
}