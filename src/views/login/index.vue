<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <h3 class="title">SAAS云平台</h3>
      <el-form-item prop="username">
        <span class="svg-container">
          <!-- <svg-icon icon-class="user" /> -->
          <icon-svg name="user" class="site-sidebar__menu-icon"></icon-svg>
        </span>
        <el-input v-model="loginForm.username" name="username" type="text" auto-complete="on" placeholder="username" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <!-- <svg-icon icon-class="password" /> -->
          <icon-svg name="password" class="site-sidebar__menu-icon"></icon-svg>
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="on"
          placeholder="password"
          @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <!-- <svg-icon icon-class="eye" /> -->
          <icon-svg name="eye" class="site-sidebar__menu-icon"></icon-svg>
        </span>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
          Sign in
        </el-button>
      </el-form-item>
      <!-- <div class="tips">
        <span>{{ $t('login.username') }} : admin</span>
        <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
      </div>
      <div class="tips">
        <span style="margin-right:18px;">{{ $t('login.username') }} : editor</span>
        <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
      </div> -->
    </el-form>
    <app-select :dialogVisible="dialogVisible" dialogTitle="选择应用"
    dialogWidth="40"  :closeTip="false" :radioArray="appList" :defaultID="appID"
    v-on:select-confirm="selectConfirm" v-on:close-dialog="closeDialog"
    ></app-select>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import appSelect from './app-select'
import { setAPPID, getAPPID, setCustomerID, setAppName } from '@/utils/auth'

export default {
  name: 'Login',
  components: { appSelect },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      appList:[],
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined,
      appID:-1
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    closeDialog() {
      this.dialogVisible = false
    },
    selectConfirm: function(appID,customer) {
      var oldAPPID=getAPPID()
      setAPPID(appID)
      setCustomerID(customer.customerID)
      setAppName(customer.customerName)
      if(oldAPPID != appID){
         this.$router.push({ path: '/' })
      }
      else
      {
        this.$router.push({ path: this.redirect || '/' })
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then((data) => {
            if(data.appList.length==1 && data.appList[0].subAppList.length==1){
              setAPPID(data.appList[0].subAppList[0].app_id)
              setCustomerID(data.appList[0].customerId)
              setAppName(data.appList[0].customerName)
              this.$router.push({ path: '/' })
            }
            else
            {
              this.loading = false
              this.dialogVisible=true
              this.appList=data.appList
              this.setDefaultAPPID()
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    setDefaultAPPID(){
      this.appList.forEach((element,index) => {
        if(index==0){
          this.appID=element.subAppList[0].app_id
        }
        element.subAppList.forEach((subapp,index)=>{
          if(subapp.is_default && subapp.is_default==1)
            {
                this.appID=subapp.app_id
            }
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
