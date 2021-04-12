<template>
  <div>
      <!-- 面包屑导航 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>   
    </el-breadcrumb>
    <el-card>
        <el-row>
            <el-col>
                <el-button type='primary' @click='addgoods'>添加商品</el-button>
            </el-col>
        </el-row>

           <!-- 表格 -->
    <tree-table :data='cartlist' :columns='columns' :selection-type=false :expand-type=false :show-index=true border>
        <template slot="isok" slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
            <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <template slot="order" slot-scope="scope">
            <el-tag type='primary'  v-if="scope.row.cat_level===0">一级</el-tag>
            <el-tag type='warning' v-else-if="scope.row.cat_level===1">二级</el-tag>
            <el-tag type='success' v-else>三级</el-tag>
        </template>
        <template slot="todo" slot-scope="scope">
            <el-button type='primary' icon='el-icon-edit' size='small' @click="editgoods(scope.row.cat_id)">编辑</el-button>
            <el-button type='warning'  icon='el-icon-delete' size='small' @click="deletegoods(scope.row.cat_id)">删除</el-button>
        </template>
    </tree-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page=queryInfo.pagenum
      :page-sizes="[1, 2, 5, 10]"
      :page-size=queryInfo.pagesize
      layout="total, sizes, prev, pager, next, jumper"
      :total=total>
    </el-pagination>
    </el-card>


    <!-- 弹出的添加商品对话框 -->
    <el-dialog
  title="提示"
  :visible.sync="addgoodsgVisible"
  width="50%"
  @close='clearitem'
  >
 <el-form :model="goodsForm" :rules="goodsrules" ref="ruleForm" label-width="100px" >
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="goodsForm.cat_name"></el-input>
  </el-form-item>
   <el-form-item label="父级名称" >
     <el-cascader
     
    v-model="selectkeys"
    :options="parentscartlist"
    :props="cascprops"
    @change="parentcatechange"
    clearable
    change-on-select></el-cascader>
  </el-form-item>
 </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addgoodsgVisible = false">取 消</el-button>
    <el-button type="primary" @click="updategoodslist">确 定</el-button>
  </span>
</el-dialog>

<!-- 弹出的编辑商品框 -->

<el-dialog
  title="提示"
  :visible.sync="editgoodsVisible"
  width="30%"
  >
   <el-form :model="editname"  ref="editnameref" label-width="100px" >
  <el-form-item label="新名称" >
    <el-input v-model="editname.cat_name"></el-input>
  </el-form-item>
 </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editgoodsVisible = false">取 消</el-button>
    <el-button type="primary" @click="changegoodsname">确 定</el-button>
  </span>
</el-dialog>
 
  </div>
</template>

<script>
export default {
    name:'categories',
    data(){
        return{
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            cartlist:[],
            total:0,
            columns:[
                {
                   label:'分类名称',
                   prop:'cat_name' 
                },
                {
                    label:'是否有效',
                    type:'template',
                    template:'isok'
                },
                 {
                    label:'分类',
                    type:'template',
                    template:'order'
                },
                 {
                    label:'操作',
                    type:'template',
                    template:'todo'
                },
            ],
            addgoodsgVisible:false,
            // 添加分类的表单数据对象
            goodsForm:{
                // 将要添加的分类的名称
                cat_name:'',
                // 将要添加的分类的父id
                cat_pid:0,
                // 将要添加的分类等价
                cat_level:0

            },
            // 添加分类的表单验证规则
            goodsrules:{
                cat_name:[
                           { required: true, message: '请输入分类名称', trigger: 'blur' },
        
                ]
            },
            // 获取到的父级分类列表
            parentscartlist:[],
            // 指定次级选择器的配置对象
            cascprops:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
                expandTrigger:"hover" 
            },
            // 选中的父级id
            selectkeys:[],
            // 商品分类编辑弹框的显示
            editgoodsVisible:false,
            editname:{},
            // 将要进行修改的商品分类id
            editid:''

        }

    },
    created(){
        this.getcartlist()
    },
    methods:{
        getcartlist(){
            this.$http.get('categories',{params:this.queryInfo}).then((res)=>{
                if(res.data.meta.status!==200) return this.$message.error('获取商品列表失败')
                this.cartlist=res.data.data.result
                // console.log(this.cartlist)
                this.total=res.data.data.total
            })
        },
        // 监听分页每页显示的变化
        handleSizeChange(newsize){
           this.queryInfo.pagesize=newsize
            this.getcartlist()
        },
        // 监听每页显示多少数据
        handleCurrentChange(newpage){
            
             this.queryInfo.pagenum=newpage
            this.getcartlist()
        },
        addgoods(){
            this.getparentlist()
            this.addgoodsgVisible=true
        },
        // h获取父级分类的列表
        getparentlist(){
            this.$http.get('categories',{params:{type:2}}).then((res)=>{
                if(res.data.meta.status!==200) return this.$message.error('获取父级列表失败')
                    // console.log(res.data.data)
                    this.parentscartlist=res.data.data
            })
        },
        // 选择项发生改变时
        parentcatechange(){
            // console.log(this.selectkeys)
            // 如果数组中的length大于0 证明选中了父级
            // 反之 说明没有选中父级
            if(this.selectkeys.length>0){
                // 父级分类的id
                this.goodsForm.cat_pid=this.selectkeys[this.selectkeys.length-1]
                // 为当前的等级赋值
                this.goodsForm.cat_level=this.selectkeys.length
                return
            }else{
            
                 // 父级分类的id
                this.goodsForm.cat_pid=0
                // 为当前的等级赋值
                this.goodsForm.cat_level=0
        
            }
        },
        // 提交添加的商品等级
        updategoodslist(){
            // console.log(this.goodsForm)
            this.$refs.ruleForm.validate((valid)=>{
                if(!valid) return
                this.$http.post('categories',this.goodsForm).then((res)=>{
                    if(res.data.meta.status!==201) return this.$message.error('添加分类失败')
                    this.$message.success('添加分类成功')
                    this.getcartlist()
                    this.addgoodsgVisible=false
                })
            })
        },
        clearitem(){
            this.$refs.ruleForm.resetFields()
            this.selectkeys=[]
            this.goodsForm.cat_pid=0
            this.goodsForm.cat_level=0
        },
        // 修改商品分类名称
        editgoods(id){
            // console.log(id)
            this.editid=id
            this.$http.get('categories/'+id).then((res)=>{
                if(res.data.meta.status!==200) return this.$message.error('获取商品名称失败')
                this.editname=res.data.data
            })
            this.editgoodsVisible=true

        },
        changegoodsname(){
 
            this.$http.put('categories/'+this.editname.cat_id,{cat_name:this.editname.cat_name}).then((res)=>{
                
                console.log(res)
                if(res.data.meta.status!==200) return this.$message.error('修改商品分类失败')

                this.$message.success('修改商品分类成功')
                this.getcartlist()
                return this.editgoodsVisible=false
                
            })
        },
        // 删除商品分类
        deletegoods(id){
              this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
            this.$http.delete('categories/'+id).then((res)=>{
                if(res.data.meta.status!==200) return this.$message.error('删除商品分类失败')
                this.getcartlist()
                return this.$message.success('删除商品分类成功')
                
            })
        }).catch(()=>{
            return this.$message.info('取消删除商品分类成功')
        })
        }
    }
}
</script>

<style scoped>
.el-card{
    margin-top: 20px;
}
</style>