<template>
  <div class="app-container">
    <el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="用户机构关系" prop="key">
        <el-input v-model="dataForm.key" placeholder="用户或机构的代码、名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="resetSearch">重置</el-button>
        <!-- <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">删除</el-button>
        <!-- <el-button v-if="isAuth('sys:userorg:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <!-- <el-button v-if="isAuth('sys:userorg:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">删除</el-button> -->
      	<el-button type="text" :icon="searchIcon" @click="adSearch">高级搜索</el-button>
      </el-form-item>
      <br/>
      <template v-if="seen">
        <el-form-item label="机构名称" prop="orgName">
          <el-input v-model="dataForm.orgName" suffix-icon="el-icon-view" @focus="orgTreeVisible=true" placeholder="机构名称"></el-input>
        </el-form-item>
        <el-form-item prop="orgId" v-show="false">
          <el-input v-model="dataForm.orgId" placeholder="机构ID" v-show="false"></el-input>
        </el-form-item>
        <tree-select-page :dialogVisible="orgTreeVisible" dialogTitle="选择机构"
        dialogWidth="30"  :closeTip="false" 
        v-on:select-confirm="selectOrgConfirm" 
        v-on:close-dialog="closeOrgTreeDialog"
        treeUrl="/sys/org/getTreeList"
        ></tree-select-page>
      </template>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <!-- <el-table-column
        prop="userOrgId"
        header-align="center"
        align="center"
        label="用户机构ID">
      </el-table-column> -->
      <!-- <el-table-column
        prop="userId"
        header-align="center"
        align="center"
        label="用户ID">
      </el-table-column> -->
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        label="用户名称">
      </el-table-column>
      <!-- <el-table-column
        prop="orgId"
        header-align="center"
        align="center"
        label="机构ID">
      </el-table-column> -->
      <el-table-column
        prop="orgName"
        header-align="center"
        align="center"
        label="机构名称">
      </el-table-column>
      <el-table-column
        prop="customerName"
        header-align="center"
        align="center"
        label="客户名称">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="isDefault"
        header-align="center"
        align="center"
        label="默认机构">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.userOrgId)">修改</el-button> -->
          <el-button type="text" size="small" @click="deleteHandle(scope.row.userOrgId)">删除</el-button>
          <!--<el-button v-if="isAuth('sys:userorg:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.userOrgId)">修改</el-button>-->
          <!--<el-button v-if="isAuth('sys:userorg:delete')" type="text" size="small" @click="deleteHandle(scope.row.userOrgId)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <div class="page-position">
	    <el-pagination
	      @size-change="sizeChangeHandle"
	      @current-change="currentChangeHandle"
	      :current-page="pageIndex"
	      :page-sizes="[10, 20, 50, 100]"
	      :page-size="pageSize"
	      :total="total"
	      layout="total, sizes, prev, pager, next, jumper">
	    </el-pagination>
	 </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './userorg-add-or-update'
  //import  treeSelectPage from '@/views/components/tree-select-page'
  import  treeSelectPage from '@/views/components/tree-select-single'
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        seen: false,
        searchIcon: 'el-icon-arrow-down',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        orgTreeVisible: false
      }
    },
    components: {
      AddOrUpdate,
      treeSelectPage
    },
    created () {
      this.getDataList()
    },
    methods: {
      selectOrgConfirm: function(selectData) {
        // var orgIds = new Array()
        // var orgNames = new Array()
        // for(var i =0;i<selectData.length;i++){
        //     orgIds.push(selectData[i].id)
        //     orgNames.push(selectData[i].label)
        // }
        // this.dataForm.orgId = orgIds.toString()
        // this.dataForm.orgName = orgNames.toString()
        this.dataForm.orgId = selectData.id
        this.dataForm.orgName = selectData.label
      },
      closeOrgTreeDialog() {
        this.orgTreeVisible = false
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/userorg/list'),
          method: 'post',
          params: this.$http.adornParams({
            'pageIndex': this.pageIndex,
            'pageSize': this.pageSize,
            'key': this.dataForm.key
          })
        }).then(({data}) => {
          if (data && data.list) {
            this.dataList = data.list
            this.total = parseInt(data.page.total)
          } else {
            this.dataList = []
            this.total = 0
          }
          this.dataListLoading = false
        })
      },
      adSearch() {
        this.seen = !this.seen
        this.searchIcon = this.seen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.userOrgId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/userorg/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      resetSearch(){
          this.$refs['searchForm'].resetFields()
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