<template>
  <el-form ref="form" class="page-form" :class="className" :model="data" size="mini" :inline="inline" :rules="rules" label-position="right"
    :label-width="labelWidth">
    <div v-for="(item, index) in getConfigList()" :key="index" class="form_box" :class="item.className">
      <el-form-item :prop="item.value" :label="item.label" :label-width="(item.labelWidth)? item.labelWidth:labelWidth"
        :style="`width:${item.width}`">
        <!-- solt -->
        <template v-if="item.type === 'slot'">
          <slot :name="'form-' + item.value" />
        </template>
        <!-- 普通输入框 -->
        <el-input v-if="item.type === 'input' || item.type === 'password' || item.type === 'number'" v-model="data[item.value]"
          :type="item.type" :disabled="item.disabled" :placeholder="getPlaceholder(item)" @focus="handleEvent(item.event,data[item.value])">
          <template v-if="item.append" slot="append">{{ item.append }}</template>
        </el-input>
        <el-autocomplete v-if="item.type === 'inputSearch'" v-model="data[item.RawValue]" :fetch-suggestions="autocompleteFilter"
          placeholder="请输入内容" @select="autocompleteSelect" @focus="handleEvent('focus', index)" />
        <!-- 文本输入框 -->
        <el-input v-if="item.type === 'textarea'" v-model="data[item.value]" :type="item.type" :disabled="item.disabled"
          :placeholder="getPlaceholder(item)" :autosize="item.autosize || {minRows: 2, maxRows: 10}" @focus="handleEvent(item.event)" />
        <!-- 连级下拉框 -->
        <el-cascader v-if="item.type === 'cascader'" v-model="data[item.value]" :options="listTypeInfo[item.option]"
          :props="{ expandTrigger: item.expandTrigger }" :multiple="item.multiple" />
        <!-- 单选框 -->
        <el-radio-group v-if="item.type === 'radio'" v-model="data[item.value]">
          <el-radio v-for="(radio, radioIndex) in listTypeInfo[item.option]" :key="radioIndex" :label="radio.value">{{ radio.label }}
          </el-radio>
        </el-radio-group>
        <!-- 多选框 -->
        <el-checkbox-group v-if="item.type === 'checkbox'" v-model="data[item.value]"
          @change="checkboxChange(item.event,data[item.value],item)">
          <el-checkbox v-for="(cItem, cIdx) in listTypeInfo[item.option]" :key="cIdx" :label="(cItem.length > 0)? cItem[0]:cItem.id">
            {{(cItem.length > 0)? cItem[1]:cItem.name}}</el-checkbox>
        </el-checkbox-group>
        <!-- 图片上传 -->
        <STupfile v-if="item.type === 'file'" :name="item.value" @onFileChange="onFileChange" :value="data[item.value]"
          :accept="item.accept" :limit="item.limit" :multiple="(item.multiple)? true:false" :data="item.data">
        </STupfile>
        <!-- 计数器 -->
        <el-input-number v-if="item.type === 'inputNumber'" v-model="data[item.value]" size="small" :min="item.min" :max="item.max"
          @change="handleEvent(item.event)" />
        <!-- 选择框 -->
        <el-select v-if="item.type === 'select'" v-model="data[item.value]" :disabled="item.disabled"
          :clearable="(item.clearable === false)? false:true" :remote="item.remote" :filterable="(item.filterable === false)? false:true"
          :placeholder="getPlaceholder(item)" :loading="(item.loading)? true:false" @focus="doFocus((item.remote || item.focus),index)"
          @change="selectChange(item.event,data[item.value],item)" :multiple="item.multiple" :remote-method="remoteMethod">
          <el-option v-for="(childItem, childIndex) in listTypeInfo[item.option]" :key="childIndex" :label="childItem[1]"
            :value="childItem[0]" />
        </el-select>
        <!-- 日期选择框 -->
        <el-time-picker v-if="item.type === 'time'" v-model="data[item.value]" is-range size="mini" value-format="HH:mm:ss"
          range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" />
        <el-date-picker v-if="item.type === 'month'" v-model="data[item.value]" type="month" placeholder="选择月" />
        <el-date-picker v-if="item.type === 'date'" v-model="data[item.value]" :type="item.dateType"
          :picker-options="item.TimePickerOptions" :clearable="item.clearable" :disabled="item.disabled" :placeholder="getPlaceholder(item)"
          start-placeholder="开始日期" end-placeholder="结束日期" :value-format="(item.format)? item.format:'yyyy-MM-dd'"
          @focus="handleEvent(item.event)" />
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import STupfile from '@/components/common/STupfile'
export default {
  name: 'PageForm',
  components: {
    STupfile
  },
  props: {
    // 自定义类名
    className: {
      type: String,
      default: ''
    },
    // 表单数据
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 相关字段
    fieldList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 验证规则
    rules: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 相关的列表
    listTypeInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // label宽度
    labelWidth: {
      type: String,
      default: '120px'
    },
    refObj: {
      type: Object,
      default: null
    },
    inline: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      findex: 0//聚焦的
    }
  },
  watch: {
    data: {
      handler: function (val) {
        // 将form实例返回到父级
        this.$emit('update:refObj', this.$refs.form)
      },
      deep: true // 深度监听
    }
  },
  mounted() {
    // 将form实例返回到父级
    this.$emit('update:refObj', this.$refs.form)
  },
  methods: {
    // 获取字段列表
    getConfigList() {
      return this.fieldList.filter(
        item => !item.hasOwnProperty('show') || (item.hasOwnProperty('show') && item.show)
      )
    },
    // 得到placeholder的显示
    getPlaceholder(row) {
      let placeholder;
      if (row.placeholder) {
        placeholder = row.placeholder;
      } else if (row.type === 'input' || row.type === 'textarea') {
        placeholder = '请输入内容';
      } else if (
        row.type === 'select' || row.type === 'time' || row.type === 'date'
      ) {
        placeholder = '请选择';
      } else {
        placeholder = row.label;
      }
      return placeholder;
    },
    selectChange(evnet, data, item) {
      if (item.isName) {
        this.data[item.value] = data.value;
        if (item.index) {
          this.fieldList[item.index].id = (data && data.code) ? data.code : 0;
        }
      } else {
        if (item.index) {
          this.fieldList[item.index].id = (data) ? data : 0;
        }
      }
    },
    checkboxChange(event, checks, item) {
      if (item && item.attchsField) {
        this.data[item.attchsField] = [];
        var options = this.listTypeInfo[item.option];
        for (var idx = 0; idx < options.length; idx++) {
          var value = (options[idx].length) ? options[idx][0] : options[idx].id;
          if (checks.indexOf(value) !== -1) {
            this.data[item.attchsField].push(options[idx]);
          }
        }
      }
    },
    // 聚焦时
    async doFocus(focus, index) {
      if (focus) {
        this.findex = index;
        this.fieldList[index].loading = true;
        await this.getStoreDict(this.fieldList[index].store, '');
        this.fieldList[index].loading = false;
      }
    },
    async autocompleteFilter(query, cb) {
      let newopts = [];
      let item = this.fieldList[this.findex];
      if (!!query && item && item.store) {
        await this.getStoreDict(item.store, query);
        let options = this.listTypeInfo[item.option];
        for (let i = 0; i < options.length; i++) {
          newopts.push({ value: options[i][1], id: options[i][0] });
        }
      }
      cb(newopts);
    },
    async autocompleteSelect(sitem) {
      let item = this.fieldList[this.findex];
      this.data[item.value] = sitem.id;
    },
    async remoteMethod(query) {
      if (!!query) {
        this.fieldList[this.findex].loading = true;
        await this.getStoreDict(this.fieldList[this.findex].store, query);
        this.fieldList[this.findex].loading = false;
      }
    },
    async getStoreDict(url, query) {
      let item = this.fieldList[this.findex], selected = [];
      let selectedIds = this.data[item.value];
      if (!query && (Array.isArray(selectedIds) && selectedIds.length > 0)) {
        return;
      }
      let args = { query: query };
      if (item.argsStore) {//关联查询情况
        args = Object.assign(args, item.argsStore);
        for (var field in item.argsStore) {
          if(this.data[field] && item.argsStore[field]) {
            args[field] = this.data[field];
          }
        }
      }
      if (Array.isArray(selectedIds) && selectedIds.length) {
        for (let index in this.listTypeInfo[item.option]) {
          if (selectedIds.indexOf(this.listTypeInfo[item.option][index][0]) != -1) {
            selected.push(this.listTypeInfo[item.option][index]);
          }
        }
        args = Object.assign(args, { selected: selected, selectedIds: selectedIds });
      }
      await this.$store.dispatch(url, args);
    },
    // 绑定的相关事件
    handleEvent(evnet, data) {
      this.index = data;
      this.$emit('handleEvent', evnet, data);
    },
    editorReady(editor) {
      if (editor && editor.field) {
        editor.setText(this.data[editor.field]);
      }
      if (editor && editor.instance) {
        editor.instance.addListener('contentChange', () => {
          this.data[editor.field] = editor.instance.getContent();
        });
      }
    },
    onFileChange(data) {
      this.$emit('handleEvent', 'fileChange', data);
    },
    onError(err, file, fileList) {
      this.$message({
        showClose: true,
        message: err.message,
        type: 'error'
      })
    }
  }
}
</script>
<style lang="scss">
// 自定义form相关
.form_box {
  display: inline-block;
}
.block {
  display: block !important;
  width: 100%;
}
.ql-container {
  min-height: 200px;
}

