<template>
  <div class="app-container mod-menu">
    <el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="模块管理" prop="key">
        <el-input v-model="dataForm.key" placeholder="查询关键字" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="resetSearch">重置</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">删除</el-button>
        <!-- <el-button v-if="isAuth('sys:module:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
        <!-- <el-button v-if="isAuth('sys:module:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">删除</el-button> -->
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
        prop="moduleId"
        header-align="center"
        align="center"
        label="模块ID">
      </el-table-column> -->
      <table-tree-column
        prop="moduleName"
        header-align="center"
        align="left"
        treeKey="moduleId"
        parentKey="pid"
        width="200"
        label="模块名称">
      </table-tree-column>
      <el-table-column
        prop="moduleCode"
        header-align="center"
        align="left"
        width="120"
        label="模块代码">
      </el-table-column>
      <el-table-column
        prop="moduleType"
        header-align="center"
        align="center"
        width="80"
        label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.moduleType === 7" size="small" type="info">目录</el-tag>
          <el-tag v-else-if="scope.row.moduleType === 8" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.moduleType === 9" size="small" type="warning">操作</el-tag>
          <el-tag v-else-if="scope.row.moduleType === 10" size="small" type="info">子页面</el-tag>
          <el-tag v-else size="small">其他</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="moduleIcon"
        header-align="center"
        align="center"
        width="80"
        label="图标">
        <template slot-scope="scope">        
          <icon-svg :name="scope.row.moduleIcon || ''"></icon-svg>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="pid"
        header-align="center"
        align="center"
        label="父ID">
      </el-table-column> -->
      <!-- <el-table-column
        prop="redirect"
        header-align="center"
        align="center"
        label="默认跳转地址">
      </el-table-column> -->
      <el-table-column
        prop="component"
        header-align="center"
        align="left"
        label="前端组件">
      </el-table-column>
      <el-table-column
        prop="num"
        header-align="center"
        align="left"
        label="排序号">
      </el-table-column>
      <el-table-column
        prop="hidden"
        header-align="center"
        align="center"
        width="80"
        label="是否隐藏">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.hidden === 0" size="small" type="info">隐藏</el-tag>
          <el-tag v-else size="small">显示</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="isOpen"
        header-align="center"
        align="center"
        label="是否打开">
      </el-table-column> -->
      <!-- <el-table-column
        prop="isMenu"
        header-align="center"
        align="center"
        label="是否菜单">
      </el-table-column> -->
      <el-table-column
        prop="enabled"
        :formatter="formatterEnabled"
        header-align="center"
        align="center"
        width="80"
        label="是否有效">
      </el-table-column>
      <!-- <el-table-column
        prop="level"
        header-align="center"
        align="center"
        label="级次">
      </el-table-column> -->
      <!-- <el-table-column
        prop="num"
        header-align="center"
        align="center"
        label="排序号">
      </el-table-column> -->
      <!-- <el-table-column
        prop="createId"
        header-align="center"
        align="center"
        label="创建人id">
      </el-table-column> -->
      <!-- <el-table-column
        prop="createName"
        header-align="center"
        align="center"
        label="创建人">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注">
      </el-table-column> -->
      <!-- <el-table-column
        prop="pids"
        header-align="center"
        align="center"
        label="父ID全集">
      </el-table-column> -->
      <!-- <el-table-column
        prop="url"
        header-align="center"
        align="center"
        label="URL">
      </el-table-column> -->
      <!-- <el-table-column
        prop="ctrlData"
        header-align="center"
        align="center"
        label="数据权限控制">
      </el-table-column>
      <el-table-column
        prop="ctrlOrg"
        header-align="center"
        align="center"
        label="机构权限控制(0所有1自己2自定义">
      </el-table-column> -->
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.moduleId)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.moduleId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="page-position">
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div> -->
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import TableTreeColumn from '@/components/table-tree-column'
  import AddOrUpdate from './module-add-or-update'
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        seen: false,
        searchIcon: 'el-icon-arrow-down',
        dataList: [],
        // pageIndex: 1,
        // pageSize: 10,
        // total: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      TableTreeColumn,
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
          url: this.$http.adornUrl('/sys/module/list'),
          method: 'post',
          params: this.$http.adornParams({
            // 'pageIndex': this.pageIndex,
            'pageSize': 9999,
            'enabeld': this.dataForm.enabeld,
            'beginTime': this.dataForm.beginTime,
            'endTime': this.dataForm.endTime,
            'key': this.dataForm.key
          })
        }).then(({data}) => {
          if (data && data.list) {
            // this.dataList = data.list
            // this.total = parseInt(data.page.total)
            this.dataList = treeDataTranslate(data.list, 'moduleId','pid')
          } else {
            this.dataList = []
            // this.total = 0
          }
          this.dataListLoading = false
        })
      },
      adSearch() {
        this.seen = !this.seen
        this.searchIcon = this.seen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
      },
      // 每页数
      // sizeChangeHandle (val) {
      //   this.pageSize = val
      //   this.pageIndex = 1
      //   this.getDataList()
      // },
      // 当前页
      // currentChangeHandle (val) {
      //   this.pageIndex = val
      //   this.getDataList()
      // },
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
          return item.moduleId
        })
        // console.log(this.dataListSelections.children)
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/module/delete'),
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