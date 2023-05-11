import {createRouter, createWebHistory} from "vue-router"
const routes=[{
    path:"/",
    redirect:'/introduce'
},
{
    path:"/",
    component:()=>import ("../view/indexView.vue"),
    children:[{
        path:'introduce',
        component:()=>import ("../view/Dashboard/Introduce.vue"),
        meta:{
            title:"系统介绍"
        }
    },
    {
        path:'dashboard',
        component:()=>import ("../view/Dashboard/Dashboard.vue"),
        meta:{
            title:"大盘数据"
        }
    },
    {
        path:'add',
        component:()=>import ("../view/Dashboard/Add.vue"),
        name:"add",
        meta:{
            title:"添加商品"
        }
    },
    {
        path:'swiper',
        component:()=>import ("../view/HomePage/Swiper.vue"),
        meta:{
            title:"轮播图配置"
        }
    },
    {
        path:'hot',
        component:()=>import ("../view/HomePage/Hot.vue"),
        meta:{
            title:"热销商品配置"
        }
    },
    {
        path:'new',
        component:()=>import ("../view/HomePage/New.vue"),
        meta:{
            title:"新品上线配置"
        }
    },
    {
        path:'recommend',
        component:()=>import ("../view/HomePage/Recommend.vue"),
        meta:{
            title:"为你推荐配置"
        }
    },
    {
        path:'category',
        component:()=>import ("../view/Mode/Category.vue"),
        meta:{
            title:"分类管理"
        },
        children:[{
            path:"/category/level2",
            component:()=>import("../view/Mode/Category.vue"),
            meta:{
                title:"分类二级管理"
            }
        },
        {
            path:"/category/level3",
            component:()=>import("../view/Mode/Category.vue"),
            meta:{
                title:"分类三级管理"
            }
        }
    ]
    },
    {
        path:'good',
        component:()=>import ("../view/Mode/Good.vue"),
        meta:{
            title:"商品管理"
        }
    },
    {
        path:'guest',
        component:()=>import ("../view/Mode/Guest.vue"),
        meta:{
            title:"会员管理"
        }
    },
    {
        path:'order',
        component:()=>import ("../view/Mode/Order.vue"),
        meta:{
            title:"订单管理"
        }
    },
    {
        path:'order_detail',
        component:()=>import ("../view/Mode/Order_detail.vue"),
        meta:{
            title:"订单详情"
        }
    },
    {
        path:'account',
        component:()=>import ("../view/System/Account.vue"),
        meta:{
            title:"修改密码"
        }
    },
   
]
},
{
    path:"/login",
    component:()=>import("../view/Login.vue")
}
]
const router=createRouter({
    history:createWebHistory(),
    routes
})
export default router