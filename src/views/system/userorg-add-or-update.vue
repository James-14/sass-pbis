<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px" :inline="true" class="demo-form-inline">
      <el-form-item label="用户ID" prop="userId">
        <el-input v-model="dataForm.userName" suffix-icon="el-icon-view"  @focus="dialogMVisible=true" placeholder="用户名称"></el-input>
        <el-input v-model="dataForm.userId" placeholder="用户ID" v-show="false"></el-input>
        <el-input v-model="dataForm.orgId" placeholder="机构ID" v-show="false"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <common-select-page :dialogVisible="dialogMVisible" dialogTitle="选择用户"
          url="/user/list4select" cPlaceholder="请填写用户名查询" :cParam="{status:1}" :qHead="[['用户ID','id'],['用户名','userName'],['用户类型','userTypeName'],['部门','userDept'],['公司','userCompany']]"
            dialogWidth="70" :isMultip="false" :closeTip="false"
            v-on:select-confirm="selectMConfirm" v-on:close-dialog="closeMDialog"
    ></common-select-page>
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
        dialogMVisible: false,
        visible: false,
        dataForm: {
          userOrgId: 0,
          orgId: '',
          userId: '',
          userName: ''
        },
        dataRule: {
          userName: [
            { required: true, message: '用户名称不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id,orgId) {
        this.dataForm.orgId = orgId
        this.dataForm.userOrgId = id || 0
        this.visible = true        
      },
      closeMDialog() {
        this.dialogMVisible = false
      },
      selectMConfirm: function(selectData) {
        this.dataForm.userId = selectData.id,
        this.dataForm.userName = selectData.userName
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/userorg/${!this.dataForm.userOrgId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'userOrgId': this.dataForm.userOrgId || undefined,
                'userId': this.dataForm.userId,
                'orgId': this.dataForm.orgId,
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