<template>
  <div>
      <!-- 面包屑导航 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>   
    </el-breadcrumb>
    <el-card class="rights-card">
        <el-table :data='rightlist'>
        <el-table-column type='index' ></el-table-column>
        <el-table-column label='权限名称' prop='authName'></el-table-column>
        <el-table-column label='路径' prop='path'></el-table-column>
        <el-table-column label='权限等级'>
            <template v-slot='scope'>
                <el-tag v-if='scope.row.level==="1"'>一级</el-tag>
                <el-tag type="success" v-else-if="scope.row.level==='2'">二级</el-tag>

                <el-tag type="warning" v-else>三级</el-tag>
            </template>
        </el-table-column>
        </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
    name:'rights',
    data(){
        return{
            rightlist:[],
        }
    },
    created(){
        this.getrightlist()
    },
    methods:{
        getrightlist(){
            this.$http.get('rights/list').then((res)=>{
                // console.log(res)
                if(res.data.meta.status!==200) return this.$message.error('获取用户列表失败')
                this.rightlist=res.data.data
                console.log(this.rightlist)
            })
        }
    }
}
</script>

<style scoped>
.rights-card{
    margin-top: 20px;
}
</style>