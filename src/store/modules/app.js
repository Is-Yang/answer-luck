const app = {
    state: {
        userInfo: '', // 用户信息
        day: '' // 最近天数
    },
    mutations: {
        SAVE_USER: (state, data) => {
            state.userInfo = data;
        },
        GET_DAY: (state, data) => {
            state.day = data;
        }
    },
    actions: {
        saveUser: ({ commit }, data) => {
            commit('SAVE_USER', data);
        },
        GetDay: ({ commit }, data) => {
            commit('GET_DAY', data);
        }
    }
};

export default app;