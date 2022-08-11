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
                        <el-dropdown-item divided  command="editUser">编辑账号</el-dropdown-item>
                        <el-dropdown-item divided  command="signOut">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
         <!-- 编辑弹出框 -->
        <el-dialog :closeOnClickModal="false" :title="page.title" center :visible.sync="page.dialogVisible" :width="page.popWidth">
            <STform :ref-obj.sync="formUser.ref" :data="formUser.data" :field-list="formUser.fieldList" :rules="formUser.rules" :listTypeInfo="dictList" label-width="140px"  @handleEvent="handleFormEvent"></STform>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="hidePop">取 消</el-button>
                    <el-button type="primary" @click="doSubmit">确 定</el-button>
                </div>
        </el-dialog>
    </div>
</template>
<script>
    import bus from '../common/bus';
    import {appToken} from "@/libs/core.js"
    import STform from '@/components/common/STform'
    import utils from "@/libs/utils.js"
    import userAPI from '@/api/user.js'
    import {mapState} from 'vuex' //本地取信息
    export default {
        components: {STform},
        data() {
            return {
                page: {
                    popWidth: '75%',
                    popTitle: null,
                    dialogVisible: false,
                    pop: 0
                },
                formUser: { // 表格数据
                    ref: null,
                    data: {},
                    rules: { // 暂时不要
                       email: [{ required: true, message: '请输入电子邮箱', trigger: 'change' }],
                       mobile: [{ required: true, message: '请输入手机号码', trigger: 'change' }]
                    },
                    fieldList: [ // 新增弹出数据
                      { label: '账号', value: 'account', type: 'input', width: '300px', disabled:true},
                      { label: '昵称', value: 'nick', type: 'input', width: '300px', disabled:true},
                      { label: '密码', value: 'loginpw', type:'password', width: '300px'},
                      { label: '联系邮箱', value: 'email', type:'input', width: '300px'},
                      { label: '手机号码', value: 'mobile', type:'input', width: '300px'},
                      { label: '过期时间', value: 'expire',  type:'date', width: '300px', dateType:'datetime', format:"yyyy-MM-dd HH:mm", disabled:true}
                    ]
                }
            }
        },
        computed:{
            dictList() {
                return this.$store.getters["dictSrv/list"];
            },
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
                if(command == 'signOut'){
                    appToken(true);
                    this.$router.push('/login');
                } else if(command == 'editUser'){
                    let data = JSON.parse(JSON.stringify(this.user));
                    data.expire = utils.dateStr(data.expire, "Y-m-d h:i:s");
                    this.formUser.data = data;
                    this.showPop(1);
                }
            },
            handleFormEvent(type, data) {
            },
            doSubmit(){
                this.formUser.ref.validate(async (valid) => {
                    if (valid) {
                        const data = JSON.parse(JSON.stringify(this.formUser.data));
                        userAPI.doSafe(data);
                        this.hidePop();
                    } else {
                        return false;
                    }
                })
            },
            showPop(pop) {
                this.page.popWidth = "780px";
                this.page.popTitle = '编辑账号';
                this.page.pop = pop;
                this.page.dialogVisible = true;
            },
            hidePop() {
                this.page.dialogVisible = false;
                this.page.pop = 0;
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
