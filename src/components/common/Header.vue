<template>
    <div class="header">
         <!-- 折叠按钮 -->
        <div class="collapse-btn">
            <i class="el-icon-menu"></i>
        </div>
        <div class="logo">服务配置中心</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{user.nick}} <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item divided  command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
    import bus from '../common/bus';
    import {appToken} from "@/libs/core.js"
    import {mapState} from 'vuex' //本地取信息
    export default {
        data() {
            return {
                collapse: false,
                fullscreen: false,
                name: 'leicc',
                message: 2
            }
        },
        computed:{
            ...mapState({
                user: (state) => {
                  return state.adminSrv.user;
                },
				dicts: (state) => {
				  return state.dictSrv.data;
				}
            })
        },
        methods:{
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if(command == 'loginout'){
                    appToken(true);
                    this.$router.push('/login');
                }
            }
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        color: #fff;
    }
    .collapse-btn{
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 70px;
    }
    .header .logo{
        float: left;
        width:250px;
        line-height: 70px;
    }
    .header-right{
        float: right;
        padding-right: 25px;
    }
    .header-user-con{
        display: flex;
        height: 70px;
        align-items: center;
    }
    .user-name{
        margin-left: 10px;
    }
    .el-dropdown-link{
        color: #fff;
        cursor: pointer;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
