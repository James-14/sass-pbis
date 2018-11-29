<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-button type="primary" @click="uploadHandle()">上传文件</el-button>
      </el-form-item>
    </el-form>
    <!-- 弹窗, 上传文件 -->
    <file-upload-page v-if="uploadVisible" ref="upload" oUrl="/test/upload" @callbackUploadButton="callbackUploadButtonFun"
    title="客户类型1" suffix="doc,jpg,png"></file-upload-page>
  </div>
</template>

<script>
import fileUploadPage from '@/views/components/file-upload-page'

export default {
  components: {
    fileUploadPage
  },
  data() {
    return {
        uploadVisible: false
    }
  },
  methods: {
    // 获取数据列表
    callbackUploadButtonFun (value) {
      console.log(value)
      //this.$emit('callbackUpload',value)
    },
    // 上传文件
    uploadHandle () {
      this.uploadVisible = true
      this.$nextTick(() => {
        this.$refs.upload.init()
      })
    }
  }
}
</script>