import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/common.css'
import axios from 'axios'


import TreeTable from 'vue-table-with-tree-grid'

import vuequilleditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'

//axios请求拦截
axios.interceptors.request.use(config=>{
  //为请求头添加token验证的authorization字段
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http=axios

Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)
Vue.use(vuequilleditor)

// 创建时间过滤器
Vue.filter('dataformat',function(origin){
  const dt =new Date(origin)

  const y=dt.getFullYear()
  const m=(dt.getMonth()+1+'').padStart(2,'0')
  const d=(dt.getDay()+'').padStart(2,'0')

  const hh=(dt.getHours()+'').padStart(2,'0')
  const mm=(dt.getMinutes()+'').padStart(2,'0')
  const ss=(dt.getSeconds()+'').padStart(2,'0')

  return `${y}-${m}-${d}  ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
