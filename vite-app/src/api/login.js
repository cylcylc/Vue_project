import axios from "../utils/axios.js"
//登录
export const login=(data)=>{
    return axios.post("/api/user/login",data)
}
//注册
export const registerd=(data)=>{
    return axios.post("/api/user/register",data)
}