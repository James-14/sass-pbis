<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <breadcrumb />
    <el-dropdown key="positon" class="position-select"  @command="handleCommand">
      <span>{{position}}<i class="el-icon-arrow-down el-icon--right"></i></span>
      <el-dropdown-menu slot="dropdown">
         <el-dropdown-item v-for="item in positions" :key="item.command" :command="item.command">{{item.text}}</el-dropdown-item>
        <!-- <el-dropdown-item command="a">狮子头</el-dropdown-item>
        <el-dropdown-item command="b">螺蛳粉</el-dropdown-item>
        <el-dropdown-item command="c">双皮奶</el-dropdown-item>
        <el-dropdown-item command="d">蚵仔煎</el-dropdown-item> -->
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown key="profile" class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
        <i class="el-icon-caret-bottom"/>
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            Home
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span style="display:block;" @click="logout">LogOut</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  data(){
    return {
      position:'項目經理',
      positions:[
        {command:'a',text:'狮子头'},
        {command:'b',text:'螺蛳粉'},
        {command:'c',text:'双皮奶'},
        {command:'d',text:'蚵仔煎'}
        ]
    }
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
      location.reload()   // 为了重新实例化vue-router对象 避免bug
      })
    },
    handleCommand(command) {
        // alert(command);
        window.location.reload()
      }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
  .position-select{
    vertical-align: top;
    display: inline-block;
    position: absolute;
    right: 100px;
  }
   .position-select + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>

