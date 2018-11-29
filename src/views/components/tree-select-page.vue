<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :width="pageWidth" 
  :before-close="handleClose" append-to-body>   
      <el-row :gutter="1">
          <el-col :span="15">
            <el-input class="set-search-input" size="small" v-model="filterText" placeholder="Filter keyword" />
          </el-col>
          <el-col :span="9">
            <el-button-group class="cellrow-cell">
            <el-button plain size="small" icon="el-icon-search" @click="searchNode"></el-button>
            <el-button size="small"  @click="selectConfirm">确定</el-button>
            </el-button-group>
          </el-col>
        </el-row>     
     <el-tree show-checkbox ref="tree" :data="treeData" :props="defaultProps" 
      :filter-node-method="filterNode" highlight-current
      class="filter-tree" check-on-click-node 
       node-key="id" default-expand-all />
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
    treeUrl:String,
    conditions:Object
  },
  data () {
      return {
        treeData: null,
        dataListLoading: false,
        currentData:null,
        filterText:'',
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
},
computed:{
  pageWidth:function(){
    return this.dialogWidth+"%"
  }
},
created () {
      this.getDataList()
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
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    searchNode(){
      this.$refs.tree.filter(this.filterText)
    },
       // 获取数据列表
    getDataList () {
        //console.log(this.treeUrl)
        //console.log(this.conditions)
        this.dataListLoading = true
         this.$http({
          url: this.$http.adornUrl(this.treeUrl),
          method: 'post',
          params: this.$http.adornParams(this.conditions)
        }).then(({data}) => {
          let dept = null
          if (data!=null) {
            dept  = data;
          }
          this.dataListLoading = false
          //console.log(dept);
          this.treeData=dept
        })
      },
      //选中返回事件
      selectConfirm(){
        var nodeList=this.$refs.tree.getCheckedNodes(true) 
        this.$emit('select-confirm', nodeList)
        this.$emit('close-dialog')
      }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
