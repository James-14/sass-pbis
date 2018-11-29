<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible" 
    >
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px" 
    :inline="true" class="demo-form-inline">
    <el-form-item label="模块代码" prop="moduleCode">
      <el-input v-model="dataForm.moduleCode" placeholder="模块代码" v-bind:readonly="isRef"></el-input>
    </el-form-item>
    <el-form-item label="模块名称" prop="moduleName">
      <el-input v-model="dataForm.moduleName" placeholder="模块名称"></el-input>
    </el-form-item>
    <!-- <el-form-item label="模块类型" prop="moduleType">
      <el-input v-model="dataForm.moduleType" placeholder="模块类型"></el-input>
    </el-form-item> -->
    <common-select label="模块类型" v-bind:disabled="isRef" name="moduleType" prop="moduleType" placeholder="模块类型" 
    :qParam="{dictCode:'moduleType'}" url="/sys/dictItem/listNP" v-model="dataForm.moduleType" 
    @change="changeModuleType" ref="moduleType">            
    </common-select>   
    <el-form-item v-if="dataForm.type !== 2" label="图标" prop="moduleIcon">
      <el-row>
        <el-col :span="22">
          <el-popover
            ref="iconListPopover"
            placement="bottom-start"
            trigger="click"
            width="300"
            popper-class="mod-menu__icon-popover">
            <div class="mod-menu__icon-list">
              <el-button
                v-for="(item, index) in iconList"
                :key="index"
                @click="iconActiveHandle(item)"
                :class="{ 'is-active': item === dataForm.moduleIcon }">
                <icon-svg :name="item"></icon-svg>
              </el-button>
            </div>
          </el-popover>
          <el-input v-model="dataForm.moduleIcon" v-popover:iconListPopover :readonly="true" placeholder="图标名称" class="icon-list__input"></el-input>
        </el-col>
        <el-col :span="2" class="icon-list__tips">
          <el-tooltip placement="top" effect="light">
            <div slot="content">全站推荐使用SVG Sprite, 详细请参考:<a href="//github.com/daxiongYang/renren-fast-vue/blob/master/src/icons/index.js" target="_blank">icons/index.js</a>描述</div>
            <i class="el-icon-warning"></i>
          </el-tooltip>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="父ID" prop="pid">
      <el-input v-model="dataForm.pname" suffix-icon="el-icon-view"  @focus="dialogVisible = true"></el-input>
      <el-input v-model="dataForm.pid" v-show="false"></el-input>
    </el-form-item>
    <el-form-item label="模块引用" prop="refId">
      <el-input v-model="dataForm.refName" suffix-icon="el-icon-view"  @focus="refDialogVisible = true"></el-input>
      <el-input v-model="dataForm.refId" v-show="false"></el-input>
    </el-form-item>
    <el-form-item label="数据权限控制" prop="ctrlData">
      <el-select v-model="dataForm.ctrlData" placeholder="数据权限控制">
        <el-option value="0" label="无"/>
        <el-option value="1" label="行、列权限"/>
        <el-option value="2" label="行权限"/>
        <el-option value="3" label="列权限"/>
      </el-select>
    </el-form-item>
    <el-form-item label="机构权限控制" prop="ctrlOrg">
      <el-select v-model="dataForm.ctrlOrg" placeholder="机构权限控制">
        <el-option value="0" label="所有"/>
        <el-option value="1" label="自己"/>
        <el-option value="2" label="自定义"/>
      </el-select>
    </el-form-item>
    <el-form-item label="前端组件" prop="component">
      <el-input v-model="dataForm.component" placeholder="前端组件" v-bind:readonly="isRef"></el-input>
    </el-form-item>
    <el-form-item label="默认跳转地址" prop="redirect">
      <el-input v-model="dataForm.redirect" placeholder="默认跳转地址"></el-input>
    </el-form-item>
    <el-form-item label="排序号" prop="num">
      <el-input v-model="dataForm.num" placeholder="排序号"></el-input>
    </el-form-item>
    <el-form-item label="URL" prop="url">
      <el-input v-model="dataForm.url" placeholder="URL" v-bind:readonly="isSubPage"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
    </el-form-item>
    <!-- <el-form-item label="创建人id" prop="createId">
      <el-input v-model="dataForm.createId" placeholder="创建人id"></el-input>
    </el-form-item>
    <el-form-item label="创建人名称" prop="createName">
      <el-input v-model="dataForm.createName" placeholder="创建人名称"></el-input>
    </el-form-item>
    <el-form-item label="创建时间" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
    </el-form-item> -->
    <el-form-item label="是否隐藏" prop="hidden">
      <el-radio-group v-model="dataForm.hidden">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否有效" prop="enabled">
      <el-radio-group v-model="dataForm.enabled">
        <el-radio :label="1">有效</el-radio>
        <el-radio :label="0">无效</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="appId" prop="appId" v-show="false">
      <el-input v-model="dataForm.appId" placeholder="appId"></el-input>
    </el-form-item>
    <el-form-item label="级次" prop="level" v-show="false">
      <el-input v-model="dataForm.level" size="small" placeholder="级次"></el-input>
    </el-form-item>
    <el-form-item label="父ID全集" prop="pids" v-show="false">
      <el-input v-model="dataForm.pids" placeholder="父ID全集"></el-input>
    </el-form-item>
    <el-form-item label="是否打开" prop="isOpen" v-show="false">
      <el-radio-group v-model="dataForm.isOpen">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否菜单" prop="isMenu" v-show="false">
      <el-radio-group v-model="dataForm.isMenu">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="排序号" prop="num" v-show="false">
      <el-input v-model="dataForm.num" placeholder="排序号"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <common-select-page :dialogVisible="dialogVisible" dialogTitle="选择父模块"
          url="/sys/module/module4select" :cParam="{enabled:1,moduleTypeStr:'7,8'}" :qHead="[['模块ID','id'],['模块代码','moduleCode'],['模块名','moduleName'],['级次','level'],['父ID全集','pids']]"
            dialogWidth="70" :isMultip="false" :closeTip="false"
            v-on:select-confirm="selectConfirm" v-on:close-dialog="closeDialog"
    ></common-select-page>
    <common-select-page :dialogVisible="refDialogVisible" dialogTitle="选择引用模块"
          url="/sys/module/module4select" :cParam="{enabled:1,moduleType:8,isRef:1}" :qHead="[['模块ID','id'],['模块代码','moduleCode'],['模块名','moduleName'],['级次','level'],['父ID全集','pids']]"
            dialogWidth="70" :isMultip="false" :closeTip="false"
            v-on:select-confirm="selectRefConfirm" v-on:close-dialog="closeRefDialog"
    ></common-select-page>
  </el-dialog>
