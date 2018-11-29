<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px" :inline="true" class="demo-form-inline">
    <el-form-item label="字典项代码" prop="itemCode">
      <el-input v-model="dataForm.itemCode" placeholder="字典项代码"></el-input>
    </el-form-item>
    <el-form-item label="字典项名称" prop="itemName">
      <el-input v-model="dataForm.itemName" placeholder="字典项名称"></el-input>
    </el-form-item>
    <el-form-item label="字典项值" prop="itemValue">
      <el-input v-model="dataForm.itemValue" placeholder="字典项值"></el-input>
    </el-form-item>
    <el-form-item label="字典项默认值" prop="itemDefaultvalue">
      <el-input v-model="dataForm.itemDefaultvalue" placeholder="字典项默认值"></el-input>
    </el-form-item>
    <el-form-item label="客户ID" prop="customerId" v-show="false">
      <el-input v-model="dataForm.customerId" placeholder="客户ID"></el-input>
    </el-form-item>
    <el-form-item label="应用ID" prop="appId" v-show="false">
      <el-input v-model="dataForm.appId" placeholder="应用ID"></el-input>
    </el-form-item>
    <el-form-item label="父ID全集" prop="pids" v-show="false">
      <el-input v-model="dataForm.pids" placeholder="父ID全集"></el-input>
    </el-form-item>
    <template v-if="attrName1 !== null && attrName1 !== undefined && attrName1 !== ''">
    <el-form-item :label="attrName1" prop="attr1">
      <el-input v-model="dataForm.attr1" :placeholder="attrName1"></el-input>
    </el-form-item>
    </template>
    <template v-if="attrName2 !== null && attrName2 !== undefined && attrName2 !== ''">
    <el-form-item :label="attrName2" prop="attr2">
      <el-input v-model="dataForm.attr2" :placeholder="attrName2"></el-input>
    </el-form-item>
    </template>
    <template v-if="attrName3 !== null && attrName3 !== undefined && attrName3 !== ''">
    <el-form-item :label="attrName3" prop="attr3">
      <el-input v-model="dataForm.attr3" :placeholder="attrName3"></el-input>
    </el-form-item>
    </template>
    <template v-if="attrName4 !== null && attrName4 !== undefined && attrName4 !== ''">
    <el-form-item :label="attrName4" prop="attr4">
      <el-input v-model="dataForm.attr4" :placeholder="attrName4"></el-input>
    </el-form-item>
    </template>
    <template v-if="attrName5 !== null && attrName5 !== undefined && attrName5 !== ''">
    <el-form-item :label="attrName5" prop="attr5">
      <el-input v-model="dataForm.attr5" :placeholder="attrName5"></el-input>
    </el-form-item>
    </template>
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
          itemId: 0,
          dictId: '',
          itemCode: '',
          itemName: '',
          itemValue: '',
          itemDefaultvalue: '',
          customerId: '',
          appId: '',
          attr1: '',
          attr2: '',
          attr3: '',
          attr4: '',
          attr5: '',
          pid: '',
          enabled: '',
          createId: '',
          createName: '',
          createTime: '',
          remark: '',
          pids: '',
          attrName1:'',
          attrName2:'',
          attrName3:'',
          attrName4:'',
          attrName5:''
        },
        dataRule: {
          itemCode: [
            { required: true, message: '字典项代码不能为空', trigger: 'blur' }
          ],
          itemName: [
            { required: true, message: '字典项名称不能为空', trigger: 'blur' }
          ],
          itemValue: [
            { required: true, message: '字典项值不能为空', trigger: 'blur' }
          // ],
          // itemDefaultvalue: [
          //   { required: true, message: '字典项默认值不能为空', trigger: 'blur' }
          // ],
          // customerId: [
          //   { required: true, message: '客户不能为空', trigger: 'blur' }
          // ],
          // appId: [
          //   { required: true, message: '应用不能为空', trigger: 'blur' }
          // ],
          // attr1: [
          //   { required: true, message: '参数1不能为空', trigger: 'blur' }
          // ],
          // attr2: [
          //   { required: true, message: '参数2不能为空', trigger: 'blur' }
          // ],
          // attr3: [
          //   { required: true, message: '参数3不能为空', trigger: 'blur' }
          // ],
          // attr4: [
          //   { required: true, message: '参数4不能为空', trigger: 'blur' }
          // ],
          // attr5: [
          //   { required: true, message: '参数5不能为空', trigger: 'blur' }
          // ],
          // pid: [
          //   { required: true, message: '父ID不能为空', trigger: 'blur' }
          // ],
          // remark: [
          //   { required: true, message: '备注不能为空', trigger: 'blur' }
          // ],
          // pids: [
          //   { required: true, message: '父ID全集不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id,attrName1,attrName2,attrName3,attrName4,attrName5){
        this.attrName1 = attrName1
        this.attrName2 = attrName2
        this.attrName3 = attrName3
        this.attrName4 = attrName4
        this.attrName5 = attrName5
        
        this.dataForm.itemId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.itemId) {
            this.$http({
              url: this.$http.adornUrl(`/sys/dictItem/info/${this.dataForm.itemId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.dictId = data.dictItem.dictId
                this.dataForm.itemCode = data.dictItem.itemCode
                this.dataForm.itemName = data.dictItem.itemName
                this.dataForm.itemValue = data.dictItem.itemValue
                this.dataForm.itemDefaultvalue = data.dictItem.itemDefaultvalue
                this.dataForm.customerId = data.dictItem.customerId
                this.dataForm.appId = data.dictItem.appId
                this.dataForm.attr1 = data.dictItem.attr1
                this.dataForm.attr2 = data.dictItem.attr2
                this.dataForm.attr3 = data.dictItem.attr3
                this.dataForm.attr4 = data.dictItem.attr4
                this.dataForm.attr5 = data.dictItem.attr5
                this.dataForm.pid = data.dictItem.pid
                this.dataForm.enabled = data.dictItem.enabled
                this.dataForm.createId = data.dictItem.createId
                this.dataForm.createName = data.dictItem.createName
                this.dataForm.createTime = data.dictItem.createTime
                this.dataForm.remark = data.dictItem.remark
                this.dataForm.pids = data.dictItem.pids
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
              url: this.$http.adornUrl(`/sys/dictItem/${!this.dataForm.itemId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'itemId': this.dataForm.itemId || undefined,
                'dictId': this.dataForm.dictId,
                'itemCode': this.dataForm.itemCode,
                'itemName': this.dataForm.itemName,
                'itemValue': this.dataForm.itemValue,
                'itemDefaultvalue': this.dataForm.itemDefaultvalue,
                'customerId': this.dataForm.customerId,
                'appId': this.dataForm.appId,
                'attr1': this.dataForm.attr1,
                'attr2': this.dataForm.attr2,
                'attr3': this.dataForm.attr3,
                'attr4': this.dataForm.attr4,
                'attr5': this.dataForm.attr5,
                'pid': this.dataForm.pid,
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