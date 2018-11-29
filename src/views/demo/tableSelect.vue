<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-button type="primary" @click="dialogVisible=true">选择用户</el-button>
         <el-button type="primary" @click="treeVisible=true">选择树</el-button>
         <el-button type="primary" @click="asynVisible=true">异步树</el-button>
      </el-form-item>
    </el-form>
    <customer-select-page :dialogVisible="dialogVisible" dialogTitle="选择用户"
    dialogWidth="70" :isMultip="false" :closeTip="false" name="1"
    v-on:select-confirm="selectConfirm" v-on:close-dialog="closeDialog"
    ></customer-select-page>

   <tree-select-page :dialogVisible="treeVisible" dialogTitle="选择部门"
    dialogWidth="30"  :closeTip="false"
    v-on:select-confirm="selectConfirm" v-on:close-dialog="closeTreeDialog"
    treeUrl="http://127.0.0.1/searchtree" :conditions="{type:'001',name:'sany'}"
    ></tree-select-page>

      <tree-asynchronous :dialogVisible="asynVisible" dialogTitle="异步加载树"
    dialogWidth="30"  :closeTip="false"
    v-on:select-confirm="selectConfirm" v-on:close-dialog="closeasynTreeDialog"
    treeUrl="http://127.0.0.1/searchtree" :conditions="{type:'001',name:'sany'}"
    ></tree-asynchronous>

  </div>
</template>

<script>
  import  customerSelectPage from '@/views/components/customer-select-page'
  import  treeSelectPage from '@/views/components/tree-select-page'
   import  treeAsynchronous from '@/views/components/tree-asynchronous'

export default {
  components: {
    customerSelectPage,
    treeSelectPage,
    treeAsynchronous
  },
  data() {
    return {
        dialogVisible: false,
        treeVisible: false,
        asynVisible:false
  }
  },
  methods: {
    closeDialog() {
      this.dialogVisible = false
    },
    closeTreeDialog() {
      this.treeVisible = false
    },
    selectConfirm: function(selectData) {
      console.log(selectData)
    },
    closeasynTreeDialog(){
      this.asynVisible=false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.page-position {
  margin-top: 20px;
  text-align: center;
}
.el-row {
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}
.input-date-class{
    width: 140px;
}
</style>

   