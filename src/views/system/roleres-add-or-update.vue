<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px" :inline="true" class="demo-form-inline">  
    <el-form-item label="资源名称" prop="resName">
      <el-input v-model="dataForm.resName" suffix-icon="el-icon-view"  @focus="treeVisible=true" placeholder="资源名称"></el-input>
      <el-input v-model="dataForm.resId" placeholder="资源ID" v-show="false"></el-input>
      <el-input v-model="dataForm.roleId" placeholder="角色ID" v-show="false"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <tree-select-page :dialogVisible="treeVisible" dialogTitle="选择资源"
    dialogWidth="30"  :closeTip="false"
    v-on:select-confirm="selectConfirm" v-on:close-dialog="closeTreeDialog"
    treeUrl="/sys/res/tree" :conditions="{}"
    ></tree-select-page>
  </el-dialog>
</template>

<script>
 //import  treeSelectPage from '@/views/components/tree-select-page'
import  treeSelectPage from '@/views/components/tree-select-single'
  export default {
    components: {
      treeSelectPage
    },
    data () {      
      return {
        treeVisible: false,
        visible: false,
        dataForm: {
          roleResId: 0,
          roleId: '',
          resName:'',
          resId: ''
        },
        dataRule: {
          resName: [
            { required: true, message: '资源名称不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id,roleId) {
        this.dataForm.roleId = roleId
        this.dataForm.roleResId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.roleResId) {
            this.$http({
              url: this.$http.adornUrl(`/sys/roleres/info/${this.dataForm.roleResId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.roleId = data.roleres.roleId
                this.dataForm.resId = data.roleres.resId
                this.dataForm.createTime = data.roleres.createTime
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        //console.log(this.dataForm);
        //console.log(this.dataForm.roleId+" "+this.dataForm.resId);
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/roleres/${!this.dataForm.roleResId ? 'save' : 'update'}`),
              method: 'post',
              params: this.$http.adornParams({
                'roleResId': this.dataForm.roleResId || undefined,
                'roleId': this.dataForm.roleId,
                'resId': this.dataForm.resId
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
      closeTreeDialog() {
        this.treeVisible = false
      },
      selectConfirm: function(selectData) {
        // var resIds = new Array()
        // var resNames = new Array()
        // for(var i =0;i<selectData.length;i++){
        //     resIds.push(selectData[i].id)
        //     resNames.push(selectData[i].label)
        // }
        this.dataForm.resId = selectData.id
        this.dataForm.resName = selectData.label
      },
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.last-item-position {
  text-align: right;
}
</style>