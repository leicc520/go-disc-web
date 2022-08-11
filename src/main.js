import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import store from '@/store/index';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import '../static/css/theme-green/index.css';     // 浅绿色主题
import "babel-polyfill";
import {appToken, signCheck, BaseURL} from "@/libs/core.js";
Vue.use(ElementUI, { size: 'small' });
Vue.prototype.$axios = axios;
Vue.prototype.$store = store;
signCheck(store, router);
//使用钩子函数对路由进行权限跳转
router.beforeEach(async(to, from, next) => {
    const token = appToken(false);
    if (!token && to.path !== '/login') {
        next('/login');
    } else {
       next();
    }
});

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app');
