<template>
<div>
    <el-row :gutter="20">
        <el-col :span="8">
            <el-row>
                <el-col>
                    <el-card shadow="hover" class="mgb20 ">
                        <div slot="header" class="clearfix">个人信息</div>
                        <div class="user-info">
                            <div class="user-avatar">
                                <el-avatar shape="circle" :size="100" fit="fill" :src="ossImage(user.avatar)">
                                    <img src="/static/img/avatar.png"/>
                                </el-avatar>
                                <STupfile :name="avatarFile.value" label="设置头像" @onFileChange="onFileChange" :accept="avatarFile.accept" :data="avatarFile.data"></STupfile>
                            </div>
                            <div class="userform">
                                <STform :ref-obj.sync="formUser.ref" :data="formUser.data" :field-list="formUser.fieldList" :rules="formUser.rules" :files="formUser.files"
                                    :listTypeInfo="dictList" label-width="140px"  @handleEvent="handleFormEvent"></STform>
                            </div>
                        </div>
                        <div class="dialog-footer" style="text-align: center;">
                            <el-button type="primary" @click="doSubmit">保存资料</el-button>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-col>
        <el-col :span="16">
            <el-row :gutter="20" class="mgb20">
                <el-col :span="8">
                    <el-card shadow="hover" :body-style="{padding: '0px'}">
                        <div class="grid-content grid-con-1">
                            <i class="el-icon-view grid-con-icon"></i>
                            <div class="grid-cont-right">
                                <div class="grid-num">1234</div>
                                <div>用户访问量</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card shadow="hover" :body-style="{padding: '0px'}">
                        <div class="grid-content grid-con-2">
                            <i class="el-icon-message grid-con-icon"></i>
                            <div class="grid-cont-right">
                                <div class="grid-num">321</div>
                                <div>系统消息</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card shadow="hover" :body-style="{padding: '0px'}">
                        <div class="grid-content grid-con-3">
                            <i class="el-icon-goods grid-con-icon"></i>
                            <div class="grid-cont-right">
                                <div class="grid-num">5000</div>
                                <div>数量</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-card shadow="hover" :body-style="{ height: '304px'}">
                <div slot="header" class="clearfix">
                    <span>待办事项</span>
                    <el-button style="float: right; padding: 3px 0" type="text">添加</el-button>
                </div>
                <el-table :data="todoList" :show-header="false" height="304" style="width: 100%;font-size:14px;">
                    <el-table-column width="40">
                        <template slot-scope="scope">
                            <el-checkbox v-model="scope.row.status"></el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <div class="todo-item" :class="{'todo-item-del': scope.row.status}">{{scope.row.title}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column width="60">
                        <template slot-scope="scope">
                            <i class="el-icon-edit"></i>
                            <i class="el-icon-delete"></i>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </el-col>
    </el-row>
</div>
</template>

<script>
    import STupfile from '@/components/common/STupfile'
	import STform from '@/components/common/STform'
	import consts from './consts.js'
    import utils from "@/libs/utils.js"
    import userAPI from '@/api/user.js'
    import {mapState} from 'vuex' //本地取信息
    export default {
        name: 'dashboard',
		components: {STform, STupfile},
        data() {
            return {
				formUser: { // 表格数据
					ref: null,
                    data: {},
					rules: consts.userRules,
					fieldList: consts.userInfo
				},
                avatarFile: {value: 'avatar', accept:'image/jpeg,image/gif,image/png', data:{skey:'file', appdir:'sysuser'}},
                todoList: [
                    {
                        title: '今天要修复100个bug',
                        status: false,
                    },
                    {
                        title: '今天要修复100个bug',
                        status: false,
                    },
                    {
                        title: '今天要写100行代码加几个bug吧',
                        status: false,
                    }, {
                        title: '今天要修复100个bug',
                        status: false,
                    },
                    {
                        title: '今天要修复100个bug',
                        status: true,
                    },
                    {
                        title: '今天要写100行代码加几个bug吧',
                        status: true,
                    }
                ]
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
            }),
			dictList() {
				return this.$store.getters["dictSrv/list"];
			},
        },
		async created() {
            setTimeout(()=>{
                this.user.expire   = utils.dateStr(this.user.expire, "Y-m-d h:i");
                this.formUser.data = this.user;
            }, 500);
		},
		methods:{
            ossImage(src) {
                if (src && !src.startsWith("http")) {
                    src = this.dicts.sysConfig.oss+src
                }
                return src;
            },
			doSubmit(){
				this.formUser.ref.validate(async (valid) => {
					if (valid) {
						const data = JSON.parse(JSON.stringify(this.formUser.data));
                        userAPI.doMine(data);
					} else {
						return false;
					}
				})
			},
            onFileChange(data) {
                if (data.value == 'avatar' && data.file) {
                    this.formUser.data.avatar = data.file.src;
                    this.doSubmit();//上传成功的情况
                }
            },
			handleFormEvent(type, data) {
                if (type == 'fileChange' && data.value == 'avatar' && data.file) {
                    this.formUser.data.avatar = data.file.src;
                }
			},
			handleEvent(type, data) {
				switch (type) {
					case 'tableCheck':
						this.multipleSelection = []
						for (const index in data) {
							this.multipleSelection.push(data[index].styleId);
						}
						break
				}
			},
		}
    }

</script>


<style>
	.user-info {
	    display: flex;
	}
	.userform{
		display: inline-block;
		vertical-align: top;
		width: 320px;
	}
	.user-avatar {
	    display: inline-block;
		overflow: hidden;
		vertical-align: top;
	}

    .user-avatar .file-uploader {
        display: flex;
        justify-content: center;
        align-items: center;
    }

	.mgb20 {
	    margin-bottom: 20px;
	}
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 12px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }



    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

</style>
