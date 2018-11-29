<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :width="pageWidth" 
  :before-close="handleClose" append-to-body>
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" class="demo-form-inline">
      <el-form-item label="客户名称">
        <el-input v-model="dataForm.customerName" placeholder="客户名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="日期">
          <el-date-picker class="input-date-class" v-model="dataForm.beginTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
          &nbsp;&nbsp;-&nbsp;&nbsp;
          <el-date-picker class="input-date-class" v-model="dataForm.endTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
        </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="selectConfirm()">确定</el-button>
      </el-form-item>
      <br/>
    </el-form>
    <el-table :data="dataList" highlight-current-row v-loading="dataListLoading" 
    border @selection-change="selectionChangeHandle" @current-change='handleCurrentChange' 
    @row-dblclick="rowDBClick" style="width: 100%;">
      <el-table-column v-if="isMultip" type="selection" header-align="center" align="center" width="50">
      </el-table-column>
      <el-table-column v-if="!isMultip" align="center" width="50">
        <template slot-scope="scope">
          <el-radio v-model="customerCode" :label="scope.row.customerCode">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="customerCode" header-align="center" align="center" :show-overflow-tooltip="true" width="100" label="客户代码">
      </el-table-column>
      <el-table-column prop="customerName" header-align="center" align="center" :show-overflow-tooltip="true" width="100" label="客户名称">
      </el-table-column>
      <el-table-column prop="customerType" header-align="center" align="center" label="客户类型">
      </el-table-column>
      <el-table-column prop="linkman" header-align="center" align="center" label="联系人">
      </el-table-column>
      <el-table-column prop="phone" header-align="center" align="center" label="电话">
      </el-table-column>
      <el-table-column prop="addrs" header-align="center" align="center" :show-overflow-tooltip="true" label="地址">
      </el-table-column>
    </el-table>
    <div class="page-position">
      <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-size="pageSize" :total="total" :page-sizes="[10, 100, 200, 300]" layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </el-dialog>
</template>

<script>
import clearObject from '@/utils/clear-object' // 验权

export default {
  props: {
    dialogVisible: Boolean,
    dialogTitle: String,
    dialogWidth: String,
    isMultip: Boolean,
    closeTip:Boolean,
    name: String,
  },
  data () {
      return {
        dataForm: {
          customerName: '',
          enabeld: '',
          beginTime: '',
          endTime: ''
        },
        searchIcon: 'el-icon-arrow-down',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        dataListLoading: false,
        dataListSelections: [],
        currentRow:null,
        customerCode:''
      }
},
computed:{
  pageWidth:function(){
    return this.dialogWidth+"%"
  }
},
created () {
      this.dataForm.customerName=this.name
      this.getDataList()
    },
methods: {
    handleClose(done) {
      if(!this.closeTip)
      {
          this.$emit('close-dialog')
      }
      else{
         this.$confirm('确认关闭？')
        .then(_ => {
          this.$emit('close-dialog')
        })
        .catch(_ => {})
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
      handleCurrentChange(val){
        this.currentRow=val
        this.customerCode=val.customerCode
      },
      rowDBClick(val){
        if(!this.isMultip){
          this.selectConfirm()
        }
      },
      //选中返回事件
      selectConfirm(){
        if(this.isMultip){
          this.$emit('select-confirm', this.dataListSelections)
        }
        else
        {
          this.$emit('select-confirm', this.currentRow)
        }
        this.$emit('close-dialog')
      }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.last-item-position {
  text-align: right;
}
.page-position {
  margin-top: 20px;
  text-align: center;
}
.input-date-class{
    width: 140px;
}
</style>
