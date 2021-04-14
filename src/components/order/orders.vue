<template>
  <div>
           <!-- 面包屑导航 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>   
    </el-breadcrumb>
    <el-card>
        <el-row>
            <el-col :span='8'>
                  <el-input placeholder="请输入内容"  class="input-with-select">
                   
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </el-col>
        </el-row>
        <el-table :data='orderlist'>
            <el-table-column type='index'></el-table-column>
            <el-table-column label='订单编号' prop='order_number'></el-table-column>
            <el-table-column label='订单价格' prop='order_price'></el-table-column>
            <el-table-column label='受否付款' prop='pay_status'>
                <template v-slot='scope'>
                    <el-tag type='success' v-if='scope.row.pay_status==="1"'>未付款</el-tag>
                    <el-tag type='danger' v-else>已付款</el-tag>
                </template>
            </el-table-column>
            <el-table-column label='订单发货' prop='is_send'></el-table-column>
            <el-table-column label='下单时间' prop='create_time'>
                <template v-slot='scope'>
                    {{scope.row.create_time | dataformat}}
                </template>
            </el-table-column>
            <el-table-column label='订单操作'>
                <template s-slot='scope'>
                    <el-button type='primary' size='mini' @click="cahngeorder">修改</el-button>
                    <el-button type='success' size='mini' @click="pathview">位置</el-button>
                </template>
            </el-table-column>
        </el-table>

         <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="orderinfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="orderinfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </el-card>

    
    <el-dialog
    title="提示"
    :visible.sync="orderVisible"
    width="50%"
    >
        <el-form  :model="addressform" :rules='addformsriles'>
        <el-form-item label='省市县/区' prop='address1'>
            <!-- <el-input v-model="addressform.address1"></el-input>    -->
            <el-cascader :options='citydata' v-model="addressform.address1"></el-cascader>
        </el-form-item>
        <el-form-item label='详细地址' prop='address2'>
            <el-input v-model="addressform.address2"></el-input>   
        </el-form-item>
        </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="orderVisible = false">取 消</el-button>
        <el-button type="primary" @click="orderVisible = false">确 定</el-button>
    </span>
</el-dialog>

   <el-dialog
    title="提示"
    :visible.sync="pathVisible"
    width="50%"
    >
     <el-timeline >
        <el-timeline-item
        v-for="(activity, index) in progressinfo"
        :key="index"
        :timestamp="activity.time">
        {{activity.context}}
        </el-timeline-item>
    </el-timeline>
    <span slot="footer" class="dialog-footer">
        <el-button @click="pathVisible = false">取 消</el-button>
        <el-button type="primary" @click="pathVisible = false">确 定</el-button>
    </span>
</el-dialog>
  </div>
</template>

<script>
import citydata from './citydata.js'

export default {
    name:'orders',
    data(){
        return{
            orderinfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            total:0,
            orderlist:[],
            orderVisible:false,
            addressform:{
                address1:[],
                address2:[]
            },
            addformsriles:{
                address1:[
                     { required: true, message: '请输入地址', trigger: 'blur' },
                ],
                address2:[
                     { required: true, message: '请输入详细地址', trigger: 'blur' },
                ]
            },
            citydata,
            pathVisible:false,
            progressinfo:[]
        }
    },
    created(){
        this.getorderlist()
    },
    methods:{
        getorderlist(){
            this.$http.get('orders',{params:this.orderinfo}).then((res)=>{
                if(res.data.meta.status!==200) return this.$message.error('获取订单列表失败')
                this.total=res.data.data.total
                this.orderlist=res.data.data.goods
             
            })
        },
        handleSizeChange(newsize){
           this.orderinfo.pagesize=newsize
        this.getorderlist()
        },
        handleCurrentChange(newpage){
            this.orderinfo.pagenum=newpage
            this.getorderlist()
        },
        cahngeorder(){
            this.orderVisible=true
        },
        pathview(){
            this.pathVisible=true
            console.log('dsds')
            this.$http.get('/kuaidi/804909574412544580').then((res)=>{
                console.log(res)
                if(res.data.meta.status!==200) return this.$message.error('获取商品地址失败')

                this.progressinfo=res.data.data
            })
        }
    }
}
</script>

<style>

</style>