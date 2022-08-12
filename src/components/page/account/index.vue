<template>
	<div class="role">
		<div class="container">
			<STform :ref-obj.sync="searchInfo.ref" :data="searchInfo.data" :field-list="searchInfo.searchFormList" :listTypeInfo="dictList" :inline="true" :rules="searchInfo.rules" label-width=" ">
				<template slot="form-btn">
                    <el-button type="primary" @click="doSearch">查询</el-button>
                    <el-button @click="searchInfo.ref && searchInfo.ref.resetFields()">重置</el-button>
                    <el-button type="primary" @click="onAdd">新增</el-button>
				</template>
			</STform>
			<STtable size="mini" :data.sync="tableData" @doRefresh="fetchData" :field-list="tables"
                :pagination="pagination" :loading="loading" @handleEvent="handleEvent">
				<!-- 自定义插槽状态按钮 -->
				<template slot="col-btn" slot-scope="scope">
					<el-button class="padding0" type="text" @click="onEdit(scope.row)">编辑</el-button>
				</template>
                <template slot="col-regtime" slot-scope="scope">{{utils.dateStr(scope.row.regtime, "Y-m-d h:i:s")}}</template>
                <template slot="col-expire" slot-scope="scope">{{utils.dateStr(scope.row.expire, "Y-m-d  h:i:s")}}</template>
                <template slot="col-stime" slot-scope="scope">{{utils.dateStr(scope.row.stime, "Y-m-d  h:i:s")}}</template>
				<template slot="col-status" slot-scope="scope">{{(dicts.sysStatus[scope.row.status])? dicts.sysStatus[scope.row.status]:"禁用"}}</template>
			</STtable>
		</div>
		<!-- 编辑弹出框 -->
		<el-dialog :closeOnClickModal="false" :title="page.popTitle" center :visible.sync="page.dialogVisible" :width="page.popWidth">
			<div v-if="page.pop == 1 || page.pop == 3" class="pop_box">
				<STform :ref-obj.sync="formInfo.ref" :data="formInfo.data" :field-list="formInfo.fieldList" :rules="formInfo.rules" :files="formInfo.files"
					 :listTypeInfo="dictList" label-width="140px"  @handleEvent="handleFormEvent"></STform>
				<div slot="footer" class="dialog-footer">
					<el-button @click="hidePop">取 消</el-button>
					<el-button type="primary" @click="doSubmit">确 定</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import STtable from '@/components/common/STtable'
	import STform from '@/components/common/STform'
	import userAPI from '@/api/user.js'
	import consts from './consts.js'
    import utils from '@/libs/utils.js'
	import {mapState} from 'vuex' //本地取信息
	export default {
		components: {STtable,STform},
		data() {
			return {
                utils:utils,
				defaultProps: {
					children: 'children',
					label: 'title',
                    isLeaf: 'leaf'
				},
				page: {
					popWidth: '75%',
					popTitle: null,
					dialogVisible: false,
					pop: 0
				},
				searchInfo: {
					ref: null,
					data: { //搜索展示的字段
						status: '',
						query: '',
					},
					rules: {},
					searchFormList: consts.searchFormList // 查询列表表单列 数据
				},
				multipleSelection: [], //选中数据
				sysPageForm: { //搜索实际请求的字段
				},
				details: null, //单项数据
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
				formInfo: { // 表格数据
					ref: null,
					data: null,
					rules: consts.rules,
					fieldList: consts.fieldList
				},
			}
		},
		computed: {
		    dictList() {
		      return this.$store.getters["dictSrv/list"];
		    },
		    ...mapState({
		      dicts: (state) => {
		        return state.dictSrv.data;
		      },
		    }),
		},
		async created() {
			await this.fetchData({status:-1});
			this.loading = false;
		},
		methods: {
			doSearch() {
				const data = this.searchInfo.data;
				Object.assign(this.sysPageForm, data);
				this.fetchData(this.sysPageForm);
			},
			onAdd() {
				this.formInfo.ref && this.formInfo.ref.resetFields();
				this.formInfo.data = consts.fieldData(null);
				this.showPop(1);
			},
			async onEdit(data) {
				this.formInfo.ref && this.formInfo.ref.resetFields();
				data = JSON.parse(JSON.stringify(data));
                data.regtime = utils.dateStr(data.regtime, "Y-m-d h:i:s");
                data.expire  = utils.dateStr(data.expire, "Y-m-d h:i:s");
				this.formInfo.data = consts.fieldData(data);
				this.showPop(3);
			},
			async doSubmit() {
				this.formInfo.ref.validate(async (valid) => {
					if (valid) {
						const data = JSON.parse(JSON.stringify(this.formInfo.data));
						var res = await userAPI.doSave(data);
						if (res) {
							await this.fetchData();
							this.hidePop();
						}
					} else {
						return false;
					}
				})
			},
			onSizeChange(pageSize) {
				this.pagination.pageSize = pageSize;
				this.fetchData(this.sysPageForm);
			},
			onCurrentChange(pageNum) {
				this.pagination.pageNum = pageNum;
				this.fetchData(this.sysPageForm);
			},
			onSortsChange(sorts) {
				this.pagination.sorts = sorts;
				this.fetchData(this.sysPageForm);
			},
			async fetchData(params) {
				this.loading = false;
				const { pageNum, pageSize, sorts } = this.pagination;
				const ojson = await userAPI.getList({start:(pageNum - 1)*pageSize, limit:pageSize, sorts:sorts, ...params});
				if (ojson) {
					this.tableData = ojson.list;
					this.pagination.total = ojson.total;
				}
				this.loading = false;
				this.hidePop();
			},
			handleFormEvent(type, data) {
                if (type == "fileChange") {
                    if (data.value == 'avatar' && data.file) {
                    	this.formInfo.data.avatar = data.file.src;
                    }
                }
			},
			handleEvent(type, data) {
                if (type == "tableCheck") {
                    this.multipleSelection = []
                    for (const index in data) {
                    	this.multipleSelection.push(data[index].styleId);
                    }
                }
			},
			showPop(pop) {
				this.page.popWidth = "780px";
				this.page.popTitle = (pop == 1)? '新增账号':'编辑账号';
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
