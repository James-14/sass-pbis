<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    @close="closeHandle"
    :visible.sync="visible">
    <el-upload
      drag
      :action="url"
      :before-upload="beforeUploadHandle"
      :on-success="successHandle"
      multiple
      :file-list="fileList"
      style="text-align: center;">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只支持{{suffix}}格式的图片！</div>
    </el-upload>
  </el-dialog>
</template>

<script>
import { getToken } from '@/utils/auth'
  export default {
    props: {
      title: {
        type: String,
        default: '上传文件'
      },
      suffix: {
        type: String,
        default: 'jpg,png,gif'
      },
      oUrl:{
        type:String,
        required:true
      },
      maxSize:{
        type:String,
        required:false,
        default:"5"
      }
    },
    data () {
      return {
        visible: false,
        num: 0,
        url:'',
        successNum: 0,
        fileList: []
      }
    },
    methods: {
      init (id) {
        this.url = this.$http.adornUrl(this.oUrl+"?Authorization=Bearer " + getToken())
        this.visible = true
      },
      // 上传之前
      beforeUploadHandle (file) {
        var fileSuffix = file.name.substring(file.name.lastIndexOf(".")+1)
        const fileMSize = file.size/1024/1024
        var suffixArr = this.suffix.split(",")
        if(!this.isInArray(suffixArr,fileSuffix)){
          this.$message.error('只支持以下几种格式的文件：'+this.suffix)
          return false
        }
        if(fileMSize>parseInt(this.maxSize)){
          this.$message.error("上传文件大小不能超过"+this.maxSize+"m")
          return false
        }
        this.num++
      },
      // 上传成功
      successHandle (response, file, fileList) {
        this.fileList = fileList
        this.successNum++
        if (response && response.code === 200) {
          if (this.num === this.successNum) {
              /*this.$confirm('操作成功, 是否继续操作?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).catch((close) => {
              
            })*/
            this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                }
            })
            
          }
        } else {
          this.$message.error(response.msg)
        }
      },
      // 弹窗关闭时
      closeHandle () {
        this.$emit('callbackUploadButton',this.fileList)
      },
      isInArray(a,b){
        var result = false;
        if(a instanceof Array){
          for(var i=0;i<a.length;i++){
            if(b===a[i]){
              result = true;
              break;
            }
          }
        }
        return result;
      }
    }
  }
</script>