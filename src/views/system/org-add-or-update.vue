<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px" :inline="true" class="demo-form-inline">
    <el-form-item label="机构代码" prop="orgCode">
      <el-input v-model="dataForm.orgCode" placeholder="机构代码"></el-input>
    </el-form-item>
    <el-form-item label="机构名称" prop="orgName">
      <el-input v-model="dataForm.orgName" placeholder="机构名称"></el-input>
    </el-form-item>
    <el-form-item label="机构类型" prop="orgType">
      <el-input v-model="dataForm.orgType" placeholder="机构类型"></el-input>
    </el-form-item>
    <el-form-item label="父ID" prop="pid">
      <el-input v-model="dataForm.pid" placeholder="父ID"></el-input>
    </el-form-item>
    <el-form-item label="父ID全集" prop="pids">
      <el-input v-model="dataForm.pids" placeholder="父ID全集"></el-input>
    </el-form-item>
    <el-form-item label="客户ID" prop="customerId">
      <el-input v-model="dataForm.customerId" placeholder="客户ID"></el-input>
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
          orgId: 0,
          orgCode: '',
          orgName: '',
          orgType: '',
          pid: '',
          pids: '',
          customerId: '',
          enabled: '',
          createId: '',
          createName: '',
          createTime: '',
          remark: ''
        },
        dataRule: {
          orgCode: [
            { required: true, message: '机构代码不能为空', trigger: 'blur' }
          ],
          orgName: [
            { required: true, message: '机构名称不能为空', trigger: 'blur' }
          ],
          orgType: [
            { required: true, message: '机构类型不能为空', trigger: 'blur' }
          ],
          pid: [
            { required: true, message: '父ID不能为空', trigger: 'blur' }
          ],
          pids: [
            { required: true, message: '父ID全集不能为空', trigger: 'blur' }
          ],
          customerId: [
            { required: true, message: '客户ID不能为空', trigger: 'blur' }
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
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.orgId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.orgId) {
            this.$http({
              url: this.$http.adornUrl(`/sys/org/info/${this.dataForm.orgId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.orgCode = data.org.orgCode
                this.dataForm.orgName = data.org.orgName
                this.dataForm.orgType = data.org.orgType
                this.dataForm.pid = data.org.pid
                this.dataForm.pids = data.org.pids
                this.dataForm.customerId = data.org.customerId
                this.dataForm.enabled = data.org.enabled
                this.dataForm.createId = data.org.createId
                this.dataForm.createName = data.org.createName
                this.dataForm.createTime = data.org.createTime
                this.dataForm.remark = data.org.remark
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
              url: this.$http.adornUrl(`/sys/org/${!this.dataForm.orgId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'orgId': this.dataForm.orgId || undefined,
                'orgCode': this.dataForm.orgCode,
                'orgName': this.dataForm.orgName,
                'orgType': this.dataForm.orgType,
                'pid': this.dataForm.pid,
                'pids': this.dataForm.pids,
                'customerId': this.dataForm.customerId,
                'enabled': this.dataForm.enabled,
                'createId': this.dataForm.createId,
                'createName': this.dataForm.createName,
                'createTime': this.dataForm.createTime,
                'remark': this.dataForm.remark
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