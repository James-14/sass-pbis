<template>
  <div class="app-container">
    <el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="应用名称" prop="appName">
        <el-input v-model="dataForm.appName" placeholder="应用名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="resetSearch">重置</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">删除</el-button>
        <!-- <el-button v-if="isAuth('sys:appmodule:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <!-- <el-button v-if="isAuth('sys:appmodule:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">删除</el-button> -->
        <el-button type="text" :icon="searchIcon" @click="adSearch">高级搜索</el-button>
      </el-form-item>
     <br/>
      <template v-if="seen">
        <el-form-item label="应用码" prop="appCode">
          <el-input v-model="dataForm.appCode" placeholder="应用码" clearable></el-input>
        </el-form-item>
        <el-form-item label="应用类型" prop="appType">
          <dict-select label="应用类型" prop="appType" placeholder="应用类型" dictCode="appType" v-model="dataForm.appType">            
          </dict-select>
        </el-form-item>
        <el-form-item label="模块名称" prop="moduleName">
          <el-input v-model="dataForm.moduleName" placeholder="模块名称" clearable></el-input>
        </el-form-item>
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
        prop="appModuleId"
                header-align="center"
        align="center"
        label="应用模块ID">
      </el-table-column>
      <el-table-column
        prop="appCode"
                header-align="center"
        align="center"
        label="应用码">
      </el-table-column>
      <el-table-column
        prop="appName"
                header-align="center"
        align="center"
        label="应用名">
      </el-table-column>
      <el-table-column
        prop="appTypeName"
                header-align="center"
        align="center"
        label="应用类型">
      </el-table-column>
      <el-table-column
        prop="moduleName"
                header-align="center"
        align="center"
        label="模块名">
      </el-table-column>
      <el-table-column
        prop="creaetTime"
                header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.appModuleId)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.appModuleId)">删除</el-button>
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
  import AddOrUpdate from './appmodule-add-or-update'
  import  dictSelect from '@/views/components/dict-select'
  export default {
    data () {
      return {
        dataForm: {
          appName: '',
          appCode: '',
          moduleName:'',
          appType: '',
          enabeld: '',
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
    components: {
      AddOrUpdate,
      dictSelect
    },
    created () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/appmodule/list'),
          method: 'post',
params: this.$http.adornParams({
            'pageIndex': this.pageIndex,
            'pageSize': this.pageSize,
            'appCode':this.dataForm.appCode,
            'appType':this.dataForm.appType,
            'moduleName':this.dataForm.moduleName,
            'beginTime': this.dataForm.beginTime,
            'endTime': this.dataForm.endTime,
            'appName': this.dataForm.appName
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
          return item.appModuleId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/appmodule/delete'),
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