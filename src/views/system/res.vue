<template>
  <div class="app-container">
    <el-row :gutter="15">
      <el-col :span="4" class="cell-border">
        <!-- <el-row :gutter="1">
          <el-col :span="15">
            <el-input class="set-search-input" size="small" v-model="filterText" placeholder="Filter keyword" />
          </el-col>
          <el-col :span="9">
            <el-button-group class="cellrow-cell">
              <el-button plain size="small" icon="el-icon-search" @click="searchNode"></el-button>
            </el-button-group>
          </el-col>
        </el-row> -->
      <el-tree ref="tree" :data="treeData" :props="defaultProps" 
      :filter-node-method="filterNode" highlight-current
      @node-click="handleNodeClick"
      class="filter-tree" check-on-click-node 
       node-key="id" />
      </el-col>
       <el-col :span="20">
        <template>
            <tree-table-list v-bind:resType="currentTree.id" ref="resTableList"></tree-table-list>
        </template>
       </el-col>
    </el-row>
  </div>
</template>
<script>
import  treeTableList from '@/views/system/resTableList'
import { getToken, getAPPID } from '@/utils/auth' // 验权
var id=100;
export default {
   components: {
    treeTableList
  },
  data() {
    return {
      filterText: '',
      treeData: null,
      isADD:true,
      currentTree:{
        label:'',
        id:-1,
        address:''
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // searchNode(){
    //   this.$refs.tree.filter(this.filterText)
    // },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick(data) {
        this.isADD=false
        this.nodeData = data
        // console.log(this.nodeData)
        this.$refs.resTableList.changeIsInitComplete()
        this.currentTree= JSON.parse(JSON.stringify(data))
    },
    fetchData(){
      this.$http({
        url: this.$http.adornUrl('/sys/dictItem/getTreeList'),
        method: 'post',
        params: this.$http.adornParams({
           'dictId':6,
          })
        }).then(({data}) => {
          if (data!=null) {
            this.treeData=data;
          }
        })  
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .set-search-input{
    margin-bottom: 10px !important;
    margin-top: 15px;
  }
  .input .el-input__inner{
    height: 35px;
  }
  .cell-border{
    border-right: 1px solid #e4e7ed;
    min-height: 800px
  }
  .cellrow-cell{
    margin-top: 15px;
  }
  .form-width{
    width:350px
  }
</style>


