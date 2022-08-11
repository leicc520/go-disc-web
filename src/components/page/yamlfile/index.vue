<template>
  <div class="role">
    <div class="container">
      <STform
        :ref-obj.sync="searchInfo.ref"
        :data="searchInfo.data"
        :field-list="searchInfo.searchFormList"
        :listTypeInfo="dictList"
        :inline="true"
        :rules="searchInfo.rules"
        label-width=" "
      >
        <template slot="form-btn">
          <el-button type="primary" @click="doSearch">查询</el-button>
          <el-button @click="searchInfo.ref && searchInfo.ref.resetFields()">重置</el-button>
          <el-button type="primary" @click="onAdd">新增</el-button>
        </template>
      </STform>
      <STtable
        size="mini"
        :data.sync="tableData"
        :field-list="tables"
        @doRefresh="fetchData"
        :pagination="pagination"
        :loading="loading"
        @handleEvent="handleEvent"
      >
        <!-- 自定义插槽状态按钮 -->
        <template slot="col-btn" slot-scope="scope">
          <el-button size="mini" @click="onEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="onDelete(scope.row)"
            >删除</el-button
          >
        </template>
        <template slot="col-stime" slot-scope="scope">{{
          utils.dateStr(scope.row.stime, "Y-m-d h:i")
        }}</template>
        <template slot="col-status" slot-scope="scope">{{
          dicts.sysStatus[scope.row.status]
            ? dicts.sysStatus[scope.row.status]
            : "禁用"
        }}</template>
      </STtable>
    </div>
    <!-- 编辑弹出框 -->
    <el-dialog
      :title="page.popTitle"
      center
      :visible.sync="page.dialogVisible"
      :width="page.popWidth"
      :closeOnClickModal="false"
    >
      <div v-if="page.pop == 1 || page.pop == 3" class="pop_box">
        <STform
          :ref-obj.sync="formInfo.ref"
          :data="formInfo.data"
          :field-list="formInfo.fieldList"
          :rules="formInfo.rules"
          :listTypeInfo="dictList"
          label-width="80px"
          @handleEvent="handleFormEvent"
        >
          <template slot="form-yaml">
            <STyamlEditor
              ref="STyamlEditor"
              v-model="formInfo.data.yaml"
            ></STyamlEditor>
          </template>
        </STform>
        <div slot="footer" class="dialog-footer">
          <el-button @click="hidePop">取 消</el-button>
          <el-button type="primary" @click="doSubmit">确 定</el-button>
        </div>
      </div>
      <div v-if="page.pop == 2" class="pop_box">
        <div class="pop_concent">删除不可恢复，是否确定删除？</div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="hidePop">取 消</el-button>
          <el-button type="primary" @click="deleteRow">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import STyamlEditor from "@/components/common/STyamlEditor";
import STtable from "@/components/common/STtable";
import STform from "@/components/common/STform";
import yamlAPI from "@/api/yamlfile.js";
import consts from "./consts.js";
import utils from "@/libs/utils.js";
import { mapState } from "vuex"; //本地取信息
export default {
  components: { STtable, STform, STyamlEditor },
  data() {
    return {
      utils: utils,
      page: {
        popWidth: "75%",
        popTitle: null,
        dialogVisible: false,
        pop: 0,
      },
      searchInfo: {
        ref: null,
        data: {},
        rules: {},
        searchFormList: consts.searchFormList, // 查询列表表单列 数据
      },
      multipleSelection: [], //选中数据
      sysPageForm: {
        //搜索实际请求的字段
        name: "",
      },
      details: null, //单项数据
      loading: true,
      tableData: [], //列表数据
      tables: consts.tables,
      pagination: {
        // 分页数据
        pageNum: 1, // 当前页
        pageSize: 20, // 每页条数
        total: 0, //合计条数
        sorts: { id: "DESC" }, //排序信息
        pageSizes: [5, 10, 20, 50, 100], // 分页数量列表
        sizeChange: (val) => {
          this.onSizeChange(val);
        },
        sortsChange: (sorts) => {
          this.onSortsChange(sorts);
        },
        currentChange: (pageNum) => {
          this.onCurrentChange(pageNum);
        },
      },
      formInfo: {
        // 表格数据
        ref: null,
        data: null,
        rules: consts.rules,
        fieldList: consts.fieldList,
      },
    };
  },
  async created() {
    await this.fetchData();
    this.loading = false;
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
  methods: {
    doSearch() {
      const data = this.searchInfo.data;
      Object.assign(this.sysPageForm, data);
      this.fetchData(this.sysPageForm);
    },
    async onDelete(data) {
      this.details = data;
      this.showPop(2);
    },
    async deleteRow() {
      const osjon = await yamlAPI.doDelete({ id: this.details.id });
      if (osjon) {
        this.hidePop();
        this.fetchData();
      }
    },
    onAdd() {
      this.formInfo.ref && this.formInfo.ref.resetFields();
      this.formInfo.data = consts.fieldData(null);
      this.showPop(1);
    },
    async onEdit(data) {
      this.formInfo.ref && this.formInfo.ref.resetFields();
      data = JSON.parse(JSON.stringify(data));
      this.formInfo.data = consts.fieldData(data);
      this.showPop(3);
    },
    async doSubmit() {
      this.formInfo.ref.validate(async (valid) => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.formInfo.data));
          if (this.$refs.STyamlEditor.getError()) {
            this.$message.error("配置内容，格式错误");
            return;
          }
          var res = await yamlAPI.doSave(data);
          if (res) {
            await this.fetchData(null);
            this.hidePop();
          }
        } else {
          return false;
        }
      });
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
      const ojson = await yamlAPI.getList({
        start: (pageNum - 1) * pageSize,
        sorts: sorts,
        limit: pageSize,
        ...params,
      });
      if (ojson) {
        this.tableData = ojson.list;
        this.pagination.total = ojson.total;
      }
      this.loading = false;
      this.hidePop();
    },
    handleFormEvent() {},
    handleEvent(type, data) {
      switch (type) {
        case "tableCheck":
          this.multipleSelection = [];
          for (const index in data) {
            this.multipleSelection.push(data[index].styleId);
          }
          break;
      }
    },
    showPop(pop) {
      this.page.popWidth = "960px";
      if (pop == 1 || pop == 3) {
        this.page.popTitle = pop == 1 ? "新增配置" : "编辑配置";
      } else {
        this.page.popTitle = "删除配置";
        this.page.popWidth = "300px";
      }
      this.page.pop = pop;
      this.page.dialogVisible = true;
    },
    hidePop() {
      this.page.dialogVisible = false;
      this.page.pop = 0;
    },
  },
};
</script>
