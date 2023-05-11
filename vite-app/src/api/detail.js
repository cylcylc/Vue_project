import axios from "../utils/axios.js";
//获取账单详情
export const detailBill=(params)=>{
    return axios({
        url:"/api/bill/detail",
        method:"get",
        params
    })
}
//删除
export const deleteBill=(data)=>{
    return axios({
        url:"/api/bill/delete",
        method:"post",
        data
    })
}
//编辑更新
export const update=(data)=>{
    return axios({
        url:"/api/bill/update",
        method:"post",
        data
    })
}
