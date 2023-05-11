import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import "lib-flexible/flexible"
import router from './router'
//全局引入样式
import "vant/lib/index.css"
import "./assets/iconfont/font_3628361_7u7o7ygwb9s/iconfont.css"
const app=createApp(App);
import {Toast,Dialog} from 'vant'
app.use(Toast)
app.use(Dialog)
app.use(router)
app.mount("#app")
//前置路由守卫
router.beforeEach((to,from,next)=>{
    if(to.path!=="/login"&&!localStorage.getItem("token")){
        next("/login")
    }else{
        next();
    }
})