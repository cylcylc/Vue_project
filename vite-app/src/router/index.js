import {createRouter,createWebHashHistory} from "vue-router";
const routes=[
    {
        path: "/",
        redirect: '/home',
        name: 'home'
    
      },
    {
    path:"/home",
    component:()=>import("../view/Home.vue"),
},
{
    path:"/statistics",
    component:()=>import("../view/Statistics.vue"),
    name:"Statistics",

},
{
    path:"/user",
    component:()=>import("../view/User.vue"),
},
{
    path:"/login",
    component:()=>import("../view/Login.vue")
},{
    path:'/detail',
    component:()=>import("../view/detail.vue")
},
{
    path:'/account',
    component:()=>import("../view/Account.vue")
},{
    path:"/about",
    component:()=>import("../view/about.vue")
}
]
const router=createRouter({
    history:createWebHashHistory(),
    routes
})
export default router;