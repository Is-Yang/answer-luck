import axios from 'axios'
import {
    Toast
} from 'vant';


let apiHost = '';
let fileUrl = ''; // 文件路径
let prod = window.location.host == 'gfwp.gac-toyota.com.cn' ? true : false;
if (prod) {
    // 正式
    apiHost = 'http://gfwp.gac-toyota.com.cn/GTMCfamily/camp/covid-19/api/';
    fileUrl = 'http://gtmccdn.istarcore.com/GTMCfamily/camp/covid-19/';
} else {
    // 测试
    apiHost = "http://gtmcmp.signalfire.net.cn/GTMCfamily/camp/antincp/";
    fileUrl = 'http://gtmcmp.signalfire.net.cn/';
}

let request = axios.create({
    headers: {
        'content-type': 'application/x-www-form-urlencoded',
    },
    timeout: 10000,
    withCredentials: true,
    baseURL: prod ? 'http://gfwp.gac-toyota.com.cn/GTMCfamily/camp/covid-19' : 'http://gtmcmp.signalfire.net.cn'
})
request.interceptors.request.use(
    config => {
        return config
    },
    err => {
        return Promise.reject(err)
    }
)

// http response 拦截器
request.interceptors.response.use(
    response => {
        if (response.data && response.data.code == 403) {
            window.location.href = apiHost + 'login';
        }
        return response.data;
    },
    //接口错误状态处理，也就是说无响应时的处理
    error => {
        return Promise.reject(error.response.status) // 返回接口返回的错误信息
    }
)

export {
    apiHost,
    fileUrl,
    request
}