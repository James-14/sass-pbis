<template>
  <el-dialog
    :title="!dataForm.appModuleId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px" :inline="true" class="demo-form-inline">
      <el-form-item label="应用名称" prop="appName">
        <!--<common-select ref="appSelect" @selectFunc="selectApp" name="app" prop="appId" placeholder="应用" :qParam="{enbaled:1,moduleType:1,level:2}" url="/sys/application/app4select">            
        </common-select>-->
        <el-input v-model="dataForm.appName" suffix-icon="el-icon-view"  @focus="dialogVisible = true"></el-input>
        <el-input v-model="dataForm.appId"  v-show="false"></el-input>
      </el-form-item>
      <el-form-item label="模块名称" prop="moduleName">
        <el-input v-model="dataForm.moduleName" suffix-icon="el-icon-view"  @focus="dialogMVisible = true"></el-input>
        <el-input v-model="dataForm.moduleId"  v-show="false"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <common-select-page :dialogVisible="dialogVisible" dialogTitle="选择应用"
          url="/sys/application/app4select" cPlaceholder="请填写应用名、应用类型、模块名查询" :cParam="{enabled:1}" :qHead="[['应用ID','appId'],['应用名','appName'],['应用类型名','appTypeName'],['客户名称','customerName']]"
            dialogWidth="70" :isMultip="false" :closeTip="false"
            v-on:select-confirm="selectConfirm" v-on:close-dialog="closeDialog"
    ></common-select-page>
    <common-select-page :dialogVisible="dialogMVisible" dialogTitle="选择模块"
          url="/sys/module/module4select" cPlaceholder="请填写模块名、模块类型查询" :cParam="{enabled:1,moduleType:8}" :qHead="[['模块ID','moduleId'],['模块码','moduleCode'],['模块名','moduleName'],['模块类型','moduleTypeName'],['级别','level']]"
            dialogWidth="70" :isMultip="false" :closeTip="false"
            v-on:select-confirm="selectMConfirm" v-on:close-dialog="closeMDialog"
    ></common-select-page>

  </el-dialog>
</template>

<script>
  import  commonSelectPage from '@/views/components/common-select-page'
  export default {
    components: {
      commonSelectPage
    },
    data () {
      return {
        visible: false,
        dialogVisible:false,
        dialogMVisible:false,
        dataForm: {
          appModuleId: 0,
          appName:'',
          moduleName:'',
          appId: '',
          moduleId: '',
          creaetTime: ''
        },
        dataRule: {
          appName: [
            { required: true, message: '应用名称不能为空', trigger: 'blur' }
          ],
          moduleName: [
            { required: true, message: '模块名称不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.appModuleId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.appModuleId) {
            this.$http({
              url: this.$http.adornUrl(`/sys/appmodule/info/${this.dataForm.appModuleId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.appName = data.appmodule.appName
                this.dataForm.appId = data.appmodule.id
                this.dataForm.moduleName = data.appmodule.moduleName
                this.dataForm.moduleId = data.appmodule.id
                //this.$refs.moduleSelect.setValue(data.appmodule.moduleId)
                //this.dataForm.creaetTime = data.appmodule.creaetTime
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/appmodule/${!this.dataForm.appModuleId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'appModuleId': this.dataForm.appModuleId || undefined,
                'appId': this.dataForm.appId,
                'moduleId': this.dataForm.moduleId,
                'creaetTime': this.dataForm.creaetTime
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      closeDialog() {
        this.dialogVisible = false
      },
      selectConfirm: function(selectData) {
        this.dataForm.appId = selectData.id,
        this.dataForm.appName = selectData.appName
      },
      closeMDialog() {
        this.dialogMVisible = false
      },
      selectMConfirm: function(selectData) {
        this.dataForm.moduleId = selectData.id,
        this.dataForm.moduleName = selectData.moduleName
      },
      selectModule(value){
        this.dataForm.moduleId = value
      },
      selectApp(value){
        this.dataForm.appId = value
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.last-item-position {
  text-align: right;
}
</style>