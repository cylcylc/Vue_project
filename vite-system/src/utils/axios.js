import axios from "axios"
import router from "../router/index"
import { ElMessage } from 'element-plus'
axios.defaults.baseURL=process.env.NODE_ENV==="development"?"/manage-api":"/manage-api";//根据环境变量切换本地和线上的请求地址
axios.defaults.withCredentials=true;//允许跨域
axios.defaults.headers["X-Requested-With"]="XMLHttpRequest";
// axios.defaults.headers["token"]=localStorage.getItem("token")||"";//本项目采用token的用户鉴权方式，在请求头的headers内添加token，每次请求都会验证用户信息
// // 请求拦截器
axios.interceptors.request.use(config => {
    config.headers=config.headers||{}
    // 验证token
    if(localStorage.getItem('token')){
        config.headers["token"] = localStorage.getItem('token') || ""
    }
    return config;
}, error => {
    return Promise.reject(error);
})
// 响应拦截
axios.interceptors.response.use(res => {
    if(typeof res.data!="object"){
     ElMessage.error("服务器异常")
     return Promise.reject(res);
    }
   if(res.data.resultCode!=200&&res.data.resultCode!==1){
    if(res.data.message)ElMessage.error(res.data.message);
    if(res.data.resultCode===419){
        //管理员未登录
        router.push("/login")

    }
    return Promise.reject(res);
   }
   //其他情况返回数据源
    return res.data;
}, error => {
    // 对响应错误做点什么
    return Promise.reject(error);
});
export default axios;