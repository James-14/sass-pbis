<template>
  <div class="app-container">
    <el-button type="primary" @click="gotoPage">跳转</el-button>
     <el-button type="primary" @click="getCurrentRout">当前路由信息</el-button>
  </div>
</template>

<script>
import { addRouter } from '@/utils/router-operation'

export default {
  created(){
    console.log(this.$route)
  },
  methods: {
    gotoPage() {    
    var routerList = [{
        path: '/test',
        component: 'layout/Layout',
        redirect: '/test1',
        name: 'Dashboard',
        hidden: true,
        children: [{
          path: 'test1/:repath',
          component:'demo/tableQuery',
          props:true
          //props: {url:'/component/routerRedirect'}
        }]
      }]
      addRouter(this.$router, routerList)
      //地址用横线隔开
      var params='component-routerRedirect'
      this.$router.push({path: `/test/test1/${params}`})
      //this.$router.push({path: '/test/test1/component-routerRedirect'})
    },
    getCurrentRout(){
       console.log(this.$route.name)
       console.log(this.$route.meta)
    }   
  }
}
</script>

   