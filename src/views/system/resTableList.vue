<template>
  <div class="app-container">
    <el-form :inline="true" ref="searchForm" :model="dataForm" class="demo-form-inline">
      <el-form-item label="资源" prop="key">
        <el-input v-model="dataForm.key" placeholder="查询关键字" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="resetSearch">重置</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()" :disabled="isInitComplete">新增</el-button>
        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">删除</el-button>
        <!-- <el-button v-if="isAuth('sys:res:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
          <el-button v-if="isAuth('sys:res:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">删除</el-button> -->
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
        prop="resCode"
                header-align="center"
        align="center"
        label="资源代码">
      </el-table-column>
      <el-table-column
        prop="resName"
                header-align="center"
        align="center"
        label="资源名称">
      </el-table-column>
      <el-table-column
        prop="resType"
                header-align="center"
        align="center"
        label="资源类型">
      </el-table-column>
      <el-table-column
        prop="url"
                header-align="center"
        align="center"
        label="映射路径">
      </el-table-column>
      <el-table-column
        prop="appName"
                header-align="center"
        align="center"
        label="应用">
      </el-table-column>
      <el-table-column
        prop="remark"
                header-align="center"
        align="center"
        label="备注">
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="130">
        <template slot-scope="scope">
          <!-- 
          <el-button v-show='scope.row.edit' type="success" @click='scope.row.edit=false' size="small" icon="check">完成</el-button> -->
          <el-row>
            <el-button type="text" icon='el-icon-edit' @click='addOrUpdateHandle(scope.row.resId)' size="small">编辑</el-button>
            <el-button type="text" icon='el-icon-delete' @click='deleteHandle(scope.row.resId)' size="small">删除</el-button>
          </el-row>
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
import { getList } from '@/api/table'
import AddOrUpdate from './res-add-or-update'
import { getToken, getAPPID } from '@/utils/auth' // 验权

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
      resType: {
        type: Number,
        default: -1
      }
  },
  watch: {
    resType(){
      this.getDataList()
    }
  },
  data() {
    return {
      isInitComplete : true,
      dataList: null,
      seen: false,
      dataListLoading: true,
      dataListSelections: [],
      total: 50,
      currentPage: 1,
      dataStatus:[],
      searchIcon: 'el-icon-arrow-down',
      dataForm: {
        key: ''
      },
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
  },
  created() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      this.dataListLoading = true
      this.$http({
          url: this.$http.adornUrl('/sys/res/list'),
          method: 'post',
          params: this.$http.adornParams({
            'pageIndex': this.pageIndex,
            'pageSize': this.pageSize,
            'key': this.dataForm.key,
            'resType':this.resType,
            'appId':getAPPID(),
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
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.resId
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/sys/res/delete'),
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
    adSearch() {
      this.seen = !this.seen
      this.searchIcon = this.seen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
    },
    resetSearch(){
        this.$refs['searchForm'].resetFields()
    },
    changeIsInitComplete(){
        this.isInitComplete = false
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

   