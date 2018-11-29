<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px" :inline="true" class="demo-form-inline">
    <el-form-item label="资源代码" prop="resCode">
      <el-input v-model="dataForm.resCode" placeholder="资源代码"></el-input>
    </el-form-item>
    <el-form-item label="资源名称" prop="resName">
      <el-input v-model="dataForm.resName" placeholder="资源名称"></el-input>
    </el-form-item>
    <common-select label="资源类型" name="resType" prop="resType" placeholder="资源类型" 
    :qParam="{dictCode:'resType'}" url="/sys/dictItem/listNP" v-model="dataForm.resType">            
    </common-select>  
    <el-form-item label="映射路径" prop="url">
      <el-input v-model="dataForm.url" placeholder="映射路径"></el-input>
    </el-form-item>
    <el-form-item label="关联主键" prop="refId">
      <el-input v-model="dataForm.refId" placeholder="关联主键"></el-input>
    </el-form-item>
    <el-form-item label="父ID" prop="pid">
        <el-input v-model="dataForm.pname" suffix-icon="el-icon-view"  @focus="dialogMVisible=true"></el-input>
        <el-input v-model="dataForm.pid" v-show="false"></el-input>
      </el-form-item>
    <el-form-item label="应用名称" prop="appName">
        <el-input v-model="dataForm.appName" suffix-icon="el-icon-view"  @focus="dialogVisible = true"></el-input>
        <el-input v-model="dataForm.appId"  v-show="false"></el-input>
      </el-form-item>
    <el-form-item label="是否有效" prop="enabled">
      <el-radio-group v-model="dataForm.enabled">
        <el-radio :label="1">有效</el-radio>
        <el-radio :label="0">无效</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <common-select-page :dialogVisible="dialogVisible" dialogTitle="选择应用"
          url="/sys/application/app4select" cPlaceholder="请填写应用名、应用类型、模块名查询" :cParam="{enabled:1}" :qHead="[['应用ID','id'],['应用名','appName'],['应用类型名','appTypeName'],['客户名称','customerName']]"
            dialogWidth="70" :isMultip="false" :closeTip="false"
            v-on:select-confirm="selectConfirm" v-on:close-dialog="closeDialog"
    ></common-select-page>
    <common-select-page :dialogVisible="dialogMVisible" dialogTitle="选择资源"
          url="/sys/res/list4select" cPlaceholder="请填写资源名称查询" :cParam="{enabled:1}" :qHead="[['资源ID','id'],['资源代码','resCode'],['资源名称','resName'],['url','url']]"
            dialogWidth="70" :isMultip="false" :closeTip="false"
            v-on:select-confirm="selectMConfirm" v-on:close-dialog="closeMDialog"
    ></common-select-page>
  </el-dialog>
</template>

<script>
  import  commonSelectPage from '@/views/components/common-select-page'
  import  commonSelect from '@/views/components/common-select'
  export default {
    components: {
      commonSelectPage,
      commonSelect
    },
    data () {
      return {
        visible: false,
        dialogVisible:false,
        dialogMVisible:false,
        dataForm: {
          resId: 0,
          resCode: '',
          resName: '',
          resType: '',
          url: '',
          refId: '',
          pid: '',
          pname: '',
          appId: '',
          appName: '',
          enabled: true,
          createId: '',
          createName: '',
          createTime: '',
          remark: '',
          pids: ''
        },
        dataRule: {
          resCode: [
            { required: true, message: '资源代码不能为空', trigger: 'blur' }
          ],
          resName: [
            { required: true, message: '资源名称不能为空', trigger: 'blur' }
          ],
          resType: [
            { required: true, message: '资源类型不能为空', trigger: 'blur' }
          ],
          url: [
            { required: true, message: '映射路径不能为空', trigger: 'blur' }
          ],
          refId: [
            { required: true, message: '关联主键不能为空', trigger: 'blur' }
          ],
          pid: [
            { required: true, message: '父ID不能为空', trigger: 'blur' }
          ],
          appId: [
            { required: true, message: '应用ID不能为空', trigger: 'blur' }
          ],
          enabled: [
            { required: true, message: '是否有效不能为空', trigger: 'blur' }
          ],
          createId: [
            { required: true, message: '创建人id不能为空', trigger: 'blur' }
          ],
          createName: [
            { required: true, message: '创建人名称不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ],
          remark: [
            { required: true, message: '备注不能为空', trigger: 'blur' }
          ],
          pids: [
            { required: true, message: '父ID全集不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.resId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.resId) {
            this.$http({
              url: this.$http.adornUrl(`/sys/res/info/${this.dataForm.resId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.resCode = data.res.resCode
                this.dataForm.resName = data.res.resName
                this.dataForm.resType = data.res.resType
                this.dataForm.url = data.res.url
                this.dataForm.refId = data.res.refId
                this.dataForm.pid = data.res.pid
                this.dataForm.pname = data.res.pname
                this.dataForm.appId = data.res.appId
                this.dataForm.appName = data.res.appName
                this.dataForm.enabled = data.res.enabled
                this.dataForm.createId = data.res.createId
                this.dataForm.createName = data.res.createName
                this.dataForm.createTime = data.res.createTime
                this.dataForm.remark = data.res.remark
                this.dataForm.pids = data.res.pids
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
              url: this.$http.adornUrl(`/sys/res/${!this.dataForm.resId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'resId': this.dataForm.resId || undefined,
                'resCode': this.dataForm.resCode,
                'resName': this.dataForm.resName,
                'resType': this.dataForm.resType,
                'url': this.dataForm.url,
                'refId': this.dataForm.refId,
                'pid': this.dataForm.pid,
                'pname': this.dataForm.pname,
                'appId': this.dataForm.appId,
                'appName': this.dataForm.appName,
                'enabled': this.dataForm.enabled,
                'createId': this.dataForm.createId,
                'createName': this.dataForm.createName,
                'createTime': this.dataForm.createTime,
                'remark': this.dataForm.remark,
                'pids': this.dataForm.pids
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
        this.dataForm.pid = selectData.id,
        this.dataForm.pname = selectData.resName
      },
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.last-item-position {
  text-align: right;
}
</style>