</template>

<script>
  import Icon from '@/icons'
  import commonSelectPage from '@/views/components/common-select-page'
  import commonSelect from '@/views/components/common-select'

  export default {
    components: {
      commonSelectPage,
      commonSelect
    },
    data () {
      return {
        isRef: false,
        isSubPage: false,
        dialogVisible: false,
        refDialogVisible: false,
        visible: false,
        dataForm: {
          moduleId: 0,
          moduleCode: '',
          moduleName: '',
          moduleType: '',
          moduleIcon: '',
          refId: '',
          refName: '',
          pid: '',
          pname: '',
          redirect: '',
          component: 'layout/Layout',
          hidden: '0',
          isOpen: '',
          isMenu: '',
          enabled: '1',
          level: '',
          num: '',
          createId: '',
          createName: '',
          createTime: '',
          remark: '',
          pids: '',
          url: '',
          ctrlData: '',
          ctrlOrg: '',
          iconList: []
        },
        dataRule: {
          moduleCode: [
            { required: true, message: '模块代码不能为空', trigger: 'blur' }
          ],
          moduleName: [
            { required: true, message: '模块名称不能为空', trigger: 'blur' }
          ],
          moduleType: [
            { required: true, message: '模块类型不能为空', trigger: 'blur' }
          ],
          moduleIcon: [
            { required: true, message: '模块图标不能为空', trigger: 'blur' }
          ],
          pname: [
            { required: true, message: '父模块不能为空', trigger: 'blur' }
          ],
          // pid: [
          //   { required: true, message: '父ID不能为空', trigger: 'blur' }
          // ],
          // redirect: [
          //   { required: true, message: '默认跳转地址不能为空', trigger: 'blur' }
          // ],
          component: [
            { required: true, message: '前端组件不能为空', trigger: 'blur' }
          // ],
          // hidden: [
          //   { required: true, message: '是否隐藏不能为空', trigger: 'blur' }
          // ],
          // isOpen: [
          //   { required: true, message: '是否打开不能为空', trigger: 'blur' }
          // ],
          // isMenu: [
          //   { required: true, message: '是否菜单不能为空', trigger: 'blur' }
          // ],
          // enabled: [
          //   { required: true, message: '是否有效不能为空', trigger: 'blur' }
          // ],
          // level: [
          //   { required: true, message: '级次不能为空', trigger: 'blur' }
          // ],
          // num: [
          //   { required: true, message: '排序号不能为空', trigger: 'blur' }
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
          // ],
          // pids: [
          //   { required: true, message: '父ID全集不能为空', trigger: 'blur' }
          // ],
          // url: [
          //   { required: true, message: 'URL不能为空', trigger: 'blur' }
          // ],
          // ctrlData: [
          //   { required: true, message: '数据权限控制不能为空', trigger: 'blur' }
          // ],
          // ctrlOrg: [
          //   { required: true, message: '机构权限控制(0所有1自己2自定义不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      this.iconList = Icon.getNameList()
    },
    methods: {
      init (id) {
        this.dataForm.moduleId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.moduleId) {
            this.$http({
              url: this.$http.adornUrl(`/sys/module/info/${this.dataForm.moduleId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.moduleCode = data.module.moduleCode
                this.dataForm.moduleName = data.module.moduleName
                this.dataForm.moduleType = parseInt(data.module.moduleType)
                //this.$refs.moduleTypeSelect.setValue(data.module.moduleType)
                this.dataForm.moduleIcon = data.module.moduleIcon
                this.dataForm.refId = data.module.refId
                this.dataForm.refName = data.module.refName
                this.dataForm.pname = data.module.pname
                this.dataForm.pid = data.module.pid
                this.dataForm.redirect = data.module.redirect
                this.dataForm.component = data.module.component
                this.dataForm.hidden = data.module.hidden
                this.dataForm.isOpen = data.module.isOpen
                this.dataForm.isMenu = data.module.isMenu
                this.dataForm.enabled = data.module.enabled
                this.dataForm.level = data.module.level
                this.dataForm.num = data.module.num
                this.dataForm.createId = data.module.createId
                this.dataForm.createName = data.module.createName
                this.dataForm.createTime = data.module.createTime
                this.dataForm.remark = data.module.remark
                this.dataForm.pids = data.module.pids
                this.dataForm.url = data.module.url
                this.dataForm.ctrlData = data.module.ctrlData
                this.dataForm.ctrlOrg = data.module.ctrlOrg
              }
            })
          // }else{
          //   this.$refs.moduleTypeSelect.setValue(this.dataForm.moduleType)
          }
        })
        // this.$refs.moduleType.change()//不起作用
        this.changeModuleType()
      },
      changeModuleType() {
        if(this.dataForm.moduleType == 10 ){
          this.isSubPage = false
        }else{
          this.isSubPage = true
        }
      },
      closeDialog() {
        this.dialogVisible = false
      },
      selectConfirm: function(selectData) {
        this.dataForm.pid = selectData.moduleId,
        this.dataForm.pname = selectData.moduleName
        this.dataForm.level = parseInt(selectData.level)+1
        let pids = ''
        if(selectData.pids != null && selectData.pids != '' && typeof(selectData.pids) != 'undefined'){
          pids = selectData.pids + ','
        }
        this.dataForm.pids = pids + selectData.moduleId
      },
      closeRefDialog() {
        this.refDialogVisible = false
      },
      selectRefConfirm: function(selectData) {
        this.isRef = true
        this.dataForm.refId = selectData.moduleId,
        this.dataForm.refName = selectData.moduleName
        this.dataForm.moduleCode = selectData.moduleCode
        this.dataForm.moduleName = selectData.moduleName
        this.dataForm.moduleType = selectData.moduleType
        // this.$refs.moduleTypeSelect.setValue(parseInt(selectData.moduleType))
        this.dataForm.moduleIcon = selectData.moduleIcon
        this.dataForm.redirect = selectData.redirect
        this.dataForm.component = selectData.component
      },
      // 图标选中
      iconActiveHandle (iconName) {
        this.dataForm.moduleIcon = iconName
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/module/${!this.dataForm.moduleId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'moduleId': this.dataForm.moduleId || undefined,
                'moduleCode': this.dataForm.moduleCode,
                'moduleName': this.dataForm.moduleName,
                'moduleType': this.dataForm.moduleType,
                'moduleIcon': this.dataForm.moduleIcon,
                'pid': this.dataForm.pid,
                'redirect': this.dataForm.redirect,
                'component': this.dataForm.component,
                'hidden': this.dataForm.hidden,
                'isOpen': this.dataForm.isOpen,
                'isMenu': this.dataForm.isMenu,
                'enabled': this.dataForm.enabled,
                'level': this.dataForm.level,
                'num': this.dataForm.num,
                'createId': this.dataForm.createId,
                'createName': this.dataForm.createName,
                'createTime': this.dataForm.createTime,
                'remark': this.dataForm.remark,
                'pids': this.dataForm.pids,
                'url': this.dataForm.url,
                'ctrlData': this.dataForm.ctrlData,
                'ctrlOrg': this.dataForm.ctrlOrg
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
//  .el-form-item__content .el-input{
//     width:200px
//   }
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