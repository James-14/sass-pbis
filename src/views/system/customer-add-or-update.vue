<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="客户代码" prop="customerCode">
            <el-input v-model="dataForm.customerCode" placeholder="客户代码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户名称" prop="customerName">
            <el-input v-model="dataForm.customerName" placeholder="客户名称"></el-input>
          </el-form-item>          
        </el-col>
        <el-col :span="8">
          <dict-select label="客户类型" prop="customerType" placeholder="客户类型" dictCode="customerType" v-model="dataForm.customerType"></dict-select>          
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="联系人" prop="linkMan">
            <el-input v-model="dataForm.linkMan" placeholder="联系人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="dataForm.phone" placeholder="联系电话"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系地址" prop="addrs">
            <el-input v-model="dataForm.addrs" placeholder="联系地址"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="联系邮箱" prop="email">
            <el-input v-model="dataForm.email" placeholder="联系邮箱"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import DictSelect from '../components/dict-select'
  import AddOrUpdate from './module-add-or-update'

  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          customerId: 0,
          customerCode: '',
          customerName: '',
          customerType: '',
          linkMan: '',
          phone: '',
          addrs: '',
          email: '',
          enabled: '',
          createId: '',
          createName: '',
          createTime: '',
          remark: ''
        },
        dataRule: {
          customerCode: [
            { required: true, message: '客户代码不能为空', trigger: 'blur' },
          { min: 6, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur' }
          ],
          customerName: [
            { required: true, message: '客户名称不能为空', trigger: 'blur' },
          { min: 6, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur' }
          ],
          customerType: [
            { required: true, message: '客户类型不能为空', trigger: 'blur' }
          // ],
          // linkMan: [
          //   { required: true, message: '联系人不能为空', trigger: 'blur' }
          // ],
          // phone: [
          //   { required: true, message: '联系电话不能为空', trigger: 'blur' }
          // ],
          // addrs: [
          //   { required: true, message: '联系地址不能为空', trigger: 'blur' }
          // ],
          // email: [
          //   { required: true, message: '联系邮箱不能为空', trigger: 'blur' }
          // ],
          // enabled: [
          //   { required: true, message: '是否有效不能为空', trigger: 'blur' }
          // ],
          // createId: [
          //   { required: true, message: '创建人id不能为空', trigger: 'blur' }
          // ],
          // createName: [
          //   { required: true, message: '创建人名称不能为空', trigger: 'blur' }
          // ],
          // createTime: [
          //   { required: true, message: '创建时间不能为空', trigger: 'blur' }
          // ],
          // remark: [
          //   { required: true, message: '备注不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      DictSelect
    },
    methods: {
      init (id) {
        this.dataForm.customerId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.customerId) {
            this.$http({
              url: this.$http.adornUrl(`/sys/customer/info/${this.dataForm.customerId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.customerCode = data.customer.customerCode
                this.dataForm.customerName = data.customer.customerName
                this.dataForm.linkMan = data.customer.linkMan
                this.dataForm.phone = data.customer.phone
                this.dataForm.addrs = data.customer.addrs
                this.dataForm.email = data.customer.email
                this.dataForm.enabled = data.customer.enabled
                this.dataForm.createId = data.customer.createId
                this.dataForm.createName = data.customer.createName
                this.dataForm.createTime = data.customer.createTime
                this.dataForm.remark = data.customer.remark
                this.dataForm.customerType = parseInt(data.customer.customerType)
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
              url: this.$http.adornUrl(`/sys/customer/${!this.dataForm.customerId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'customerId': this.dataForm.customerId || undefined,
                'customerCode': this.dataForm.customerCode,
                'customerName': this.dataForm.customerName,
                'customerType': this.dataForm.customerType,
                'linkMan': this.dataForm.linkMan,
                'phone': this.dataForm.phone,
                'addrs': this.dataForm.addrs,
                'email': this.dataForm.email,
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