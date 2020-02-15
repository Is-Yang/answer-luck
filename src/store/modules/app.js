const app = {
    state: {
        userInfo: false, // 用户信息
    },
    mutations: {
        SAVE_USER: (state, data) => {
            state.userInfo = data;
        }
    },
    actions: {
        saveUser: ({ commit }, data) => {
            commit('SAVE_USER', data);
        }
    }
};

export default app;