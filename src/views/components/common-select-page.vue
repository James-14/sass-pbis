<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :width="pageWidth" 
  :before-close="handleClose" append-to-body>
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" class="demo-form-inline">
      <el-form-item label="">
        <el-input v-model="dataForm.queryParam" :placeholder="cPlaceholder" clearable></el-input>
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
          <el-radio v-model="ID" :label="scope.row.id">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <template v-for="(head,index) in head">
          <el-table-column v-if="head.type==='normal'" :header-align="head.headerAlign" :align="head.align" :prop="head.prop" :label="head.label"></el-table-column>
          <el-table-column v-if="head.type==='sort'" :header-align="head.headerAlign" :align="head.align" :prop="head.prop" sortable :label="head.label">
            <template scope="scope">
              <el-tag type="primary">{{scope.row.type}}</el-tag>
            </template>
          </el-table-column>
        </template>      
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
    cPlaceholder:String,
    closeTip:Boolean,
    name: String,
    cParam:{
      type:Object
    },
    qHead:{
        type:Array
      },
    url:{
        type: String
      },
  },
  data () {
      return {
        dataForm: {
          queryParam: ''
        },
        head:[],
        searchIcon: 'el-icon-arrow-down',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        dataListLoading: false,
        dataListSelections: [],
        currentRow:null,
        ID:-1
      }
},
computed:{
  pageWidth:function(){
    return this.dialogWidth+"%"
  }
},
created () {
      this.dataForm.queryParam=this.name
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
        this.cParam.pageSize = this.pageSize
        this.cParam.pageIndex = this.pageIndex
        this.cParam.queryParam = this.dataForm.queryParam
        this.head = []
        this.dataList = []   
        this.$http({
          url: this.$http.adornUrl(this.url),
          method: 'post',
          params: this.$http.adornParams(this.cParam)
        }).then(({data}) => {
            
            for(var a=0;a<this.qHead.length;a++){
              var temp = {}
              var tHead = this.qHead[a]
              temp.label= tHead[0]
              temp.prop = tHead[1]
              temp.type='normal'
              temp.headAlign = 'center'
              temp.align='center'
              this.head[a]=temp
            }
          if (data && data.page.list) {
            // for(var i=0;i<data.page.list.length;i++){
            //   var obj = {}
            //   for(var j=0;j<this.qHead.length;j++){
            //       obj[this.qHead[j][1]] = data.page.list[i][this.qHead[j][1]]
            //   }
            //   this.dataList[i] = obj
            // }
            this.dataList = data.page.list
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
        this.ID=val.id
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
