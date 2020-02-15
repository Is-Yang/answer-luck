import Vue from 'vue'
import Router from 'vue-router'

//引入子路由
import Home from './home'

Vue.use(Router)
const baseRouter = [{path: '/', redirect:"/index"}];

const router = new Router({
    routes: baseRouter.concat(Home)
})

export default router