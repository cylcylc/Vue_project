
import axios  from "../utils/axios";
//获取分类
export const categories=(params)=>{
    return axios({
        url:"/v1/categories",
        method:"get",
        params
    })
}
//删除分类
export const deleteCategories=(data)=>{
    return axios({
        url:"/v1/categories",
        method:'delete',
        data
    })
}
//添加分类
export const addCategories=(data)=>{
    return axios({
        url:"/v1/categories",
        method:'post',
        data
    })
}
export const updateCategories=(data)=>{
    return axios({
        url:"/v1/categories",
        method:'put',
        data
    })
}
//商品管理页面
export const goods=(params)=>{
    return axios({
        url:"/v1/goods/list",
        method:"get",
        params
    })
}
//下架
export const down=(data)=>{
    return axios({
        url:"/v1/goods/status/1",
        method:"put",
        data
    })
}
//上架
export const up=(data)=>{
    return axios({
        url:"/v1/goods/status/0",
        method:"put",
        data
    })
}
//订单详情
//获取订单
export const getOrders=(params)=>{
    return axios({
        url:"/v1/orders",
        method:"get",
        params
    })

}
//配货完成
export const finished=(data)=>{
    return axios({
        url:"/v1/orders/checkDone",
        method:"put",
        data
    })
}
//出库
export const checkout=(data)=>{
    return axios({
        url:"/v1/orders/checkOut",
        method:"put",
        data
    })
}
//关闭订单
export const close=(data)=>{
    return axios({
        url:"/v1/orders/close",
        method:"put",
        data
    })
}
//商品详情
export const detail=(id)=>{
    return axios({
        url:`/v1/orders/${id}`,
        method:"get",
    })

}