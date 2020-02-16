import axios from 'axios'
import {
    Toast
} from 'vant';

// 测试
// const apiHost = "http://gtmcmp.signalfire.net.cn/GTMCfamily/camp/antincp/";
// 正式
const apiHost = "http://gfwp.gac-toyota.com.cn/GTMCfamily/camp/antincp/api/";
// 文件路径
const fileUrl = "http://gtmccdn.istarcore.com/GTMCfamily/camp/antincp";

let request = axios.create({
    headers: {
        'content-type': 'application/x-www-form-urlencoded',
    },
    timeout: 10000,
    withCredentials: true,
    // 测试
    // baseURL: 'http://gtmcmp.signalfire.net.cn',
    // 正式
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