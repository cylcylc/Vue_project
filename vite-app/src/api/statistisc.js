import axios from '../utils/axios'
//获取统计页面数据
export const statistisc_data=(params)=>{
    return axios({
        url:"/api/bill/data",
        method:"get",
        params
    })
}