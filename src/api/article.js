import axios from '@/utils/myaxios.js'

//获取文章列表
export const getPostList=(params)=>{
    return axios({
        url:'/post',
        params
    })
}


//发布文章
export const postArticle=data=>{
    return axios({
        method:'post',
        url:'/post',
        data
    })
}