import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/Login.vue'

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
        }
    ]
})
export default router