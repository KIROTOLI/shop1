<template>
  <div>
         <!-- 面包屑导航 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类参数</el-breadcrumb-item>   
    </el-breadcrumb>
    <el-card>
        <el-row>
            <el-col>
                <el-alert
                    title="注意：只允许为第三级设置相关参数"
                    type="warning"
                    show-icon
                    :closable="false">
                </el-alert>
            </el-col>
        </el-row>
        <span>选择商品分类：</span>
        <el-cascader
        v-model="selectkeys"
        :options="parentscartlist"
        :props="cascprops"
        @change="panclcatechange"
        clearable
        ></el-cascader>
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="动态参数" name="many">
        <el-button type='primary' :disabled="isbtndisabled" @click="addVisible=true">添加参数</el-button>
        <el-table border :data='manytabledata'>
            <el-table-column type='expand'>
                <template v-slot='scope'>
                    <el-tag
                        v-for="(items,i) in scope.row.attr_vals"
                        :key="i"
                        closable
                        @close='handelclose(i,scope.row)'
                        >
                        {{items}}
                    </el-tag>
                    <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.rowinputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
            </el-table-column>

            <el-table-column type='index'></el-table-column>
            <el-table-column prop='attr_name' label='参数名称'></el-table-column>
            <el-table-column p label='操作'>
                <template v-slot='scope'>
                    <el-button type="primary" icon="el-icon-edit" @click="showedit(scope.row.attr_id)">修改</el-button>
                    <el-button type="warning" icon="el-icon-delete" @click="removeparmas(scope.row.attr_id)">删除</el-button>
                </template>
            </el-table-column>
            <el-table-column type='index'></el-table-column>
        </el-table>
    </el-tab-pane>
    <el-tab-pane label="静态属性" name="only">
        <el-button type='primary' :disabled="isbtndisabled"  @click="addVisible=true">添加参数</el-button>
          <el-table border :data='onlytabledata'>
                 <el-table-column type='expand'>
                <template v-slot='scope'>
                    <el-tag
                        v-for="(items,i) in scope.row.attr_vals"
                        :key="i"
                        closable
                        @close='handelclose(i,scope.row)'
                        >
                        {{items}}
                    </el-tag>
                    <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.rowinputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
            </el-table-column>

            <el-table-column type='index'></el-table-column>
            <el-table-column prop='attr_name' label='参数名称'></el-table-column>
            <el-table-column p label='操作'>
                <template v-slot='scope'>
                    <el-button type="primary" icon="el-icon-edit" @click="showedit(scope.row.attr_id)">修改</el-button>
                    <el-button type="warning" icon="el-icon-delete" @click="removeparmas(scope.row.attr_id)">删除</el-button>
                </template>
            </el-table-column>
            <el-table-column type='index'></el-table-column>
        </el-table>
    </el-tab-pane>
 
     </el-tabs>
    </el-card>


    <!-- 添加参数的提示框 -->
    <el-dialog
        :title="'添加'+this.showtitle"
        :visible.sync="addVisible"
        width="50%"
        @close='clearinfo'>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" >
            <el-form-item label="参数名称" prop="attr_name">
                <el-input v-model="ruleForm.attr_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
    <el-button type="primary" @click="addforms">确 定</el-button>
  </span>
