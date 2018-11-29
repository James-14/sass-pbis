<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px" :inline="true" class="demo-form-inline">
    <el-form-item label="角色代码" prop="roleCode">
      <el-input v-model="dataForm.roleCode" placeholder="角色代码"></el-input>
    </el-form-item>
    <el-form-item label="角色名称" prop="roleName">
      <el-input v-model="dataForm.roleName" placeholder="角色名称"></el-input>
    </el-form-item>
    <el-form-item label="角色类型" prop="roleType">
      <el-input v-model="dataForm.roleType" placeholder="角色类型"></el-input>
    </el-form-item>
    <el-form-item label="父ID" prop="pid">
      <el-input v-model="dataForm.pid" placeholder="父ID"></el-input>
    </el-form-item>
    <el-form-item label="应用ID" prop="appId">
      <el-input v-model="dataForm.appId" placeholder="应用ID"></el-input>
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
          roleId: 0,
          roleCode: '',
          roleName: '',
          roleType: '',
          pid: '',
          appId: '',
          enabled: '',
          createId: '',
          createName: '',
          createTime: '',
          remark: '',
          pids: ''
        },
        dataRule: {
          roleCode: [
            { required: true, message: '角色代码不能为空', trigger: 'blur' }
          ],
          roleName: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' }
          ],
          roleType: [
            { required: true, message: '角色类型不能为空', trigger: 'blur' }
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
        this.dataForm.roleId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.roleId) {
            this.$http({
              url: this.$http.adornUrl(`/sys/role/info/${this.dataForm.roleId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.roleCode = data.role.roleCode
                this.dataForm.roleName = data.role.roleName
                this.dataForm.roleType = data.role.roleType
                this.dataForm.pid = data.role.pid
                this.dataForm.appId = data.role.appId
                this.dataForm.enabled = data.role.enabled
                this.dataForm.createId = data.role.createId
                this.dataForm.createName = data.role.createName
                this.dataForm.createTime = data.role.createTime
                this.dataForm.remark = data.role.remark
                this.dataForm.pids = data.role.pids
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
              url: this.$http.adornUrl(`/sys/role/${!this.dataForm.roleId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'roleId': this.dataForm.roleId || undefined,
                'roleCode': this.dataForm.roleCode,
                'roleName': this.dataForm.roleName,
                'roleType': this.dataForm.roleType,
                'pid': this.dataForm.pid,
                'appId': this.dataForm.appId,
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