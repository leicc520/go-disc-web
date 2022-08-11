<template>
	<div class="role">
		<div class="container">
			<STform :ref-obj.sync="searchInfo.ref" :data="searchInfo.data"  :field-list="searchInfo.searchFormList" :inline="true" :rules="searchInfo.rules" label-width=" " >
				<template slot="form-btn">
                    <el-button type="primary" @click="doSearch">查询</el-button>
                    <el-button @click="searchInfo.ref && searchInfo.ref.resetFields()">重置</el-button>
                    <el-button type="warning" @click="onReload">数据重载</el-button>
				</template>
			</STform>
			<STtable size="mini" :data.sync="tableData" @doRefresh="fetchData" :field-list="tables"
                :pagination="pagination" :loading="loading" @handleEvent="handleEvent">
				<template slot="col-status" slot-scope="scope">{{(dicts.sysRoleStatus[scope.row.status])? dicts.sysRoleStatus[scope.row.status]:"其他"}}</template>
                <template slot="col-stime" slot-scope="scope">{{utils.dateStr(scope.row.stime, "Y-m-d h:i:s")}}</template>
                <template slot="col-btn" slot-scope="scope">
                    <el-button size="mini" @click="onStatus(scope.row, 1)">正常</el-button>
                    <el-button size="mini" type="danger" @click="onStatus(scope.row, 2)">禁用</el-button>
                </template>
            </STtable>
		</div>
        <!-- 编辑弹出框 -->
        <el-dialog :title="page.popTitle" center :visible.sync="page.dialogVisible" :width="page.popWidth">
        	<div v-if="page.pop == 1"  class="pop_box">
        		<div class="pop_concent">您确定要重载微服务数据吗？</div>
        		<div slot="footer" class="dialog-footer">
        			<el-button @click="hidePop">取 消</el-button>
        			<el-button type="primary" @click="doReload">确 定</el-button>
        		</div>
        	</div>
        	<div v-if="page.pop == 2"  class="pop_box">
        		<div class="pop_concent">您确定设置当前微服务{{(details.status == 2)? '下架禁用':'上架服务'}}吗？</div>
        		<div slot="footer" class="dialog-footer">
        			<el-button @click="hidePop">取 消</el-button>
        			<el-button type="primary" @click="doStatus">确 定</el-button>
        		</div>
        	</div>
        </el-dialog>
	</div>
</template>

<script>
	import STtable from '@/components/common/STtable'
	import STform from '@/components/common/STform'
	import msrvAPI from '@/api/micsrv.js'
	import consts from './consts.js'
    import utils from '@/libs/utils.js'
	import {mapState} from 'vuex' //本地取信息
	export default {
		components: {STtable,STform},
		data() {
			return {
                utils: utils,
				searchInfo: {
					ref: null,
					data: { //搜索展示的字段
						query: '',
						stime: [],
					},
					rules: {},
					searchFormList: consts.searchFormList // 查询列表表单列 数据
				},
                page: {
                    tabheight:"100%",
                	popWidth: '75%',
                	popTitle: null,
                	dialogVisible: false,
                	pop: 0
                },
				multipleSelection: [], //选中数据
				sysPageForm: { //搜索实际请求的字段
				},
				loading: true,
				tableData: [], //列表数据
                tables:consts.tables,
				pagination: { // 分页数据
					pageNum: 1, // 当前页
					pageSize: 20, // 每页条数
					total: 0, //合计条数
					sorts: {id: 'DESC'},//排序信息
					pageSizes: [5, 10, 20, 50, 100], // 分页数量列表
					sizeChange: (val) => {
						this.onSizeChange(val)
					},
					currentChange: (pageNum) => {
						this.onCurrentChange(pageNum)
					},
					sortsChange:(sorts) => {
						this.onSortsChange(sorts);
					},
				},
			}
		},
		async created() {
			await this.fetchData();
			this.loading = false;
		},
		methods: {
			doSearch() {
				const data = this.searchInfo.data;
				Object.assign(this.sysPageForm, data);
				this.fetchData(this.sysPageForm);
			},
			onSortsChange(sorts) {
				this.pagination.sorts = sorts;
				this.fetchData(this.sysPageForm);
			},
			onSizeChange(pageSize) {
				this.pagination.pageSize = pageSize
				this.fetchData(this.sysPageForm)
			},
			onCurrentChange(pageNum) {
				this.pagination.pageNum = pageNum
				this.fetchData(this.sysPageForm)
			},
            async onStatus(data, status) {
            	this.details = Object.assign(data, {status:status});
            	this.showPop(2);
            },
            async doStatus() {
            	const osjon = await msrvAPI.doStatus({id:this.details.id, status:this.details.status});
            	if (osjon) {
            		this.hidePop();
            		this.fetchData();
            	}
            },
            async onReload() {
            	this.showPop(1);
            },
            async doReload() {
            	const osjon = await msrvAPI.doReload({});
            	if (osjon) {
            		this.hidePop();
            		this.fetchData();
            	}
            },
			async fetchData(params) {
				this.loading = false;
				const { pageNum, pageSize, sorts } = this.pagination;
				const ojson = await msrvAPI.getList({start:(pageNum - 1)*pageSize, limit:pageSize, sorts:sorts, ...params});
				if (ojson) {
					this.tableData = (ojson.list)? ojson.list:[];
					this.pagination.total = ojson.total;
				}
				this.loading = false;
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
            showPop(pop) {
            	this.page.popWidth = "300px";
                this.page.popTitle = (pop == 1)? '数据重载':'服务管理';
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

<style >
</style>
