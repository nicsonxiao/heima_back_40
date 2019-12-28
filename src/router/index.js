import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/Login.vue'
import Index from '@/views/Index.vue'
import Welcome from '@/views/Welcome.vue'
import PostList from '@/views/PostList.vue'
import PostPublish from '@/views/PostPublish.vue'

Vue.use(VueRouter)

let router =new VueRouter({
    routes:[
        {
            name:'default',
            path:'/',
            redirect: {name:'login'}
        },
        {
            name:'login',
            path:'/login',
            component:Login
        },
        {
            name:'index',
            path:'/index',
            component:Index,
            redirect: {name:'welcome'},
            children:[
                {
                    name:'welcome',
                    path:'welcome',
                    component:Welcome
                },
                {
                    name:'PostList',
                    path:'postList',
                    component:PostList
                },
                {
                    name:'Postpublish',
                    path:'Postpublish',
                    component:PostPublish
                }
            ]
        }
    ]
})


//添加导航守卫
router.beforeEach((to, from, next) => {
    if(to.path==='/login'){
        // 如果是到登录，就直接进入登录页
        next()
    }else{
        let token=localStorage.getItem('heima_40_back_token')
        if(token){
            next()
        }else{
            next({path:'/'})
        }
    }
  })

export default router