.file-uploader .el-upload--text {
  width: auto;
  height: 100%;
}

// 自定义form相关
.page-form {
  display: flex;
  flex-wrap: wrap;

  &.el-form--inline {
    .el-form-item {
      padding-right: 0px;
      width: 150px;
    }
  }

  .el-checkbox {
    margin-left: 0px;
  }

  .el-form-item {
    display: flex;
    padding-right: 15px;
    width: 33%;
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 100%;
    }
    .el-select {
      display: flex;
      flex: 1;
    }
    .el-form-item__content {
      flex: 1;
      margin: 0 !important;
      .el-input-number {
        .el-input {
          width: inherit;
        }
      }
    }
  }

  .el-form-block {
    display: block;
    width: 100%;

    .el-form-item__content {
      flex: 1;

      .el-textarea {
        width: 100%;
      }
    }
  }
}

.page-form-block {
  .el-form-item {
    display: block;

    .el-form-item__content {
      flex: 1;

      .el-input,
      .el-select,
      .el-textarea,
      .el-cascader {
        width: inherit;
      }

      .el-input-number {
        .el-input {
          width: inherit;
        }
      }
    }
  }

  .el-form-block {
    display: block;
    width: 100%;

    .el-form-item__content {
      flex: 1;

      .el-textarea {
        width: 100%;
      }
    }
  }
}
</style>
