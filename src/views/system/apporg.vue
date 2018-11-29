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
      :filter-node-method="filterNode" highlight-current 
      @node-click="handleNodeClick"
      class="filter-tree" check-on-click-node 
       node-key="id" default-expand-all />
      </el-col>
       <el-col :span="18">
        <template>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="组织信息" name="first">
              <el-form ref="appapporgForm" :rules="rules" :model="currentapporg"  label-width="80px" class="demo-ruleForm form-width">
                <el-form-item label="组织编码" prop="code">
                  <el-input v-model="currentapporg.code"></el-input>
                  <el-input v-model="currentapporg.id" placeholder="组织id"  v-show="false"></el-input>
                </el-form-item>
                <el-form-item label="组织名称" prop="label">
                  <el-input v-model="currentapporg.label"></el-input>
                </el-form-item>
                <common-select label="组织类型" name="apporgType" prop="apporgType" placeholder="组织类型" 
                :qParam="{dictCode:'apporgType'}" url="/sys/dictItem/listNP" v-model="currentapporg.apporgType">            
                </common-select>  
                <el-form-item label="有效">
                  <el-radio-group v-model="currentapporg.enabled" prop="enabled">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <template v-if="isADD">
                  <el-form-item label="级别">
                  <el-radio-group v-model="currentapporg.isChild" prop="isChild">
                    <el-radio :label="false">同级</el-radio>
                    <el-radio :label="true">子级</el-radio>
                  </el-radio-group>
                </el-form-item>
                </template>
                <el-form-item class="last-item-position">
                  <el-button type="primary" @click="saveInfo('apporgForm')" >保 存</el-button>
                  <el-button type="danger" @click="cancel()" v-show="isADD">取消</el-button>
                  <el-button type="danger" @click="deleteDataToTree()" v-show="!isADD">删 除</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="用户分配" name="third" ref="userListTab" :disabled="showUserListTab">
              <template>
                <apporg-user-list v-bind:apporgId="currentapporg.id"></apporg-user-list>
              </template> 
            </el-tab-pane>
          </el-tabs>
        </template>
       </el-col>
    </el-row>
  </div>
</template>
<script>
import  apporgUserList from '@/views/system/apporgUserList'
import  commonSelect from '@/views/components/common-select'
var id=100;
export default {
   components: {
    apporgUserList,
    commonSelect
  },
  data() {
    return {
      showUserListTab : true,
      activeName: 'first',
      filterText: '',
      treeData: null,
      isADD:true,
      enabled:1,
      isChild:false,
      currentapporg:{
        label:'',
        code:'',
        pid:-1,
        id:-1,
        apporgType:null,
        enabled:1,
        isChild:false
      },
      rules: {
        label: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入部门编码', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        apporgType: [
          { required: true, message: '请选择组织类型', trigger: 'blur' }
        ],
        isChild: [
          { required: true, message: '请选择级别', trigger: 'blur' }
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
        this.showUserListTab = false
        this.isADD=false
        this.nodeData = data
        var jsonData = JSON.parse(JSON.stringify(data))
        this.currentapporg.label = jsonData.label
        this.currentapporg.code = jsonData.code
        this.currentapporg.id = parseInt(jsonData.id)
        this.currentapporg.apporgType = parseInt(jsonData.extra1)
        this.currentapporg.pid = parseInt(jsonData.pid)
        this.currentapporg.enabled = parseInt(jsonData.extra4)
    },
    fetchData(){
      this.$http({
        url: this.$http.adornUrl('/sys/apporg/getTreeList'),
        method: 'post',
        params: this.$http.adornParams({
          })
        }).then(({data}) => {
          if (data!=null) {
            this.treeData =data;
          }
        }) 
    },
    saveInfo(dataForm){
      var key=this.$refs.tree.getCurrentKey()
      var tPid = 0
      console.log(this.currentapporg)
      console.log(!(parseInt(this.currentapporg.id)>-1))
      if(key!=null)
      {
         var node=this.$refs.tree.getNode(key)
         tPid = this.currentapporg.isChild?node.data.id:node.data.pid
      }
      if((!(parseInt(this.currentapporg.id)>-1))&&this.currentapporg.isChild==null){
         this.$message.error('请确认已选择级别！')
         return
      }
       this.$refs[dataForm].validate(valid => {
        if (valid) {
          this.$http({
              url: this.$http.adornUrl(`/sys/apporg/${!(parseInt(this.currentapporg.id)>-1) ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'apporgId': this.currentapporg.id || undefined,
                'apporgCode': this.currentapporg.code,
                'apporgType': this.currentapporg.apporgType,
                'pid': tPid,
                'enabled': this.currentapporg.enabled,
                'apporgName': this.currentapporg.label
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.fetchData()
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
        } else {
          return false
        }
      })
    },
    //添加节点
    addNode(){
      this.activeName = 'first'
      this.showUserListTab = true
      this.isADD=true
      this.clearEditData()
    },
    //取消添加节点
    cancel(){  
      this.isADD=false
      var key=this.$refs.tree.getCurrentKey()
      var tPid = 0
      if(key!=null){
        var node=this.$refs.tree.getNode(key)
        tPid = this.currentapporg.isChild?node.data.id:node.data.pid
        this.nodeData = node.data
        var jsonData = JSON.parse(JSON.stringify(node.data))
        this.currentapporg.label = jsonData.label
        this.currentapporg.code = jsonData.code
        this.currentapporg.id = parseInt(jsonData.id)
        this.currentapporg.apporgType = parseInt(jsonData.extra1)
        this.currentapporg.pid = parseInt(jsonData.pid)
      }else{
        this.showUserListTab = false        
      }
    },
    //删除节点
    deleteDataToTree(){
      var key=this.$refs.tree.getCurrentKey()
      var tId = -1
      if(key!=null)
      {
         var node=this.$refs.tree.getNode(key)
         tId = node.data.id
      }else{
         this.$message.error('请确认已选择树节点！')
         return
      }
      var ids = [tId]
      this.$http({
        url: this.$http.adornUrl(`/sys/apporg/delete`),
        method: 'post',
        data: this.$http.adornData(
          ids,false
        )
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.fetchData()
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    clearEditData(){
      this.currentapporg.label=''
      this.currentapporg.apporgType=''
      this.currentapporg.code = ''
      this.currentapporg.pid = 0
      this.currentapporg.isChild=0
      this.currentapporg.id=-1
      this.currentapporg.children=[]
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