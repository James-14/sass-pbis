<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :width="pageWidth" 
  :before-close="handleClose" :modal="false"  class="dialog-div">   

<el-card v-for="card in radioArray" :key="card.customerId" class="box-card" shadow="never">
  <div slot="header" class="clearfix">
    <span>{{card.customerName}}</span>
    <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
  </div>
  <template>
        <el-radio v-for="item in card.subAppList"  v-model="appID" :label="item.app_id" :key="item.app_id">
          {{item.app_name}}
        </el-radio>
  </template>    
</el-card>
<div class="submit-div">
        <el-button size="small"  @click="selectConfirm">确定</el-button>
</div>
</el-dialog>
</template>

<script>
import clearObject from '@/utils/clear-object' // 验权

export default {
  props: {
    dialogVisible: Boolean,
    dialogTitle: String,
    dialogWidth: String,
    closeTip:Boolean,
    radioArray:Array,
    defaultID:Number
  },
  data () {
      return {
        appID: this.defaultID
      }
},
computed:{
  pageWidth:function(){
    return this.dialogWidth+"%"
  }
},
watch:{
    defaultID(curVal,oldVal){
　　　　　this.appID=curVal
　　}
},
methods: {
    handleClose(done) {
      if(!this.closeTip)
      {
          this.$emit('close-dialog')
      }
      else{
         this.$confirm('确认关闭？')
        .then(_ => {
          this.$emit('close-dialog')
        })
        .catch(_ => {})
      }
    },
      //选中返回事件
    selectConfirm(){
        let customer=this.searchCustomerID()
        this.$emit('select-confirm', this.appID, customer)
        this.$emit('close-dialog')
      },
    searchCustomerID(){
      var customerID=-1
      var customerName=''
      for(var i=0; i<this.radioArray.length; i++){
        var element=this.radioArray[i]
        for(var j=0; j<element.subAppList.length; j++){
          var subApp=element.subAppList[j]
          if(subApp.app_id==this.appID){
            customerID=subApp.customer_id
            customerName=subApp.customer_name
            break
          }
        }
      }
      return {customerID,customerName}
    }
 
 }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.submit-div {
    margin-top: 20px;
    text-align: right;
  }
  .dialog-div{
    margin-top: 80px;
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    border:0px
  }
</style>