</el-dialog>
<!-- 修改参数的提示框 -->
  <el-dialog
        :title="'添加'+this.showtitle"
        :visible.sync="editVisible"
        width="50%"
        @close='clearinfo2'>
        <el-form :model="editForm" :rules="editrules" ref="editForm" label-width="100px" >
            <el-form-item label="参数名称" prop="attr_name">
                <el-input v-model="editForm.attr_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
    <el-button type="primary" @click="editforms">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
    name:'params',
    data(){
        return{
            parentscartlist:[],
            selectkeys:[],
             cascprops:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
                expandTrigger:"hover" 
            },
            activeName:'many',
            manytabledata:[],
            onlytabledata:[],
            // 添加参数的提示框显示
            addVisible:false,
            ruleForm:{
                attr_name:''
            },
            rules:{
                attr_name:[
                    { required: true, message: '请输入参数名称', trigger: 'blur' },
                ]
            },
            editVisible:false,
            editForm:{},
            editrules:{
                attr_name:[
                    { required: true, message: '请输入参数名称', trigger: 'blur' },
                ]
            }

        }
    },
    created(){
        this.getcatrlist()
    },
    methods:{
        getcatrlist(){
            this.$http.get('categories').then((res)=>{
                if(res.data.meta.status!==200) return this.$message.error('获取商品分类列表失败')
                this.parentscartlist=res.data.data
            })
        },
        panclcatechange(){
            if(this.selectkeys.length!==3){
                this.selectkeys=[]
                return 
            }
            // console.log(this.selectkeys)
            this.$http.get(`categories/${this.cateid}/attributes`,{params:{sel:this.activeName}}).then((res)=>{
             
                if(res.data.meta.status!==200) return this.$message.error('获取参数列表失败')
               

                res.data.data.forEach(item=>{
                    item.attr_vals=item.attr_vals ?
                    item.attr_vals=item.attr_vals.split(' ') : []

                    item.inputVisible=false
                    item.inputValue=''
                    
                })
        
                if(this.activeName==='many'){
                    
                    this.manytabledata=res.data.data
  
                }else{
                    this.onlytabledata=res.data.data

                }
            })

            
        },
        handleClick(){
            this.panclcatechange()
        },
        clearinfo(){
            this.$refs.ruleForm.resetFields()
       
        },
         clearinfo2(){
         
            this.$refs.editForm.resetFields()
        },
        addforms(){
            this.$refs.ruleForm.validate(valid=>{
                if(!valid) return
                this.$http.post(`categories/${this.cateid}/attributes`,{attr_name:this.ruleForm,attr_sel:this.activeName}).then((res)=>{
                    console.log(res)
                    if(res.data.meta.status!==201) return this.$message.error('添加商品属性失败')
                    this.$message.success('添加商品参数成功')
                    this.panclcatechange()
                    return this.addVisible=false
                })
            })
        },
        showedit(attr_id){
            this.$http.get(`categories/${this.cateid}/attributes/${attr_id}`,{params:{attr_sel:this.activeName}}).then((res)=>{
                console.log(res)
                if(res.data.meta.status!==200) return this.$message.error('获取信息失败')
                this.editForm=res.data.data
                
            })
            this.editVisible=true
        },
        editforms(){
            this.$refs.editForm.validate(vaild=>{
                if(!vaild) return
                this.$http.put(`categories/${this.cateid}/attributes/${this.editForm.attr_id}`,{
                    attr_name:this.editForm.attr_name,
                    attr_sel:this.activeName
                }).then((res)=>{
                    if(res.data.meta.status!==200) return this.$message.error('修改参数失败')
                    this.$message.success('修改参数成功')
                    this.panclcatechange()
                    return this.editVisible=false
                })
            })
        },
        removeparmas(id){
            this.$confirm('此操作将永久删除该商品属性, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
            this.$http.delete(`categories/${this.cateid}/attributes/${id}`).then((res)=>{
                if(res.data.meta.status!==200) return this.$message.error('删除商品属性失败')
                this.panclcatechange()
                return this.$message.success('删除商品属性成功')
                
            })
        }).catch(()=>{
            return this.$message.info('取消删除商品属性成功')
        })
        },
        handleInputConfirm(row){
            if(row.rowinputValue.trim().length===0){
                row.rowinputValue=''
                row.inputVisible=false
                return
            }
            row.attr_vals.push(row.rowinputValue.trim())
            row.rowinputValue=''
            row.inputVisible=false
            this.$http.put(`categories/${this.cateid}/attributes/${row.attr_id}`,{
                attr_name:row.attr_name,
                attr_sel:row.attr_sel,
                attr_vals:row.attr_vals.join(' ')
            }).then((res)=>{
                if(res.data.meta.status!==200) return this.$message.error('添加参数项失败')
                this.$message.success('修改参数项成功')
            })
        },
        showInput(row){
            row.inputVisible=true
            this.$nextTick(()=>{
                this.$refs.saveTagInput.$refs.input.focus()
            })
        },
        handelclose(i,row){
            row.attr_vals.splice(i,1)
               this.$http.put(`categories/${this.cateid}/attributes/${row.attr_id}`,{
                attr_name:row.attr_name,
                attr_sel:row.attr_sel,
                attr_vals:row.attr_vals.join(' ')
            }).then((res)=>{
                if(res.data.meta.status!==200) return this.$message.error('添加参数项失败')
                this.$message.success('修改参数项成功')
            })

        }
    },
    computed:{
        isbtndisabled(){
            if(this.selectkeys.length!==3)
            return true
            return false
        },
        // 当前选中的三级分类id
        cateid(){
            if(this.selectkeys.length==3){
                 return this.selectkeys[2]
            }
            return null
        },
        // 提示框显示的标题
        showtitle(){
            if(this.activeName=='many'){
                return '动态属性'
            }else{
                return '静态属性'
            }
        }
    }
}
</script>

<style scoped>
.el-card{
    margin-top: 20px;
}
.input-new-tag{
    width: 120px;
}
</style>