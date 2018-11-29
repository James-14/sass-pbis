<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="150px">
      <el-form-item label="用户ID" prop="userId">
        <el-input v-model="dataForm.userName" suffix-icon="el-icon-view"  @focus="dialogMVisible=true" placeholder="用户名称"></el-input>
        <el-input v-model="dataForm.userId" placeholder="用户ID" v-show="false"></el-input>
        <el-input v-model="dataForm.apporgId" placeholder="应用组织ID" v-show="false"></el-input>
      </el-form-item>
      <el-form-item label="是否默认(主机构)" prop="isDefault">
        <el-radio-group v-model="dataForm.isDefault" prop="isDefault">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import commonSelectPage from '@/views/components/common-select-page'
  export default {
    components: {
      commonSelectPage
    },
    data () {
      return {
        visible: false,
        dataForm: {
          userApporgId: 0,
          userId: '',
          apporgId: '',
          createTime: '',
          isDefault: ''
        },
        dataRule: {
          userId: [
            { required: true, message: '用户ID不能为空', trigger: 'blur' }
          ],
          apporgId: [
            { required: true, message: '应用组织ID不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ],
          isDefault: [
            { required: true, message: '是否默认(主机构)不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.userApporgId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.userApporgId) {
            this.$http({
              url: this.$http.adornUrl(`/sys/userapporg/info/${this.dataForm.userApporgId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.userId = data.userapporg.userId
                this.dataForm.apporgId = data.userapporg.apporgId
                this.dataForm.createTime = data.userapporg.createTime
                this.dataForm.isDefault = data.userapporg.isDefault
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
              url: this.$http.adornUrl(`/sys/userapporg/${!this.dataForm.userApporgId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'userApporgId': this.dataForm.userApporgId || undefined,
                'userId': this.dataForm.userId,
                'apporgId': this.dataForm.apporgId,
                'createTime': this.dataForm.createTime,
                'isDefault': this.dataForm.isDefault
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