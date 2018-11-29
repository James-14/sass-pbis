<template>
  <div class="app-container">
    <el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="查询关键字" prop="key">
        <el-input v-model="dataForm.key" placeholder="查询关键字" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="resetSearch">重置</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">删除</el-button>
        <!-- <el-button v-if="isAuth('sys:file:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <!-- <el-button v-if="isAuth('sys:file:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">删除</el-button> -->
      	<el-button type="text" :icon="searchIcon" @click="adSearch">高级搜索</el-button>
      </el-form-item>
      <br/>
      <template v-if="seen">
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
      <el-table-column
        prop="fileId"
                header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        width="100"
        label="id">
      </el-table-column>
      <el-table-column
        prop="fileName"
                header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        width="100"
        label="文件名">
      </el-table-column>
      <el-table-column
        prop="newFileName"
                header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        width="100"
        label="新文件名">
      </el-table-column>
      <el-table-column
        prop="customerId"
                header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        width="100"
        label="客户ID">
      </el-table-column>
      <el-table-column
        prop="appId"
                header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        width="100"
        label="应用ID">
      </el-table-column>
      <el-table-column
        prop="path"
                header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        width="100"
        label="路径">
      </el-table-column>
      <el-table-column
        prop="size"
                header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        width="100"
        label="文件大小">
      </el-table-column>
      <el-table-column
        prop="md5"
                header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        width="100"
        label="md5">
      </el-table-column>
      <el-table-column
        prop="suffix"
                header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        width="100"
        label="扩展名">
      </el-table-column>
      <el-table-column
        prop="module"
                header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        width="100"
        label="模块">
      </el-table-column>
      <el-table-column
        prop="businessId"
                header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        width="100"
        label="业务ID">
      </el-table-column>
      <el-table-column
        prop="createBy"
                header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        width="100"
        label="创建者">
      </el-table-column>
      <el-table-column
        prop="createDate"
                header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        width="100"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="remarks"
                header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        width="100"
        label="备注信息">
      </el-table-column>
      <el-table-column
        prop="delFlag"
                header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        width="100"
        label="删除标记">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.fileId)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.fileId)">删除</el-button>
          <!--<el-button v-if="isAuth('sys:file:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.fileId)">修改</el-button>-->
          <!--<el-button v-if="isAuth('sys:file:delete')" type="text" size="small" @click="deleteHandle(scope.row.fileId)">删除</el-button>-->
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
  import AddOrUpdate from './file-add-or-update'
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
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    created () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/file/list'),
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
          return item.fileId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/file/delete'),
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