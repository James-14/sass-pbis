import Vue from 'vue'

//import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import i18n from './lang' // Internationalization

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

import axios from 'axios'
Vue.prototype.$axios = axios

import httpRequest from '@/utils/request'
Vue.prototype.$http = httpRequest // ajax请求方法

import constant from '@/utils/const'
import { isAuth } from '@/utils'
Vue.prototype.isAuth = isAuth // 权限方法
Vue.prototype.constant = constant // 常量对象

//Vue.use(ElementUI, { locale })
Vue.use(ElementUI, {
  //size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false

require('@/mock')

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
