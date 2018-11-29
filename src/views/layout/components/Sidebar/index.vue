<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <div :class="headerClass">
      <h1 style="font-size: 20px">{{appName}}</h1> 
    </div>
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item v-for="route in routes" :key="route.name" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import { getAppName } from '@/utils/auth'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    headerClass(){
      return this.sidebar.opened?"logo-header":"logo-header-up"
    },
    appName(){
      return getAppName()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .logo-header{
    overflow: hidden;
    height: 50px;
    background-color: #17b3a3;
    color: #FFF;
    text-align: center;
    white-space: nowrap;
    width: 180px;
    position: fixed;
    z-index: 1000;
  }
  .logo-header-up{
    overflow: hidden;
    height: 50px;
    background-color: #17b3a3;
    color: #FFF;
    text-align: center;
    white-space: nowrap;
    width: 36px;
  }
</style>

