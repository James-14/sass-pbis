<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="审批人">
        <el-input v-model="formInline.user" placeholder="审批人"></el-input>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="formInline.region" placeholder="活动区域">
          <el-option v-for="item in dataStatus" :key="item.value" :label="item.label" :value="item.value" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">搜索</el-button>
        <el-button type="primary" @click="addInfo">添加</el-button>
      </el-form-item>
      <br/>
    </el-form>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column min-width="100px" :show-overflow-tooltip="true" label="Title">
        <template slot-scope="scope">        
          <span v-show="!scope.row.edit">{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="130">
        <template slot-scope="scope">
          <!-- <el-button v-show='!scope.row.edit' type="primary" @click='scope.row.edit=true' size="small" icon="edit">编辑</el-button>
          <el-button v-show='scope.row.edit' type="success" @click='scope.row.edit=false' size="small" icon="check">完成</el-button> -->
          <el-row>
            <el-button type="text" icon='el-icon-edit' @click='updateRow(scope.$index, scope.row)' size="small">编辑2</el-button>
            <el-button type="text" icon='el-icon-delete' @click='deleteRow(scope.$index, scope.row)' size="small">删除</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-position">
      <el-pagination :current-page="currentPage" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <edit :dialog-visible='dialogVisible' :item='editRow' 
    v-on:close-dialog="dialogVisible = false" v-on:save-info="saveInfo" />
  </div>
</template>

<script>
import { getList } from '@/api/table'
import edit from './edit'

export default {
  components: {
    edit
  },
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
  data() {
    return {
      list: null,
      listLoading: true,
      dialogVisible: false,
      eidtIndex: -1,
      editRow: {},
      total: 50,
      currentPage: 1,
      dataStatus:[],
      searchIcon: 'el-icon-arrow-down',
      formInline: {
        user: '',
        region: '',
        radio2: '',
        startDate: '',
        endDate: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      this.dataStatus =[{label:'beijing', value:'beijing'},{label:'shanghai', value:'shanghai'}]
      this.list=[{title:'文章1',author:'laowang',pageviews:'1',status:'published',display_time:'1980-01-01'},
      {title:'文章2',author:'laoxiao',pageviews:'2',status:'deleted',display_time:'1980-02-01'}]
      this.listLoading = false     
    },
    updateRow(index, row) {
      this.dialogVisible = true
      this.eidtIndex = index
      this.editRow = Object.assign({}, row)
    },
    saveInfo: function(userInfo) {
      if (this.eidtIndex != -1) {
        this.list.splice(this.eidtIndex, 1, userInfo)
      } else {
        this.list.push(userInfo)
      }
      console.log(this.list[0].title)
    },
    addInfo: function() {
      this.eidtIndex = -1
      this.editRow = {}
      this.dialogVisible = true
    },
    deleteRow(index, row) {
      this.list.splice(index, 1)
    },
    closeDialog() {
      this.dialogVisible = false
    },
    onSubmit() {
      console.log(this.formInline.radio2)
      console.log(this.formInline.region)
      console.log(this.formInline.startDate)
      console.log(this.formInline.endDate)
      console.log('submit!')
    },
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

   