import axios from 'axios'
import {
    Toast
} from 'vant';

// const apiHost = "http://gtmcmp.signalfire.net.cn/GTMCfamily/camp/antincp/";
const apiHost = "http://gfwp.gac-toyota.com.cn/GTMCfamily/camp/antincp/api/";
const fileUrl = "http://gfwp.gac-toyota.com.cn/GTMCfamily/camp/antincp";
// const fileUrl = '';

let request = axios.create({
    headers: {
        'content-type': 'application/x-www-form-urlencoded',
    },
    timeout: 10000,
    withCredentials: true,
    // baseURL: 'http://gtmcmp.signalfire.net.cn'
    baseURL: 'http://gfwp.gac-toyota.com.cn/GTMCfamily/camp/antincp'
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