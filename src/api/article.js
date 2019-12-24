import axios from '@/utils/myaxios.js'

//获取文章列表
export const getPostList=(params)=>{
    return axios({
        url:'/post',
        params
    })
}