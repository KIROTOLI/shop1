<template>
  
<div class="home">
    <el-container class="home-container">
  <el-header class="header-out">
      <div class="headc">
          <img src="../assets/logo.png" alt="">
          <span>电商后台管理系统</span>
      </div>
      <el-button type='info' @click='logoout'>退出</el-button>
  </el-header>
  <el-container>
    <el-aside :width="istoggle ? '64px' :'200px'">
        <div class="togglemenu" @click='togglemenu'>|||</div>
         <el-menu
      class="el-menu-vertical-demo"
      background-color="#373744"
      text-color="#fff"
      active-text-color="#409bff"
      unique-opened
      :collapse='istoggle'
      :collapse-transition='false'
      router
        :default-active="this.$router.path">
      <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
        <template slot="title">
          <i :class="iconlist[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
          <el-menu-item :index="'/'+items.path+''" v-for="items in item.children" :key="items.id">
              <i class="el-icon-menu"></i>
          <span>{{items.authName}}</span>
              </el-menu-item>
     
      </el-submenu>

        </el-menu>
    </el-aside>
    <el-main>
        <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</div>
</template>

<script>
export default {
    created(){
        this.getmenulist()
    },
    data(){
        return{
            menulist:null,
            iconlist:{
                '125':'el-icon-user-solid',
                '103':'el-icon-s-platform',
                '101':'el-icon-s-cooperation',
                '102':'el-icon-s-order',
                '145':'el-icon-s-marketing',
            },
            istoggle:false
        }
    },
    name:'home',
    methods:{
        logoout(){
            window.sessionStorage.clear()
            this.$router.push('/logoin')
        },
        getmenulist(){
            console.log(window.sessionStorage.getItem('token'))
            this.$http.get('menus').then((res)=>{
                console.log(res.data.data)
                this.menulist=res.data.data
            })
        },
        togglemenu(){
            this.istoggle=!this.istoggle
        }
    }
}
</script>

<style>
.el-header{
    background-color: #373d41;
    padding-left: 0;
}
.el-aside{
    background-color: #373744;
    transition: 0.3s;
}
.el-main{
    background-color: #eaedf1;
}
.el-menu{
    border: none;
    
    
}

.home-container{
    height: 100vh;
   
}
/* body{
    background-color: #373744;
} */
.headc{
    display: flex;
    /* justify-content: flex-start; */
    align-items: center;
    
}
.headc img{
    height: 50px;
   
    
   
}
.headc span{
    margin-left: 20px;
}
.header-out{
    display: flex;
    justify-content: space-between;
    color: #fff;
    font-size: 20px;
    align-items: center;
}
.togglemenu{
    height: 24px;
    line-height: 24px;
    letter-spacing: 3px;
    text-align: center;
    cursor: pointer;
    font-size: 12px;
    color: #fff;

}

</style>

