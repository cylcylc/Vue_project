import axios from "../utils/axios.js"
//获取商品分类
export const categories=(params)=>{
    return axios({
        url:"/v1/categories",
        method:"get",
        params
    })
}
//添加商品
export const addGood=(data)=>{
    return axios({
        url:"/v1/goods",
        method:"post",
        data
    })
}
//修改商品
export const updateGood=(data)=>{
    return axios({
        url:"/v1/goods",
        method:"put",
        data
    })
}