<template>
  <div class="app-container">
    <file-upload-button @callbackUpload="callbackUploadFun"></file-upload-button>
    <avatar-upload ref="upload" aUrl="/test/upload" @avatarHandler="avatarHandler" suffix="jpg,png,gif"></avatar-upload>
  </div>
</template>

<script>
import fileUploadButton from '@/views/components/file-upload-button'
import avatarUpload from '@/views/components/avatar-upload'

export default {
  components: {
    fileUploadButton,
    avatarUpload
  },
  data() {
    return {
    }
  },
  methods: {
    // 获取数据列表
    callbackUploadFun (value) {
      console.log('回调父页面==>参数'+value);
    },
    avatarHandler(value){
      console.log(value)
    }
  }
}
</script>