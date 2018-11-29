<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px" :inline="true" class="demo-form-inline">
    <el-form-item label="文件名" prop="fileName">
      <el-input v-model="dataForm.fileName" placeholder="文件名"></el-input>
    </el-form-item>
    <el-form-item label="新文件名" prop="newFileName">
      <el-input v-model="dataForm.newFileName" placeholder="新文件名"></el-input>
    </el-form-item>
    <el-form-item label="客户ID" prop="customerId">
      <el-input v-model="dataForm.customerId" placeholder="客户ID"></el-input>
    </el-form-item>
    <el-form-item label="应用ID" prop="appId">
      <el-input v-model="dataForm.appId" placeholder="应用ID"></el-input>
    </el-form-item>
    <el-form-item label="路径" prop="path">
      <el-input v-model="dataForm.path" placeholder="路径"></el-input>
    </el-form-item>
    <el-form-item label="文件大小" prop="size">
      <el-input v-model="dataForm.size" placeholder="文件大小"></el-input>
    </el-form-item>
    <el-form-item label="md5" prop="md5">
      <el-input v-model="dataForm.md5" placeholder="md5"></el-input>
    </el-form-item>
    <el-form-item label="扩展名" prop="suffix">
      <el-input v-model="dataForm.suffix" placeholder="扩展名"></el-input>
    </el-form-item>
    <el-form-item label="模块" prop="module">
      <el-input v-model="dataForm.module" placeholder="模块"></el-input>
    </el-form-item>
    <el-form-item label="业务ID" prop="businessId">
      <el-input v-model="dataForm.businessId" placeholder="业务ID"></el-input>
    </el-form-item>
    <el-form-item label="创建者" prop="createBy">
      <el-input v-model="dataForm.createBy" placeholder="创建者"></el-input>
    </el-form-item>
    <el-form-item label="创建时间" prop="createDate">
      <el-input v-model="dataForm.createDate" placeholder="创建时间"></el-input>
    </el-form-item>
    <el-form-item label="备注信息" prop="remarks">
      <el-input v-model="dataForm.remarks" placeholder="备注信息"></el-input>
    </el-form-item>
    <el-form-item label="删除标记" prop="delFlag">
      <el-input v-model="dataForm.delFlag" placeholder="删除标记"></el-input>
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
          fileId: 0,
          fileName: '',
          newFileName: '',
          customerId: '',
          appId: '',
          path: '',
          size: '',
          md5: '',
          suffix: '',
          module: '',
          businessId: '',
          createBy: '',
          createDate: '',
          remarks: '',
          delFlag: ''
        },
        dataRule: {
          fileName: [
            { required: true, message: '文件名不能为空', trigger: 'blur' }
          ],
          newFileName: [
            { required: true, message: '新文件名不能为空', trigger: 'blur' }
          ],
          customerId: [
            { required: true, message: '客户ID不能为空', trigger: 'blur' }
          ],
          appId: [
            { required: true, message: '应用ID不能为空', trigger: 'blur' }
          ],
          path: [
            { required: true, message: '路径不能为空', trigger: 'blur' }
          ],
          size: [
            { required: true, message: '文件大小不能为空', trigger: 'blur' }
          ],
          md5: [
            { required: true, message: 'md5不能为空', trigger: 'blur' }
          ],
          suffix: [
            { required: true, message: '扩展名不能为空', trigger: 'blur' }
          ],
          module: [
            { required: true, message: '模块不能为空', trigger: 'blur' }
          ],
          businessId: [
            { required: true, message: '业务ID不能为空', trigger: 'blur' }
          ],
          createBy: [
            { required: true, message: '创建者不能为空', trigger: 'blur' }
          ],
          createDate: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ],
          remarks: [
            { required: true, message: '备注信息不能为空', trigger: 'blur' }
          ],
          delFlag: [
            { required: true, message: '删除标记不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.fileId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.fileId) {
            this.$http({
              url: this.$http.adornUrl(`/sys/file/info/${this.dataForm.fileId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.fileName = data.file.fileName
                this.dataForm.newFileName = data.file.newFileName
                this.dataForm.customerId = data.file.customerId
                this.dataForm.appId = data.file.appId
                this.dataForm.path = data.file.path
                this.dataForm.size = data.file.size
                this.dataForm.md5 = data.file.md5
                this.dataForm.suffix = data.file.suffix
                this.dataForm.module = data.file.module
                this.dataForm.businessId = data.file.businessId
                this.dataForm.createBy = data.file.createBy
                this.dataForm.createDate = data.file.createDate
                this.dataForm.remarks = data.file.remarks
                this.dataForm.delFlag = data.file.delFlag
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
              url: this.$http.adornUrl(`/sys/file/${!this.dataForm.fileId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'fileId': this.dataForm.fileId || undefined,
                'fileName': this.dataForm.fileName,
                'newFileName': this.dataForm.newFileName,
                'customerId': this.dataForm.customerId,
                'appId': this.dataForm.appId,
                'path': this.dataForm.path,
                'size': this.dataForm.size,
                'md5': this.dataForm.md5,
                'suffix': this.dataForm.suffix,
                'module': this.dataForm.module,
                'businessId': this.dataForm.businessId,
                'createBy': this.dataForm.createBy,
                'createDate': this.dataForm.createDate,
                'remarks': this.dataForm.remarks,
                'delFlag': this.dataForm.delFlag
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