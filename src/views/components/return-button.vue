<template>
   <el-button type="primary" @click="gotoBack">返 回</el-button>
</template>

<script>
  export default {
    props: {
      path:String,
    },
    methods: {
      gotoBack(){        
        // console.log(this.path)
        var reg=new RegExp('-','g')
        var url=''
        if(this.path.substr(0,1)!='/')
        {
          url='/'
        }
        url=url+this.path.replace(reg,'/')
        this.$router.push({path: url})
      }
    }
  }
</script>