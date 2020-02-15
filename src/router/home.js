import Index from '../pages/Index'
import Answer from '../pages/Answer'
import Reward from '../pages/Reward'

export default [{
    path: '/index', // 首页
    component: Index
}, {
    path: '/answer', // 答题页
    component: Answer,
}, {
    path: '/reward', // 抽奖页
    component: Reward
}]