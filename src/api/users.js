//引入封装的axios
import axios from '@/utils/myaxios'

//用户登录
export const userLogin=(data)=>{
    return axios({
        method:'post',
        url:'/login',
        data
    })
}