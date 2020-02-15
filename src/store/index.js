import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app'; // ./modules/app.js
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        app, //app:app,
    },
    getters: getters, //getters:getters
});

export default store