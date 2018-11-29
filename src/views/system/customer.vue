<template>
  <div class="app-container">
    <el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter.native="getDataList()" class="demo-form-inline">
      <el-form-item label="客户名称" prop="customerName">
        <el-input v-model="dataForm.customerName" placeholder="客户名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="resetSearch">重置</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">删除</el-button>
        <!-- <el-button v-if="isAuth('sys:customer:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
        <!-- <el-button v-if="isAuth('sys:customer:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
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
        <el-form-item label="有效" prop="enabeld">
          <el-radio-group v-model="dataForm.enabeld">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
    </el-form>
    <el-table
      :data="dataList"
      border
      stripe
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column align="center" label="ID" width="60">
        <template slot-scope="scope">
          {{ (pageIndex-1) * pageSize +  scope.$index + 1 }}
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="customerId"
        header-align="center"
        align="center"
        label="客户ID">
      </el-table-column> -->
      <el-table-column
        prop="customerCode"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        width="100"
        label="客户代码">
      </el-table-column>
      <el-table-column
        prop="customerName"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        width="100"
        label="客户名称">
      </el-table-column>
      <el-table-column
        prop="customerType"
        header-align="center"
        align="center"
        label="客户类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.customerType === 1" size="small" type="danger">普通客户</el-tag>
          <el-tag v-else-if="scope.row.customerType === 2" size="small">黄金客户</el-tag>
          <el-tag v-else-if="scope.row.customerType === 3" size="small">钻石客户</el-tag>
          <el-tag v-else size="small">其他</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="linkMan"
        header-align="center"
        align="center"
        label="联系人">
      </el-table-column>
      <el-table-column
        prop="phone"
        header-align="center"
        align="center"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="addrs"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="地址">
      </el-table-column>
      <el-table-column
        prop="email"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="enabled"
        :formatter="formatterEnabled"
        header-align="center"
        align="center"
        label="是否有效">
      </el-table-column>
      <!-- <el-table-column
        prop="createId"
        header-align="center"
        align="center"
        label="创建人id">
      </el-table-column> -->
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
        width="160"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" icon='el-icon-edit' size="small" @click="addOrUpdateHandle(scope.row.customerId)">修改</el-button>
          <el-button type="text" icon='el-icon-delete' size="small" @click="deleteHandle(scope.row.customerId)">删除</el-button>
          <!-- <el-button v-if="isAuth('sys:customer:update')" type="text" icon='el-icon-edit' size="small" @click="addOrUpdateHandle(scope.row.customerId)">修改</el-button> -->
          <!-- <el-button v-if="isAuth('sys:customer:delete')" type="text" icon='el-icon-delete' size="small" @click="deleteHandle(scope.row.customerId)">删除</el-button> -->
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
  import AddOrUpdate from './customer-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          customerName: '',
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
      AddOrUpdate
    },
    created () {
      this.getDataList()
    },
    methods: {
      formatterEnabled(row, column) { 
        switch(row.enabled){ 
          case '0': return '无效'; break; 
          case '1': return '有效'; break; 
        } 
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/customer/list'),
          method: 'post',
          params: this.$http.adornParams({
            'pageIndex': this.pageIndex,
            'pageSize': this.pageSize,
            'enabeld': this.dataForm.enabeld,
            'beginTime': this.dataForm.beginTime,
            'endTime': this.dataForm.endTime,
            'customerName': this.dataForm.customerName
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
          return item.customerId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/customer/delete'),
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