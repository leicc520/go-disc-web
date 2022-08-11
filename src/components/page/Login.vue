<template>
    <div class="login-wrap">
        <div class="ms-title">配置管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="登录账号至少4个字母"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="账号密码至少6个字母" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <el-form-item prop="vcode">
                    <el-input placeholder="请输入验证码" v-model="ruleForm.vcode" class="ms-vcode" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                    <img v-if="vcodeSrc" :src="vcodeSrc" @click="reCode" class="img-vcode" />
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">确认登录</el-button>
                </div>
            </el-form>
            <div class="copyright">©2019-{{yearStr}} SQ.Ltd R&D Team</div>
        </div>
    </div>
</template>

<script>
    import {signIn, captchaJson, captchaCheck} from "@/api/admin.js"
    import {showToast, BaseURL} from "@/libs/core.js"
    import Cookies from 'js-cookie'
    export default {
        data: function(){
            var st = new Date();
            return {
                yearStr: st.getFullYear(),
                vcodeSrc: null,
                ruleForm: {
                    xtoken : '',
                    username: '',
                    password: '',
                    vcode: '',
                },
                rules: {
                    username: [
                        { required: true, message: '请输入登录账号', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    vcode: [
                        { required: true, message: '请输入验证码', trigger: 'blur' }
                    ]
                }
            }
        },
        created: function() {
            this.reCode();
        },
        methods: {
            getSumId() {
                var sumId = (localStorage)? localStorage.getItem('_cap'):'';
                (!sumId) && (sumId = Cookies.get("_cap"));
                return sumId;
            },
            setSumId(sumId) {
                if (localStorage) {
                  localStorage.setItem('_cap', sumId);
                }
                Cookies.get('_cap', sumId);
            },
            async reCode() {
                var sumId = this.getSumId();
                var res = await captchaJson({"sumid":sumId});
                if (res && res.code == 0) {
                    (sumId != res.datas._cap) && this.setSumId(res.datas._cap);
                    this.vcodeSrc = "data:image/png;base64,"+res.datas.image;
                }
            },
            submitForm(formName) {
                this.$refs[formName].validate(async(valid) => {
                    if (valid) {
                        var result = await captchaCheck({vcode:this.ruleForm.vcode,
                             sumid:this.getSumId()});
                        if (result.code != 0) {
                            this.reCode();
                            return;
                        }
                        this.ruleForm.xtoken = result.datas.xtoken;
                        var datas = await signIn({account:this.ruleForm.username,
                            loginpw: this.ruleForm.password, xtoken: this.ruleForm.xtoken});
                        if (datas.code == 0 && datas.datas.user) {
                            this.$store.commit("adminSrv/initSet", {user: datas.datas.user});
                            setTimeout(()=>{
                                this.$router.push('/');
                            }, 500);
                        } else {//失败的话重新刷新验证码
                            this.reCode();
                        }
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;
    }
    .ms-vcode {
        width: 150px;
    }
    .img-vcode {
        display: inline-block;
        width: 148px;
        height: 32px;
        float: right;
        border-radius: 4px;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:190px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
    .copyright {
        margin: 0 auto;
        font-size: 12px;
        width: 300px;
        text-align: center;
        position: absolute;
        bottom: 12px;
    }
</style>
