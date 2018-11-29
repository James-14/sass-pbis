<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px" :inline="true" class="demo-form-inline">
      <el-form-item label="应用代码" prop="appCode">
        <el-input v-model="dataForm.appCode" placeholder="应用代码"></el-input>
      </el-form-item>
      <el-form-item label="应用名称" prop="appName">
        <el-input v-model="dataForm.appName" placeholder="应用名称"></el-input>
      </el-form-item>
      <common-select label="应用类型" name="appType" prop="appType" placeholder="应用类型" 
      :qParam="{dictCode:'appType'}" url="/sys/dictItem/listNP" v-model="dataForm.appType">            
      </common-select>          
      <el-form-item v-if="dataForm.type !== 2" label="应用图标" prop="icon">
          <el-row>
            <el-col :span="22">
              <el-popover
                ref="iconListPopover"
                placement="bottom-start"
                trigger="click"
                width="400"
                popper-class="mod-menu__icon-popover">
                <div class="mod-menu__icon-list">
                  <el-button
                    v-for="(item, index) in iconList"
                    :key="index"
                    @click="iconActiveHandle(item)"
                    :class="{ 'is-active': item === dataForm.icon }">
                    <icon-svg :name="item"></icon-svg>
                  </el-button>
                </div>
              </el-popover>
              <el-input v-model="dataForm.icon" v-popover:iconListPopover :readonly="true" placeholder="图标名称" class="icon-list__input"></el-input>
            </el-col>
            <el-col :span="2" class="icon-list__tips">
              <el-tooltip placement="top" effect="light">
                <div slot="content">全站推荐使用SVG Sprite, 详细请参考:<a href="//github.com/daxiongYang/renren-fast-vue/blob/master/src/icons/index.js" target="_blank">icons/index.js</a>描述</div>
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-form-item>
      <el-form-item label="客户" prop="customerId">
        <el-input v-model="dataForm.customerName" suffix-icon="el-icon-view"  @focus="dialogVisible = true"></el-input>
        <el-input v-model="dataForm.customerId" placeholder="客户"  v-show="false"></el-input>
      </el-form-item>
      <el-form-item label="有效">
        <el-radio-group v-model="dataForm.enabled">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>

    <customer-select-page :dialogVisible="dialogVisible" dialogTitle="选择客户"
            dialogWidth="70" :isMultip="false" :closeTip="false"
            v-on:select-confirm="selectConfirm" v-on:close-dialog="closeDialog"
    ></customer-select-page>

  </el-dialog>
</template>

<script>
  import Icon from '@/icons'
  import  customerSelectPage from '@/views/components/customer-select-page'
  import  commonSelect from '@/views/components/common-select'
  export default {
    components: {
    customerSelectPage,
    commonSelect
    },
    data () {
      return {
        innerVisible: false,
        dialogVisible: false,
        visible: false,
        iconList: [],
        dataForm: {
          appId: 0,
          appCode: '',
          appName: '',
          appType: '',
          icon: '',
          customerId: '',
          remark: '',
          enabled: '1',
          createId: '',
          createName: '',
          createTime: ''          
        },
        dataRule: {
          appCode: [
            { required: true, message: '应用代码不能为空', trigger: 'blur' },
          { min: 6, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur' }
          ],
          appName: [
            { required: true, message: '应用名称不能为空', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
          ],
          appType: [
            { required: true, message: '应用类型不能为空', trigger: 'blur' }
          ],
          icon: [
            { required: true, message: '应用图标不能为空', trigger: 'blur' }
          ],
          enabled: [
            { required: true, message: '是否有效不能为空', trigger: 'blur' }
          // ],
          // createId: [
          //   { required: true, message: '创建人id不能为空', trigger: 'blur' }
          // ],
          // createName: [
          //   { required: true, message: '创建人名称不能为空', trigger: 'blur' }
          // ],
          // createTime: [
          //   { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.iconList = Icon.getNameList()
    },
    methods: {
      // 图标选中
      iconActiveHandle (iconName) {
        this.dataForm.icon = iconName
      },
      closeDialog() {
        this.dialogVisible = false
      },
      selectConfirm: function(selectData) {
        this.dataForm.customerId = selectData.customerId,
        this.dataForm.customerName = selectData.customerName
      },
      init (id) {
        this.dataForm.appId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.appId) {
            this.$http({
              url: this.$http.adornUrl(`/sys/application/info/${this.dataForm.appId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.appCode = data.app.appCode
                this.dataForm.appName = data.app.appName
                this.dataForm.appType = data.app.appType
                this.dataForm.icon = data.app.icon
                this.dataForm.customerName = data.app.customerName
                this.dataForm.customerId = data.app.customerId
                this.dataForm.remark = data.app.remark
                this.dataForm.enabled = data.app.enabled
                this.dataForm.createId = data.app.createId
                this.dataForm.createName = data.app.createName
                this.dataForm.createTime = data.app.createTime
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        //console.log(this.dataForm);
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/application/${!this.dataForm.appId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'appId': this.dataForm.appId || undefined,
                'appCode': this.dataForm.appCode,
                'appName': this.dataForm.appName,
                'appType': this.dataForm.appType,
                'icon': this.dataForm.icon,
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
.mod-menu {
    .menu-list__input,
    .icon-list__input {
       > .el-input__inner {
        cursor: pointer;
      }
    }
    &__icon-popover {
      max-width: 370px;
    }
    &__icon-list {
      max-height: 180px;
      padding: 0;
      margin: -8px 0 0 -8px;
      > .el-button {
        padding: 8px;
        margin: 8px 0 0 8px;
        > span {
          display: inline-block;
          vertical-align: middle;
          width: 18px;
          height: 18px;
          font-size: 18px;
        }
      }
    }
    .icon-list__tips {
      font-size: 18px;
      text-align: center;
      color: #e6a23c;
      cursor: pointer;
    }
  }
</style>