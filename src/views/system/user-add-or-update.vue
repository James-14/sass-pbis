<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px" :inline="true" class="demo-form-inline">
    <el-col :span="24">
      <el-form-item label="头像">
          <avatar-upload ref="upload" :aImageUrl="picName" aUrl="/user/avatarUpload" @avatarHandler="avatarHandler" suffix="jpg,png,gif"></avatar-upload>
          <el-input v-model="dataForm.pic"  placeholder="图片地址" v-show="false"></el-input>
      </el-form-item>
    </el-col>
    <template v-if="seen">
      <el-col :span="12">
        <el-form-item label="机构名称">
          <el-input v-model="dataForm.orgName" suffix-icon="el-icon-view" @focus="orgTreeVisible=true" placeholder="机构名称"></el-input>
          <el-input v-model="dataForm.orgId" placeholder="机构ID" v-show="false"></el-input>
        </el-form-item>
        <tree-select-page :dialogVisible="orgTreeVisible" dialogTitle="选择机构"
        dialogWidth="30"  :closeTip="false" 
        v-on:select-confirm="selectOrgConfirm" 
        v-on:close-dialog="closeOrgTreeDialog"
        treeUrl="/sys/org/getTreeList"
        ></tree-select-page>
      </el-col>
    </template>
    <el-col :span="12">
    <el-form-item label="用户名称" prop="userName">
      <el-input v-model="dataForm.userName" :readonly="nameReadOnly" placeholder="用户名称"></el-input>
    </el-form-item>
    </el-col>
    <el-col :span="12">
    <common-select label="用户类型" name="userType" prop="userType" placeholder="用户类型" 
      :qParam="{dictCode:'userType'}" url="/sys/dictItem/listNP" v-model="dataForm.userType">            
    </common-select>
    </el-col>
    <el-col :span="12">
    <el-form-item label="性别" prop="sex">
      <el-radio-group key="sex" v-model="dataForm.sex">
        <el-radio label="1">男</el-radio>
        <el-radio label="2">女</el-radio>
      </el-radio-group>
    </el-form-item>
    </el-col>
    <el-col :span="12">
    <common-select label="区域" name="region" prop="region" placeholder="区域" 
      :qParam="{dictCode:'regionType'}" url="/sys/dictItem/listNP" v-model="dataForm.region">            
    </common-select>
    </el-col>
    <el-col :span="12">
    <el-form-item label="手机号" prop="phone">
      <el-input v-model="dataForm.phone" placeholder="手机号"></el-input>
    </el-form-item>
    </el-col>
    <el-col :span="12">
    <el-form-item label="邮件" prop="email">
      <el-input v-model="dataForm.email" placeholder="邮件"></el-input>
    </el-form-item>
    </el-col>    
    <el-col :span="12">
    <el-form-item label="地址" prop="adds">
      <el-input v-model="dataForm.adds" placeholder="地址"></el-input>
    </el-form-item>
    </el-col>
    <el-col :span="12">
    <el-form-item key="status" label="状态" prop="status">
      <el-radio-group v-model="dataForm.status">
        <el-radio label="1">启用</el-radio>
        <el-radio label="2">冻结</el-radio>
      </el-radio-group>
    </el-form-item>
    </el-col>
    <el-col :span="12">
    <el-form-item label="备注" prop="remark">
      <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
    </el-form-item>
    </el-col>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import treeSelectPage from '@/views/components/tree-select-page'
  import  commonSelect from '@/views/components/common-select'
  import avatarUpload from '@/views/components/avatar-upload'
  export default {
    data () {
      return {
        visible: false,
        seen: false,
        orgTreeVisible: false,
        orgId:-1,
        nameReadOnly:false,
        picName:'',
        dataForm: {
          userId: 0,
          userName: '',
          userType: 0,
          sex: 0,
          region: 0,
          phone: '',
          email: '',
          pic: '',
          adds: '',
          status: 0,         
          remark: ''
        },
        dataRule: {
          orgId:[
            { required: true, message: '组织机构不能为空', trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '用户名称不能为空', trigger: 'blur' }
          ],
          userType: [
            { required: true, message: '用户类型不能为空', trigger: 'blur' }
          ],
          sex: [
            { required: true, message: '性别不能为空', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '区域不能为空', trigger: 'blur' }
          ],
          phone: [
            { min: 6, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur' }
          ],
          email: [
            { min: 6, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur' }
          ],
          adds: [
            { required: true, message: '地址不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      treeSelectPage,
      commonSelect,
      avatarUpload
    },
    methods: {
      init (id,orgId) {
        this.dataForm.id = id
        this.dataForm.userId = id || 0
        this.orgId = orgId
         this.picName = Date.parse(new Date())
         this.dataForm.orgId = -1
         this.dataForm.orgName = ''
         this.nameReadOnly = false
        if(null==orgId||-1 == orgId){
          this.seen = true
        }
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.userId) {
            this.$http({
              url: this.$http.adornUrl(`/user/uInfo/${this.dataForm.userId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.seen = false
                this.nameReadOnly = true
                this.dataForm.account = data.user.account
                this.dataForm.userName = data.user.userName
                this.dataForm.userType = data.user.userType
                this.dataForm.pass = data.user.pass
                this.dataForm.salt = data.user.salt  
                this.picName = '/api'+data.user.picUrl              
                this.dataForm.sex = data.user.sex
                this.dataForm.region = data.user.region
                this.dataForm.phone = data.user.phone
                this.dataForm.email = data.user.email
                this.dataForm.pic = data.user.pic
                this.dataForm.adds = data.user.adds                
                this.dataForm.status = data.user.status+''                
                this.dataForm.remark = data.user.remark
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
              url: this.$http.adornUrl(`/user/${!this.dataForm.userId ? 'add' : 'modify'}`),
              method: 'post',
              data: this.$http.adornData({
                'userId': this.dataForm.userId || undefined,
                'userName': this.dataForm.userName,
                'userType': this.dataForm.userType,
                'sex': this.dataForm.sex,
                'region': this.dataForm.region,
                'phone': this.dataForm.phone,
                'email': this.dataForm.email,
                'pic': this.dataForm.pic,
                'adds': this.dataForm.adds,
                'status': this.dataForm.status,
                'remark': this.dataForm.remark
              })
            }).then(({data}) => {
              var content = "";
              if(!this.dataForm.userId){content=",用户名："+data.data.account+",初始密码："+data.data.pass;}else{content="";}
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功'+content,
                  type: 'success',
                  duration: 2000,
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
      selectOrgConfirm: function(selectData) {
        var orgIds = new Array()
        var orgNames = new Array()
        for(var i =0;i<selectData.length;i++){
            orgIds.push(selectData[i].id)
            orgNames.push(selectData[i].label)
        }
        this.dataForm.orgId = orgIds.toString()
        this.dataForm.orgName = orgNames.toString()
      },
      closeOrgTreeDialog() {
        this.orgTreeVisible = false
      },
      avatarHandler(value){
       // console.log(value)
        this.dataForm.pic = value
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.last-item-position {
  text-align: right;
}
</style>
