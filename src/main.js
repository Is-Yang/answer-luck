import Vue from 'vue'
import Vant from 'vant'
import App from './App.vue'
import 'vant/lib/index.css'
import 'vant/lib/icon/local.css';
import './assets/css/common.scss';
import router from './router/index'
import store from './store/index'
import component from './components/index'
import { apiHost, fileUrl, request } from './request'
import {
    Toast
} from 'vant';

// 事件传播
Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()
    // 域名
Vue.prototype.$host = apiHost;
// 文件地址
Vue.prototype.$fileUrl = fileUrl;
// 请求
Vue.prototype.$request = request;
// 音频播放
Vue.prototype.playAudio = (audio, type) => {
    let playAudio = document.getElementById('setAudioPlay');
    playAudio.setAttribute('src', fileUrl + audio);
    if (type) {
        playAudio.play();
    } else {
        playAudio.pause();
    }
}
Vue.config.productionTip = false

Vue.use(Vant);
Vue.use(Toast);

// 注册全局组件
Object.keys(component).forEach(key => {
    var name = key.replace(/(\w)/, (v) => v.toUpperCase()); // 首字母大写
    Vue.component(`${name}`, component[key]);
});

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
})