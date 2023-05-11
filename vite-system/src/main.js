import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from "element-plus"
import 'element-plus/dist/index.css'
import router from "./router"
import "./assets/css/font_3665744_5n7ciem0uh8/iconfont.css"
const app=createApp(App);
app.use(ElementPlus)
app.use(router)
app.mount('#app')
router.beforeEach((to,from,next)=>{
    document.title=to.meta.title;
    if(to.path!=="/login"&&!localStorage.getItem("token")){
        next("/login")
    }else{
        next();
    }
})