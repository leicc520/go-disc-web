<template>
  <el-upload class="file-uploader" :action="action" :accept="accept" :limit="limit" :data="data" :multiple="multiple"
    :file-list="fileList"  :headers="headers" :on-success="onSuccess" :on-errir="onError" :before-upload="beforeAvatarUpload" :show-file-list="false">
    <el-button slot="trigger" size="small" type="primary">{{Slabel}}</el-button>
  </el-upload>
</template>
<script>
import { Message,Loading } from 'element-ui'
import {appToken,BaseURL,writeLog} from '@/libs/core.js'
export default {
  props: {
    fileList: {
      type: Array,
      default: () => []
    },
    data: {
      type: Object,
      default: () => {}
    },
    value: {
      type: String | Array,
      default: null
    },
    name: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    accept: {
      type: String,
      default: () => 'image/gif, image/jpeg, image/jpg, image/png, image/svg'
    },
    multiple: {
      type: Boolean,
      default: () => false
    },
    limit: {
      type: Number,
      default: () => 9
    }
  },
  data() {
    return {
      loading: null,
      url : this.value,
      headers: {
        Signature:appToken(false)
      },
      action: BaseURL + "/api/core/upfile/image"
    }
  },
  computed:{
    Slabel() {
      if (!this.label) {
        return (this.url)? '已上传设置':'选取文件';
      }
      return this.label;
    }
  },
  methods: {
    onSuccess(response, file, fileList) {
      if (this.loading) {
        this.loading.close();
        this.loading = null;
      }
      if (response && response.code == 0) {
        this.url = response.datas.src;
      }
      this.$emit('onFileChange', {file:response.datas, value: this.name});
    },
    onError(err, file, fileList) {
      writeLog(1, [err, file, fileList]);
      if (this.loading) {
        this.loading.close();
        this.loading = null;
      }
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        Message({message: '上传图片大小不能超过 2MB!', type: 'error', duration: 3 * 1000});
      }
      if (isLt2M) {//验证通过的情况
        this.loading = Loading.service({ fullscreen: true });
      }
      return isLt2M;
    }
  }
}
</script>
