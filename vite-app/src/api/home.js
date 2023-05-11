import axios from "../utils/axios.js"
//获取全部类型
export const getTypes=()=>{
    return axios.get("/api/type/list")
}
//获取相应类型的数据
export const getList=(params)=>{
    return axios({
        url:"/api/bill/list",
        method:"get",
        params
    })
}
//添加账单
export const add=(data)=>{
    return axios({
        url:"/api/bill/add",
        method:"post",
        data
    })
}