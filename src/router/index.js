import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/index'
        },{
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '系统管理' },
            children:[
                {
                    path: '/index',
                    component: resolve => require(['../components/page/micsrv/index.vue'], resolve),
                    meta: { title: '服务管理' , noclose: 1 },
                },{
                    path: '/account',
                    component: resolve => require(['../components/page/account/index.vue'], resolve),
                    meta: { title: '账号管理' , noclose: 1 },
                },{
                    path: '/yamlfile',
                    component: resolve => require(['../components/page/yamlfile/index.vue'], resolve),
                    meta: { title: '服务配置' , noclose: 1 },
                }
            ]
        },{
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },{
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        },{
            path: '/403',
            component: resolve => require(['../components/page/403.vue'], resolve)
        },{
            path: '*',
            redirect: '/404'
        }
    ]
})
