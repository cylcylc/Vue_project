import axios from "axios"
import {Toast} from "vant"
import { useRouter } from "vue-router"
axios.defaults.baseURL=process.env.NODE_ENV==="development"?"http://47.99.134.126:7008":"http://47.99.134.126:7008";//根据环境变量切换本地和线上的请求地址
axios.defaults.withCredentials=true;//允许跨域
axios.defaults.headers["X-Requested-With"]="XMLHttpRequest";
// axios.defaults.headers["token"]=localStorage.getItem("token")||"";//本项目采用token的用户鉴权方式，在请求头的headers内添加token，每次请求都会验证用户信息
// // 请求拦截器
axios.interceptors.request.use(config => {
    config.headers=config.headers||{}
    // 验证token,把token赋给headers中的Authorization（要弄清是赋给token还是Authorization）,Authorization弄清是否加Barser
    if(localStorage.getItem('token')){
        config.headers.Authorization = localStorage.getItem('token') || ""
    }
    return config;
}, error => {
    return Promise.reject(error);
})
// 响应拦截
axios.interceptors.response.use(res => {
    // const router=useRouter();
    if(typeof res.data!="object"){
     Toast.fail("服务器异常")
     return Promise.reject(res);
    }
   if(res.data.code!=200){
    if(res.data.msg)Toast.fail(res.data.msg);
    if(res.data.code==401){//未登录
        Toast.fail("未登录")
        // router.push("/login")
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