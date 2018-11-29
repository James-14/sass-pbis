<template>
  <div class="app-container">
    <el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="字典子项" prop="key">
        <el-input v-model="dataForm.key" placeholder="查询关键字" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="resetSearch">重置</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">删除</el-button>
        <return-button :path="this.backUrl"></return-button>
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
      <template v-if="this.isTree">
        <table-tree-column
          prop="dictItemName"
          header-align="center"
          align="left"
          treeKey="dictItemId"
          parentKey="dictItemPid"
          width="200"
          label="名称">
        </table-tree-column>
      </template>
      <template v-else>
        <el-table-column
          prop="dictItemName"
          header-align="center"
          align="left"
          width="120"
          label="名称">
        </el-table-column>
      </template>
      
      <el-table-column
        prop="dictItemCode"
        header-align="center"
        align="left"
        width="120"
        label="代码">
      </el-table-column>
  
      <el-table-column
        prop="dictItemValue"
        header-align="center"
        align="left"
        label="值">
      </el-table-column>
      <el-table-column
        prop="dictItemDefaultValue"
        header-align="center"
        align="left"
        label="缺省值">
      </el-table-column>
      <el-table-column
        prop="customerName"
        header-align="center"
        align="left"
        label="客户名称">
      </el-table-column>
      <el-table-column
        prop="appName"
        header-align="center"
        align="left"
        label="应用名称">
      </el-table-column>
      <template v-if="attrName1 !== null &&  attrName1 !== undefined && attrName1 !== ''">
        <el-table-column
          prop="dictItemAttr1"
          header-align="center"
          align="left"
          :label="attrName1">
        </el-table-column>
      </template>
      <template v-if="attrName2 !== null && attrName2 !== undefined && attrName2 !== ''">
        <el-table-column
          prop="dictItemAttr2"
          header-align="center"
          align="left"
          :label="attrName2">
        </el-table-column>
      </template>
      <template v-if="attrName3 !== null && attrName3 !== undefined && attrName3 !== ''">
        <el-table-column
          prop="dictItemAttr3"
          header-align="center"
          align="left"
          :label="attrName3">
        </el-table-column>
      </template>
      <template v-if="attrName4 !== null && attrName4 !== undefined && attrName4 !== ''">
        <el-table-column
          prop="dictItemAttr4"
          header-align="center"
          align="left"
          :label="attrName4">
        </el-table-column>
      </template>
      <template v-if="attrName5 !== null && attrName5 !== undefined && attrName5 !== ''">
        <el-table-column
          prop="dictItemAttr5"
          header-align="center"
          align="left"
          :label="attrName5">
        </el-table-column>
      </template>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.dictItemId)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.dictItemId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <template v-if="this.isTree!==1">
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
    </template>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import TableTreeColumn from '@/components/table-tree-column'
  import AddOrUpdate from './dictitem-add-or-update'
  import { treeDataTranslate } from '@/utils'
  import  returnButton from '@/views/components/return-button'
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        seen: false,
        searchIcon: 'el-icon-arrow-down',
        dataList: [],
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        dictId:this.$route.query.dictId,
        backUrl:this.$route.query.backUrl,
        attrName1:this.$route.query.attrName1,
        attrName2:this.$route.query.attrName2,
        attrName3:this.$route.query.attrName3,
        attrName4:this.$route.query.attrName4,
        attrName5:this.$route.query.attrName5,
        total: 0,
        isTree:1
      }
    },
    components: {
      TableTreeColumn,
      AddOrUpdate,
      returnButton
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
          url: this.$http.adornUrl('/sys/dictItem/list'),
          method: 'post',
          params: this.$http.adornParams({
            'pageSize': 9999,
            'enabeld': this.dataForm.enabeld,
            'beginTime': this.dataForm.beginTime,
            'endTime': this.dataForm.endTime,
            'key': this.dataForm.key,
            'dictId':this.dictId
          })
        }).then(({data}) => {
          if (data && data.list) {
            if(this.isTree===1){
              this.dataList = treeDataTranslate(data.list, 'dictItemId','dictItemPid')
            }else{
              this.dataList = data.list
              this.total = parseInt(data.page.total)
            }
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
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id,this.attrName1,this.attrName2,this.attrName3,this.attrName4,this.attrName5)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.moduleId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/dictItem/delete'),
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