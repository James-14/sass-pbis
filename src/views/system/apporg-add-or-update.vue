<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px" :inline="true" class="demo-form-inline">
    <el-form-item label="代码" prop="apporgCode">
      <el-input v-model="dataForm.apporgCode" placeholder="代码"></el-input>
    </el-form-item>
    <el-form-item label="名称" prop="apporgName">
      <el-input v-model="dataForm.apporgName" placeholder="名称"></el-input>
    </el-form-item>
    <el-form-item label="机构类型" prop="apporgType">
      <el-input v-model="dataForm.apporgType" placeholder="机构类型"></el-input>
    </el-form-item>
    <el-form-item label="父ID" prop="pid">
      <el-input v-model="dataForm.pid" placeholder="父ID"></el-input>
    </el-form-item>
    <el-form-item label="归属应用" prop="apps">
      <el-input v-model="dataForm.apps" placeholder="归属应用"></el-input>
    </el-form-item>
    <el-form-item label="是否有效" prop="enabled">
      <el-input v-model="dataForm.enabled" placeholder="是否有效"></el-input>
    </el-form-item>
    <el-form-item label="创建人id" prop="createId">
      <el-input v-model="dataForm.createId" placeholder="创建人id"></el-input>
    </el-form-item>
    <el-form-item label="创建人名称" prop="createName">
      <el-input v-model="dataForm.createName" placeholder="创建人名称"></el-input>
    </el-form-item>
    <el-form-item label="创建时间" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
    </el-form-item>
    <el-form-item label="父ID全集" prop="pids">
      <el-input v-model="dataForm.pids" placeholder="父ID全集"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          apporgId: 0,
          apporgCode: '',
          apporgName: '',
          apporgType: '',
          pid: '',
          apps: '',
          enabled: '',
          createId: '',
          createName: '',
          createTime: '',
          remark: '',
          pids: ''
        },
        dataRule: {
          apporgCode: [
            { required: true, message: '代码不能为空', trigger: 'blur' }
          ],
          apporgName: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          apporgType: [
            { required: true, message: '机构类型不能为空', trigger: 'blur' }
          ],
          pid: [
            { required: true, message: '父ID不能为空', trigger: 'blur' }
          ],
          apps: [
            { required: true, message: '归属应用不能为空', trigger: 'blur' }
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
        this.dataForm.apporgId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.apporgId) {
            this.$http({
              url: this.$http.adornUrl(`/sys/apporg/info/${this.dataForm.apporgId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.apporgCode = data.apporg.apporgCode
                this.dataForm.apporgName = data.apporg.apporgName
                this.dataForm.apporgType = data.apporg.apporgType
                this.dataForm.pid = data.apporg.pid
                this.dataForm.apps = data.apporg.apps
                this.dataForm.enabled = data.apporg.enabled
                this.dataForm.createId = data.apporg.createId
                this.dataForm.createName = data.apporg.createName
                this.dataForm.createTime = data.apporg.createTime
                this.dataForm.remark = data.apporg.remark
                this.dataForm.pids = data.apporg.pids
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
              url: this.$http.adornUrl(`/sys/apporg/${!this.dataForm.apporgId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'apporgId': this.dataForm.apporgId || undefined,
                'apporgCode': this.dataForm.apporgCode,
                'apporgName': this.dataForm.apporgName,
                'apporgType': this.dataForm.apporgType,
                'pid': this.dataForm.pid,
                'apps': this.dataForm.apps,
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
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.last-item-position {
  text-align: right;
}
</style>