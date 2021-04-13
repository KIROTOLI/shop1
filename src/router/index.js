import Vue from 'vue'
import VueRouter from 'vue-router'


const logoin=()=>import('../components/logoin.vue')
const home=()=>import('../views/Home.vue')
const welcome=()=>import('../components/welcome.vue')
const users=()=>import('../components/user/users.vue')
const roles=()=>import('../components/rights/roles.vue')
const rights=()=>import('../components/rights/rights.vue')
const categories=()=>import('../components/goods/categories.vue')
const params=()=>import('../components/goods/params.vue')
const goods=()=>import('../components/goods/goods.vue')
const add=()=>import('../components/goods/add.vue')


Vue.use(VueRouter)

const routes = [
    {path:'/',redirect:'logoin'},
    {path:'/logoin',component:logoin},
    {
      path:'/home',
      component:home,
    redirect:'welcome',
      children:[
        {
          path:'/welcome',
          component:welcome
        },
        {
          path:'/users',
          component:users
        },
        {
          path:'/roles',
          component:roles
        },
        {
          path:'/rights',
          component:rights
        },{
          path:'/categories',
          component:categories
        },
        {
          path:'/params',
          component:params
        },
        {
          path:'/goods',
          component:goods
        },
        {
          path:'/home/add',
          component:add
        }
      ]
  }
 
  
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
