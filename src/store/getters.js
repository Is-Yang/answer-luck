const getters = {
    userInfo: state => state.app.userInfo, // 用户信息
    dayData: state => state.app.day // 最近天数
}
export default getters