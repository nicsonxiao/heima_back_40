import axios from 'axios'

//封装基地址
axios.defaults.baseURL = 'http://localhost:3000'


// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    let token=localStorage.getItem('heima_40_back_token')
    if(token){
        config.headers.Authorization =token
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

  
export default axios