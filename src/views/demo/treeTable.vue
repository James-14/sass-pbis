<template>
  <div class="app-container">
    <el-row :gutter="15">
      <el-col :span="6" class="cell-border">
        <el-row :gutter="1">
          <el-col :span="15">
            <el-input class="set-search-input" size="small" v-model="filterText" placeholder="Filter keyword" />
          </el-col>
          <el-col :span="9">
            <el-button-group class="cellrow-cell">
            <el-button plain size="small" icon="el-icon-search" @click="searchNode"></el-button>
              <el-button plain size="small" icon="el-icon-plus" @click="addNode"></el-button>
            </el-button-group>
          </el-col>
        </el-row>
      <el-tree ref="tree" :data="treeData" :props="defaultProps" 
      :filter-node-method="filterNode" highlight-current @node-click="handleNodeClick"
      class="filter-tree" check-on-click-node 
       node-key="id" default-expand-all />
      </el-col>
       <el-col :span="18">
        <template>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="机构信息" name="first">
        <el-form ref="deptform" :rules="rules" :model="currentDept"  label-width="80px" class="demo-ruleForm form-width">
        <el-form-item label="部门名称" prop="label">
          <el-input v-model="currentDept.label"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="currentDept.address"></el-input>
        </el-form-item>
        <template v-if="isADD">
           <el-form-item label="级别">
          <el-radio-group v-model="isChild">
            <el-radio :label="false">同级</el-radio>
            <el-radio :label="true">子级</el-radio>
          </el-radio-group>
        </el-form-item>
        </template>
        <el-form-item class="last-item-position">
          <el-button type="primary" @click="saveInfo('deptform')" >保 存</el-button>
          <el-button type="danger" @click="deleteDataToTree()">删 除</el-button>
        </el-form-item>
      </el-form>
            </el-tab-pane>
          <el-tab-pane label="机构人员" name="second">
            <tree-table-list></tree-table-list>    
          </el-tab-pane>
          </el-tabs>
        </template>
       </el-col>
    </el-row>
  </div>
</template>
<script>
import  treeTableList from '@/views/demo/treeTableList'
var id=100;
export default {
   components: {
    treeTableList
  },
  data() {
    return {
      activeName: 'first',
      filterText: '',
      treeData: null,
      isADD:true,
      isChild:null,
      currentDept:{
        label:'',
        id:-1,
        address:''
      },
      rules: {
        label: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    this.treeData=this.fetchData()
  },
  methods: {
    searchNode(){
      this.$refs.tree.filter(this.filterText)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleClick(tab, event) {
        console.log(tab, event)
    },
    handleNodeClick(data) {
        this.isADD=false
        this.nodeData = data
        this.currentDept= JSON.parse(JSON.stringify(data))
    },
    fetchData(){
      let dept=[{
          id: 1,
          parentID: 0,
          label: '筑工',
          children: [
            {
              id: 2,
              parentID: 1,
              label: '数字化',
              address: '北京',
              children: [
                {
                  id: 3,
                  parentID: 2,
                  label: '平台研发',
                  address: '北京'
                },
                {
                  id: 4,
                  parentID: 2,
                  label: 'SPCI研发',
                  address: '长沙',
                }
              ]
            }
          ]
        }]
        return dept
    },
    saveInfo(deptform){
       this.$refs[deptform].validate(valid => {
        if (valid) {
          if(this.isADD){
            this.addDataToTree(this.currentDept)
          }
          else
          {
            this.updateDataToTree(this.treeData,this.currentDept)
          }
        } else {
          return false
        }
      })
    },
    //添加节点
    addNode(){
      this.isADD=true
      this.clearEditData()
    },
    //删除节点
    deleteDataToTree(){
      var key=this.$refs.tree.getCurrentKey()
      var node=this.$refs.tree.getNode(key)
      this.$refs.tree.remove(node)     
    },
    //修改节点
    updateDataToTree(treeData,resData){
      var key=this.$refs.tree.getCurrentKey()
      var node=this.$refs.tree.getNode(key)
      node.data.label=resData.label 
    },
    addDataToTree(editData){
      let addData=JSON.parse(JSON.stringify(editData))
      addData.id=++id
      var key=this.$refs.tree.getCurrentKey()
      var nodeID=1
      if(key!=null)
      {
         var node=this.$refs.tree.getNode(key)
         nodeID=(this.isChild || node.data.parentID==0)?node.data.id:node.data.parentID
      }
      this.$refs.tree.append(addData,nodeID)
      this.clearEditData()
    },
    clearEditData(){
      this.currentDept.label=''
      this.currentDept.address=''
      this.currentDept.id=-1
      this.currentDept.children=[]
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


