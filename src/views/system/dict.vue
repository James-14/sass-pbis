<template>
  <div class="app-container">
    <el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="字典" prop="key">
        <el-input v-model="dataForm.key" placeholder="查询关键字" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="resetSearch">重置</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">删除</el-button>
        <!-- <el-button v-if="isAuth('sys:dict:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('sys:dict:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">删除</el-button> -->
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
      <!-- <el-table-column
        prop="dictId"
        header-align="center"
        align="center"
        label="字典id">
      </el-table-column> -->
      <el-table-column
        prop="dictCode"
        header-align="center"
        :show-overflow-tooltip="true"
        width="120"
        align="left"
        label="字典代码">
      </el-table-column>
      <el-table-column
        prop="dictName"
        header-align="center"
        align="left"
        label="字典名称">
      </el-table-column>
      <el-table-column
        prop="dictType"
        header-align="center"
        align="left"
        label="字典类型">
      </el-table-column>
      <el-table-column
        prop="attrName1"
        header-align="center"
        align="center"
        label="参数1">
      </el-table-column>
      <el-table-column
        prop="attrName2"
        header-align="center"
        align="center"
        label="参数2">
      </el-table-column>
      <el-table-column
        prop="attrName3"
        header-align="center"
        align="center"
        label="参数3">
      </el-table-column>
      <el-table-column
        prop="attrName4"
        header-align="center"
        align="center"
        label="参数4">
      </el-table-column>
      <el-table-column
        prop="attrName5"
        header-align="center"
        align="center"
        label="参数5">
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
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.dictId)">修改</el-button>
          <el-button type="text" size="small" @click="gotoSetting(scope.row)">配置子项</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.dictId)">删除</el-button>
          <!--<el-button v-if="isAuth('sys:dict:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.dictId)">修改</el-button>-->
          <!--<el-button v-if="isAuth('sys:dict:delete')" type="text" size="small" @click="deleteHandle(scope.row.dictId)">删除</el-button>-->
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
  import AddOrUpdate from './dict-add-or-update'
  import { getDnyChildRouter,props2Router,addRouter } from '@/utils/router-operation'

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
      getDnyChildRouter(this.$router,this.$route.meta.id)
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/dict/dictList'),
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
      //配置子项
      gotoSetting(row){
        let param = {dictId:row.dictId,backUrl: this.$route.path}
        if(typeof(row.attrName1) != 'undefined' && row.attrName1 != null && row.attrName1 != ''){
          param.attrName1 = row.attrName1
        }else{
          param.attrName1 = ''
        }
        if(typeof(row.attrName2) != 'undefined' && row.attrName2 != null && row.attrName2 != ''){
          param.attrName2 = row.attrName2
        }else{
          param.attrName2 = ''
        }
        if(typeof(row.attrName3) != 'undefined' && row.attrName3 != null && row.attrName3 != ''){
          param.attrName3 = row.attrName3
        }else{
          param.attrName3 = ''
        }
        if(typeof(row.attrName4) != 'undefined' && row.attrName4 != null && row.attrName4 != ''){
          param.attrName4 = row.attrName4
        }else{
          param.attrName4 = ''
        }
        if(typeof(row.attrName5) != 'undefined' && row.attrName5 != null && row.attrName5 != ''){
          param.attrName5 = row.attrName5
        }else{
          param.attrName5 = ''
        }
        this.$router.push({
          path:this.constant.dny + this.$route.meta.id + this.constant.dict_item,
          query:param
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.dictId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/dict/delete'),
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