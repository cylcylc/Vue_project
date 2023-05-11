import axios from "../utils/axios"
//轮播图配置
export const carousels=(params)=>{
    return axios({
        url:"/v1/carousels",
        method:"get",
        params
    })
}
//删除轮播图
export const deleteCarousels=(data)=>{
     return  axios({
        url:"/v1/carousels",
        method:"delete",
        data
    })
}
//增加轮播图
export const addCarousels=(data)=>{
    return axios({
        url:"/v1/carousels",
        method:'post',
        data
    })
}
//修改轮播图
export const updateCarousels=(data)=>{
    return axios({
        url:"/v1/carousels",
        method:"put",
        data
    })
}
//热销商品
export const hotConfigs=(params)=>{
    return axios({
        url:"/v1/indexConfigs",
        method:"get",
        params
    })

}
//添加商品
export const addConfig=(data)=>{
    return axios({
        url:"/v1/indexConfigs",
        method:'post',
        data
    })
}
//修改商品
export const updateConfig=(data)=>{
    return axios({
        url:"/v1/indexConfigs",
        method:"put",
        data
    })
}
//删除商品
export const deleteConfig=(data)=>{
    return axios({
        url:"/v1/indexConfigs/delete",
        method:"post",
        data
    })
}