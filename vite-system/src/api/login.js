import axios from "../utils/axios"
//登录
export const  login=(data)=>{
    return axios({
        url:"/v1/adminUser/login",
        method:"post",
        data
    })
}
//获取用户名
export const profile=()=>{
    return axios({
        url:"/v1/adminUser/profile",
        method:"get",
    })
}
//退出
export const loginOut=()=>{
    return axios({
        url:"/v1/logout",
        method:"delete"
    })

}