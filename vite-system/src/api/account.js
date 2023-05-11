import axios  from "../utils/axios";
export const name=(data)=>{
    return axios({
        url:"/v1/adminUser/name",
        method:"put",
        data
    })
}
export const password=(data)=>{
    return axios({
        url:"/v1/adminUser/password",
        method:"put",
        data
    })
}