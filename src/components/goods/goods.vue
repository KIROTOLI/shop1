<template>
  <div>
            <!-- 面包屑导航 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>   
    </el-breadcrumb>
    <el-card>
        <el-row>
            <el-col :span='8'>
                <el-input placeholder="请输入内容" class="input-with-select" v-model="getgood.query" clearable @clear='clearinfo'>
    
                <el-button slot="append" icon="el-icon-search" @click="getgoods"></el-button>
            </el-input>
            </el-col>
            <el-col :span='4' style="margin-left:20px">
                <el-button type='primary' @click="toaddgoods">添加商品</el-button>
            </el-col>
        </el-row>

        <el-table  :data='this.goodslist' border>
            <el-table-column type='index'></el-table-column>
            <el-table-column label='商品名称' prop='goods_name' ></el-table-column>
            <el-table-column label='商品价格(元)' prop='goods_price' width='120px'></el-table-column>
            <el-table-column label='商品重量' prop='goods_weight' width='90px'></el-table-column>
            <el-table-column label='创建时间' prop='upd_time' width='200px'>
                <template v-slot='scope'>{{scope.row.upd_time | dataformat}}</template>
            </el-table-column>
            <el-table-column label='操作' width='200px'>
                <template v-slot='scope'>
                <el-button type='primary' icon='el-icon-edit' size='mini' >编辑</el-button>
                <el-button type='warning'  icon='el-icon-delete' size='mini' @click="removegoods(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        
         <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="getgood.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="getgood.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
    name:'vue',
    data(){
        return{
            getgood:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            goodslist:[],
            total:0
        }
    },
    created(){
        this.getgoods()
    },
    methods:{
        getgoods(){
            this.$http.get('goods',{
                params:this.getgood
            })
            .then((res)=>{
                console.log(res.data.data)
                if(res.data.meta.status!==200) return this.$message.error('获取商品列表失败')
     
               this.goodslist=res.data.data.goods
            //    console.log(res.data.goods)
                this.total=res.data.data.total
                
            })
        },
        handleSizeChange(newsize){
            this.getgood.pagesize=newsize
            this.getgoods()

        },
        handleCurrentChange(newpage){
            this.getgood.pagenum=newpage
            this.getgoods()
        },
        clearinfo(){
            this.getgoods()
        },
        removegoods(row){
            // console.log(row)
               this.$confirm('此操作将永久删除商品信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(()=>{
                    this.$http.delete('goods/'+row.goods_id).then((res)=>{
                        if(res.data.meta.status!==200) return this.$message.error('删除商品分类失败')
                       this.getgoods()
                        return this.$message.success('删除商品分类成功')
                        
                    })
                }).catch(()=>{
                    return this.$message.info('取消删除商品分类成功')
                })
           
        },
        toaddgoods(){
            this.$router.push('/home/add')
        }
    }
}
</script>

<style>
.el-card{
    margin-top: 20px;
}
</style>