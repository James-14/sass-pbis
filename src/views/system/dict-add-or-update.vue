<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px" :inline="true" class="demo-form-inline">
    <el-form-item label="字典代码" prop="dictCode">
      <el-input v-model="dataForm.dictCode" placeholder="字典代码"></el-input>
    </el-form-item>
    <el-form-item label="字典名称" prop="dictName">
      <el-input v-model="dataForm.dictName" placeholder="字典名称"></el-input>
    </el-form-item>
    <common-select label="权限类型" name="authType" prop="authType" placeholder="权限类型" 
    :qParam="{dictCode:'dictAuthType'}" url="/sys/dictItem/listNP" v-model="dataForm.authType">            
    </common-select>  
    <common-select label="字典类型" name="dictType" prop="dictType" placeholder="字典类型" 
    :qParam="{dictCode:'dictType'}" url="/sys/dictItem/listNP" v-model="dataForm.dictType">            
    </common-select>  
    <el-form-item label="代码名称相同" prop="isSame">
      <el-radio-group v-model="dataForm.isSame">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否树形" prop="isTree">
      <el-radio-group v-model="dataForm.isTree">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="父ID" prop="pid">
      <el-input v-model="dataForm.pid" placeholder="父ID"></el-input>
    </el-form-item>
    <el-form-item label="可选项" prop="options">
      <el-input v-model="dataForm.options" placeholder="可选项"></el-input>
    </el-form-item>
    <el-form-item label="参数1名称" prop="attrName1">
      <el-input v-model="dataForm.attrName1" placeholder="参数1名称"></el-input>
    </el-form-item>
    <el-form-item label="参数1可选项" prop="attrOptions1">
      <el-input v-model="dataForm.attrOptions1" placeholder="参数1可选项"></el-input>
    </el-form-item>
    <el-form-item label="参数1名称2" prop="attrName2">
      <el-input v-model="dataForm.attrName2" placeholder="参数1名称2"></el-input>
    </el-form-item>
    <el-form-item label="参数1可选项2" prop="attrOptions2">
      <el-input v-model="dataForm.attrOptions2" placeholder="参数1可选项2"></el-input>
    </el-form-item>
    <el-form-item label="参数1名称3" prop="attrName3">
      <el-input v-model="dataForm.attrName3" placeholder="参数1名称3"></el-input>
    </el-form-item>
    <el-form-item label="参数1可选项3" prop="attrOptions3">
      <el-input v-model="dataForm.attrOptions3" placeholder="参数1可选项3"></el-input>
    </el-form-item>
    <el-form-item label="参数1名称4" prop="attrName4">
      <el-input v-model="dataForm.attrName4" placeholder="参数1名称4"></el-input>
    </el-form-item>
    <el-form-item label="参数1可选项4" prop="attrOptions4">
      <el-input v-model="dataForm.attrOptions4" placeholder="参数1可选项4"></el-input>
    </el-form-item>
    <el-form-item label="参数1名称5" prop="attrName5">
      <el-input v-model="dataForm.attrName5" placeholder="参数1名称5"></el-input>
    </el-form-item>
    <el-form-item label="参数1可选项5" prop="attrOptions5">
      <el-input v-model="dataForm.attrOptions5" placeholder="参数1可选项5"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
    </el-form-item>
    <el-form-item label="父ID全集" prop="pids" v-show="flase">
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
  import  commonSelect from '@/views/components/common-select'
  export default {
    components: {
      commonSelect
    },
    data () {
      return {
        visible: false,
        dataForm: {
          dictId: 0,
          dictCode: '',
          dictName: '',
          authType: '',
          dictType: '',
          isSame: '',
          isTree: '',
          options: '',
          attrName1: '',
          attrOptions1: '',
          attrName2: '',
          attrOptions2: '',
          attrName3: '',
          attrOptions3: '',
          attrName4: '',
          attrOptions4: '',
          attrName5: '',
          attrOptions5: '',
          enabled: '',
          createId: '',
          createName: '',
          createTime: '',
          remark: '',
          pid: '',
          pids: ''
        },
        dataRule: {
          dictCode: [
            { required: true, message: '字典代码不能为空', trigger: 'blur' }
          ],
          dictName: [
            { required: true, message: '字典名称不能为空', trigger: 'blur' }
          ],
          authType: [
            { required: true, message: '权限类型不能为空', trigger: 'blur' }
          ],
          dictType: [
            { required: true, message: '字典类型不能为空', trigger: 'blur' }
          ],
          isSame: [
            { required: true, message: '代码名称相同不能为空', trigger: 'blur' }
          ],
          isTree: [
            { required: true, message: '是否树形不能为空', trigger: 'blur' }
          // ],
          // options: [
          //   { required: true, message: '可选项不能为空', trigger: 'blur' }
          // ],
          // attrName1: [
          //   { required: true, message: '参数1名称不能为空', trigger: 'blur' }
          // ],
          // attrOptions1: [
          //   { required: true, message: '参数1可选项不能为空', trigger: 'blur' }
          // ],
          // attrName2: [
          //   { required: true, message: '参数1名称2不能为空', trigger: 'blur' }
          // ],
          // attrOptions2: [
          //   { required: true, message: '参数1可选项2不能为空', trigger: 'blur' }
          // ],
          // attrName3: [
          //   { required: true, message: '参数1名称3不能为空', trigger: 'blur' }
          // ],
          // attrOptions3: [
          //   { required: true, message: '参数1可选项3不能为空', trigger: 'blur' }
          // ],
          // attrName4: [
          //   { required: true, message: '参数1名称4不能为空', trigger: 'blur' }
          // ],
          // attrOptions4: [
          //   { required: true, message: '参数1可选项4不能为空', trigger: 'blur' }
          // ],
          // attrName5: [
          //   { required: true, message: '参数1名称5不能为空', trigger: 'blur' }
          // ],
          // attrOptions5: [
          //   { required: true, message: '参数1可选项5不能为空', trigger: 'blur' }
          // ],
          // remark: [
          //   { required: true, message: '备注不能为空', trigger: 'blur' }
          // ],
          // pid: [
          //   { required: true, message: '父ID不能为空', trigger: 'blur' }
          // ],
          // pids: [
          //   { required: true, message: '父ID全集不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.dictId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.dictId) {
            this.$http({
              url: this.$http.adornUrl(`/sys/dict/info/${this.dataForm.dictId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.dictCode = data.dict.dictCode
                this.dataForm.dictName = data.dict.dictName
                this.dataForm.authType = data.dict.authType
                this.dataForm.dictType = data.dict.dictType
                this.dataForm.isSame = data.dict.isSame
                this.dataForm.isTree = data.dict.isTree
                this.dataForm.options = data.dict.options
                this.dataForm.attrName1 = data.dict.attrName1
                this.dataForm.attrOptions1 = data.dict.attrOptions1
                this.dataForm.attrName2 = data.dict.attrName2
                this.dataForm.attrOptions2 = data.dict.attrOptions2
                this.dataForm.attrName3 = data.dict.attrName3
                this.dataForm.attrOptions3 = data.dict.attrOptions3
                this.dataForm.attrName4 = data.dict.attrName4
                this.dataForm.attrOptions4 = data.dict.attrOptions4
                this.dataForm.attrName5 = data.dict.attrName5
                this.dataForm.attrOptions5 = data.dict.attrOptions5
                this.dataForm.enabled = data.dict.enabled
                this.dataForm.createId = data.dict.createId
                this.dataForm.createName = data.dict.createName
                this.dataForm.createTime = data.dict.createTime
                this.dataForm.remark = data.dict.remark
                this.dataForm.pid = data.dict.pid
                this.dataForm.pids = data.dict.pids
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
              url: this.$http.adornUrl(`/sys/dict/${!this.dataForm.dictId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'dictId': this.dataForm.dictId || undefined,
                'dictCode': this.dataForm.dictCode,
                'dictName': this.dataForm.dictName,
                'authType': this.dataForm.authType,
                'dictType': this.dataForm.dictType,
                'isSame': this.dataForm.isSame,
                'isTree': this.dataForm.isTree,
                'options': this.dataForm.options,
                'attrName1': this.dataForm.attrName1,
                'attrOptions1': this.dataForm.attrOptions1,
                'attrName2': this.dataForm.attrName2,
                'attrOptions2': this.dataForm.attrOptions2,
                'attrName3': this.dataForm.attrName3,
                'attrOptions3': this.dataForm.attrOptions3,
                'attrName4': this.dataForm.attrName4,
                'attrOptions4': this.dataForm.attrOptions4,
                'attrName5': this.dataForm.attrName5,
                'attrOptions5': this.dataForm.attrOptions5,
                'enabled': this.dataForm.enabled,
                'createId': this.dataForm.createId,
                'createName': this.dataForm.createName,
                'createTime': this.dataForm.createTime,
                'remark': this.dataForm.remark,
                'pid': this.dataForm.pid,
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