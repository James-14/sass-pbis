<template>
  <el-upload
    class="avatar-uploader"
    :action="url"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload">
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
import { getToken } from '@/utils/auth'
  export default {
    props: {
      suffix: {
        type: String,
        default: 'jpg,png,gif'
      },
      aUrl:{
        type:String,
        required:true
      },
      aImageUrl:{
        type:String
      },
      maxSize:{
        type:String,
        required:false,
        default:"5"
      }
    },
    data () {
      return {
        num: 0,
        url:'',
        imageUrl:'',
        successNum: 0
      }
    },
    mounted:function(){
      this.init()
    },
    watch:{
    aImageUrl(curVal,oldVal){
　　　　　this.imageUrl=curVal
　　}
    },
    methods: {
      init (id) {
        this.url = this.$http.adornUrl(this.aUrl+"?Authorization=Bearer " + getToken())        
      },
      // 上传之前
      beforeAvatarUpload (file) {
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
      handleAvatarSuccess (res,file) {
        this.successNum++
        //console.log(res)
        if (res && res.code === 200) {
          this.$emit('avatarHandler',res.data)
          this.$message({
                message: '图片上传成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.imageUrl = URL.createObjectURL(file.raw);                  
                }
            })
        } else {
          this.$message.error(res.message)
        }
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
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 64px;
    height: 64px;
    line-height: 64px;
    text-align: center;
  }
  .avatar {
    width: 64px;
    height: 64px;
    display: block;
  }
</style>
