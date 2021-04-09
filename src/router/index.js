import Vue from 'vue'
import VueRouter from 'vue-router'

const logoin=()=>import('../components/logoin.vue')
const home=()=>import('../views/Home.vue')


Vue.use(VueRouter)

const routes = [
    {path:'/',redirect:'logoin'},
    {path:'/logoin',component:logoin},
    {path:'/home',component:home}
 
  
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next)=>{
  if(to.path === '/logoin') return next()
  const tokenstr=window.sessionStorage.getItem('token')
  if(!tokenstr) return next('/logoin')
  next()
})


export default router
