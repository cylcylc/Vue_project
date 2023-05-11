import axios from "../utils/axios"
export const  userinfo=()=>{
    return axios({
        url:'/api/user/get_userinfo',
        method:"get"
    })
}
export const modify=(data)=>{
    return axios({
        url:"/api/user/edit_signature",
        method:"post",
        data
    })
   }
   export const modify_pass=(data)=>{
    return axios({
        url:"/api/user/modify_pass",
        method:"post",
        data
    })
   }