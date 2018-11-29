<template>
   <el-button type="primary" @click="resetSearch">重 置</el-button>
</template>

<script>
  export default {
    props: {
      name:String,
    },
    methods: {
      resetSearch(){       
        console.log(this.$root.currentPage)
        //this.$parent.$refs['searchForm'].resetFields() 
        // this.$refs[this.name].resetFields()
       
      }
    }
  }
</script>