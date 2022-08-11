<template>
  <div class="" :class="className">
    <!-- 显示表格 -->
    <el-table ref="table" v-loading="loading" :height="heights || undefined" :max-height="tableHeight || undefined" :data="data"
      :size="size" border highlight-current-row :row-key="rowKey" style="width:100%"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @select-all="handleSelectionChange"
      @selection-change="handleSelectionChange" @row-click="handleRowClick" @row-dblclick="handleRowDBClick" @sort-change="handleSortChange"
      :default-expand-all="defaultExpandAll">
      <el-table-column v-if="isExpand" type="expand">
        <template slot-scope="scope">
          <slot name="col-expand" :row="scope.row" :index="scope.$index" />
        </template>
      </el-table-column>
      <el-table-column v-if="checkBox" :key="'selection'" align="center" type="selection" width="46px" />
      <el-table-column v-if="tabIndex" :key="'index'" align="center" label="序号" :width="fieldList.length === 0 ? '' : 80" fixed>
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 + (pagination.pageNum - 1) * pagination.pageSize }}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="(item, index) in fieldList.filter(item => !item.hidden)" :key="index" :prop="item.value" :label="item.label"
        :fixed="item.fixed" :sortable="(item.sort)? item.sort:false" :show-overflow-tooltip="true" align="center" :width="item.width"
        :min-width="item.minWidth || '100px'">
        <template slot-scope="scope">
          <!-- solt 自定义列-->
          <template v-if="item.type === 'slot'">
            <slot :name="'col-' + item.value" :row="scope.row" :index="scope.$index" />
          </template>
          <!-- 嵌套表格 -->
          <template v-else-if="item.children">
            <el-table-column v-for="(childItem, childIndex) in item.children" :key="childIndex" :prop="childItem.value"
              :label="childItem.label" align="center" :width="item.width" :min-width="item.minWidth || '85px'" />
          </template>
          <!-- 标签 -->
          <el-tag v-else-if="item.type === 'tag'">{{ scope.row[item.value] }}</el-tag>
          <!-- 图片 v-imgAlart-->
          <a v-else-if="item.type === 'image' && scope.row[item.value]" target="_blank" :href="getImgSrc(scope.row[item.value])">
          <img class="img" height="40px" :src="getImgSrc(scope.row[item.value])" />
          </a>
          <!-- 其他 -->
          <span v-else>{{ scope.row[item.value] || '-' }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <template v-if="showPagination">
      <div class="pagination">
        <i class="el-icon-refresh" @click="doRefresh"></i>
        <el-pagination :current-page.sync="pagination.pageNum" :page-sizes="pagination.pageSizes" :page-size.sync="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'; //本地取信息
export default {
  name: 'PageTable',
  props: {
    // 自定义类名
    className: {
      type: String,
      default: () => ''
    },
    heights: {
      type: [Number, String],
      default: () => ''
    },
    // 获取数据的接口
    size: {
      type: String,
      default: () => 'mini'
    },
    // 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    // 是否显示序号
    tabIndex: {
      type: Boolean,
      default: false
    },
    // 是否有选择框
    checkBox: {
      type: Boolean,
      default: false
    },
    // 是否显示展开更多
    isExpand: {
      type: Boolean,
      default: false
    },
    // 是否有子集  树状
    rowKey: {
      type: String,
      default: ''
    },
    // 选中列表
    checkedList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 表格字段配置
    fieldList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 是否分页
    showPagination: {
      type: Boolean,
      default: true
    },
    // 列表数据
    data: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    pagination: {
      type: Object,
      default: () => {
        return {
          pageNum: 1, // 当前页
          pageSize: 20, // 每页条数
          total: 0,
          sorts: {},
          sizeChange: () => { },
          sortsChange: () => { },
          currentChange: () => { },
        }
      }
    },
    // 监听高度
    listenHeight: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 列表相关
      tableHeight: 0 // 表格最大高度
    }
  },
  computed: {
    ...mapState({
      imgSrc: state => {
        return state.dictSrv.imgSrc;
      }
    })
  },
  watch: {},
  mounted() {
    if (this.listenHeight) {
      // 得到表格的高度
      this.tableHeight = this.getTableHeight()
      // 监听页面大小改变
      window.addEventListener('resize', () => {
        // 得到表格的高度
        this.tableHeight = this.getTableHeight()
      })
    }
  },
  methods: {
    doRefresh() {
      this.$emit('doRefresh');
      this.$notify({
        title: '刷新提示',
        message: '数据刷新通知完成...',
        position: 'bottom-right'
      });
    },
    getImgSrc(src) {
      if (src && !src.startsWith("http")) {
        src = this.imgSrc + src;
      }
      return src;
    },
    handleSortChange(row) {
      var sorts = {};
      if (row && row.prop && row.order) {
        sorts[row.prop] = (row.order.substr(0, 4) == 'desc') ? 'DESC' : 'ASC';
      }
      this.pagination.sortsChange(sorts);
    },
    handleSizeChange(val) {
      this.pagination.sizeChange(val)
    },
    handleCurrentChange(val) {
      this.pagination.currentChange(val)
    },
    // 选中数据
    handleSelectionChange(rows) {
      this.$emit('handleEvent', 'tableCheck', rows);
    },
    handleRowDBClick(rows, obj, evt) {
      this.$emit('handleEvent', 'tableDbClick', rows);
    },
    handleRowClick(rows, obj, evt) {
      this.$emit('handleEvent', 'tableClick', rows);
    },
    // 根据页面的头部, 功能框, 分页组件等高度，计算出table的高度
    getTableHeight() {
      // 当表格存在的时候才执行操作
      if (document.getElementsByClassName('el-table').length === 0) {
        return
      }
      const boxH = document.body.clientHeight
      const navH = document.getElementsByClassName('header')[0] ? document.getElementsByClassName('header')[0].clientHeight : 0
      const tagH = document.getElementsByClassName('tags')[0] ? document.getElementsByClassName('tags')[0].clientHeight : 0
      const searchH = document.getElementsByClassName('page-filter')[0] ? document.getElementsByClassName('page-filter')[0].clientHeight : 0
      const pagerH = document.getElementsByClassName('pagination')[0] || { clientHeight: 0 }
      const bottomH = pagerH.clientHeight ? pagerH.clientHeight : pagerH.clientHeight
      // - 35
      const tab = document.getElementsByClassName('el-table')[0] || {
        offsetTop: 0
      }
      const tabOffT = tab.offsetTop
      // 表格的高度 = 视口高度 - 表格到头部导航的距离 - 头部导航的高度137 - 分页组件的高度100 - 分页组件
      const HEIGHT = boxH - tabOffT - navH - tagH - searchH - bottomH - 2
      document.getElementsByClassName('el-table')[0].style.height = HEIGHT + 'px'
      this.$emit('changeHeight', HEIGHT)
      return HEIGHT
    }
  }
}
</script>
<style scoped lang="scss">
.img {
  vertical-align: middle;
}
.pagination {
  .el-button {
    vertical-align: middle;
  }
  .el-pagination {
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
