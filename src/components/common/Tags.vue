<template>
<div class="tags" v-if="showTags">
    <ul>
        <li class="tags-li" v-for="(item,index) in tagsList" :class="{'active': isActive(item.path)}" :key="index">
            <router-link :to="item.path" class="tags-li-title">{{item.title}}</router-link>
            <span v-if="item.close" class="tags-li-icon" @click="closeTags(index)"><i class="el-icon-close"></i></span>
        </li>
    </ul>
</div>
</template>

<script>
import bus from './bus';
import {mapState} from 'vuex' //本地取信息
export default {
    data() {
        return {
            tagsList: [
                {path: '/index', title: '服务管理' , close: 0, name:"microsrv"}, 
                {path: '/yamlfile', title: '服务配置' , close: 0, name:"yamlfile"}
            ]
        }
    },
    methods: {
        isActive(path) {
            return path === this.$route.fullPath;
        },
        // 设置标签
        setTags(route){
            const isExist = this.tagsList.some(item => {
                return item.path === route.fullPath;
            })
            !isExist && this.tagsList.push({
                close: (route.meta && route.meta.noclose == 1)? 0:1,
                title: route.meta.title,
                path: route.fullPath,
                name: route.matched[1].components.default.name
            })
            bus.$emit('tags', this.tagsList);
        }
    },
    computed: {
        showTags() {
            return this.tagsList.length > 0;
        },
        ...mapState({
            user: (state) => {
              return state.adminSrv.user;
            }
        })
    },
    watch:{
        $route(newValue, oldValue){
            this.setTags(newValue);
        }
    },
    created(){
        if (this.user && this.user.id == 1) {
            this.tagsList.push({path: '/account', title: '账号管理' , close: 0, name:"account"});
        }
        this.setTags(this.$route);
    }
}
</script>
<style>
    .tags {
        position: relative;
        height: 30px;
        overflow: hidden;
        background: #fff;
        padding-right: 120px;
    }

    .tags ul {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
    }

    .tags-li {
        float: left;
        margin: 3px 5px 2px 3px;
        border-radius: 3px;
        font-size: 12px;
        overflow: hidden;
        cursor: pointer;
        height: 23px;
        line-height: 23px;
        border: 1px solid #e9eaec;
        background: #fff;
        padding: 0 5px 0 12px;
        vertical-align: middle;
        color: #666;
        -webkit-transition: all .3s ease-in;
        -moz-transition: all .3s ease-in;
        transition: all .3s ease-in;
    }

    .tags-li:not(.active):hover {
        background: #f8f8f8;
    }

    .tags-li.active {
        color: #fff;
    }

    .tags-li-title {
        float: left;
        max-width: 80px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 5px;
        color: #666;
    }

    .tags-li.active .tags-li-title {
        color: #fff;
    }
</style>
