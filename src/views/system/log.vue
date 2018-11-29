<template>
  <div class="app-container">
    <el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter.native="getDataList()" class="demo-form-inline">
      <el-form-item prop="key">
        <el-input v-model="dataForm.key" placeholder="日志" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="resetSearch">重置</el-button>
        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">删除</el-button>
        <!-- <el-button type="danger" @click="deleteAll()">清空日志</el-button> -->
        <el-button type="text" :icon="searchIcon" @click="adSearch">高级搜索</el-button>
      </el-form-item>
      <br/>
      <template v-if="seen">
        <el-form-item label="日期" prop="beginTime">
          <el-date-picker class="input-date-class" v-model="dataForm.beginTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        &nbsp;&nbsp;-&nbsp;&nbsp;
        <el-form-item prop="endTime">
          <el-date-picker class="input-date-class" v-model="dataForm.endTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
        </el-form-item>
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
        prop="logType"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        width="100"
        label="日志类型">
      </el-table-column>
      <!-- <el-table-column
        prop="logId"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        width="100"
        label="日志ID"> -->
      <el-table-column
        prop="logName"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        width="100"
        label="日志名称">
      </el-table-column>
      <el-table-column
        prop="appName"
        header-align="center"
        align="center"
        label="应用">
      </el-table-column>
      <el-table-column
        prop="moduleName"
        header-align="center"
        align="center"
        label="模块">
      </el-table-column>
      <el-table-column
        prop="createName"
        header-align="center"
        align="center"
        label="创建人">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="message"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="备注">
      </el-table-column>
      <el-table-column
        prop="succeed"
        header-align="center"
        align="center"
        label="是否成功">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.succeed === '1'" size="small" >成功</el-tag>
          <el-tag v-else size="small" type="danger">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" icon='el-icon-delete' size="small" @click="deleteHandle(scope.row.logId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-position">
      <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-size="pageSize"
      :total="total"
      :page-sizes="[10, 100, 200, 300]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          logName: '',
          beginTime: '',
          endTime: ''
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
    created () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/log/list'),
          method: 'post',
          params: this.$http.adornParams({
            'pageIndex': this.pageIndex,
            'pageSize': this.pageSize,
            'beginTime': this.dataForm.beginTime,
            'endTime': this.dataForm.endTime,
            'logName': this.dataForm.logName
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
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.logId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/log/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
            // params: {
            //   customerIds: ids
            // }
            // params: this.$http.adornParams({
            //   'customerIds': ids
            // })
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

      //清空
      deleteAll(){
        this.$confirm(`确定清空日志吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/log/deleteAll'),
            method: 'post',
            data: this.$http.adornData(null, false)
            // params: {
            //   customerIds: ids
            // }
            // params: this.$http.adornParams({
            //   'customerIds': ids
            // })
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