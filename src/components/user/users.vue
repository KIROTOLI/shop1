<template>
  <div>
     <!-- 面包屑导航 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>   
    </el-breadcrumb>
   
    <!--输入框  -->
    <div style="margin-top: 15px;">
     <el-row :gutter="20">
     <el-col :span="8"><el-input placeholder="请输入内容"  v-model="queryInfo.query" clearable @clear='getusers'>
    <el-button slot="append" icon="el-icon-search" @click="getusers"></el-button>
    </el-input></el-col>
     <el-col :span="4"><el-button type="primary" @click="isshowtalk">添加用户</el-button></el-col>
    </el-row>
    </div>

    <!-- 表格 -->
    <el-table :data='userlist' stripe border class="user-table">
    <el-table-column type='index' label='#'></el-table-column>
    <el-table-column label='姓名' prop='username'></el-table-column>
    <el-table-column label='邮箱' prop='email'></el-table-column>
    <el-table-column label='手机' prop='mobile'></el-table-column>
    <el-table-column label='职位' prop='role_name'></el-table-column>
    <el-table-column label='状态' prop='mg_state'>
        <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="userstatuschange(scope.row)"></el-switch>
        </template>
    </el-table-column>
    <el-table-column label='管理' width='180px'>
         <template v-slot="scope">
           <el-button type="primary" icon="el-icon-edit" size='mini' @click="editformvis(scope.row.id)"></el-button>
        <el-button type="danger" icon="el-icon-share" size='mini' @click="roleschange(scope.row)"></el-button>
        <el-button type="warning" icon="el-icon-delete" size='mini' @click="deleteuser(scope.row.id)"></el-button>
        </template>
    </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 添加用户的提示框 -->
    <el-dialog
    title="添加用户"
    :visible.sync="dialogVisible"
     width="50%"
    @close='cleramall'> 
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" >
  <el-form-item label="用户名" prop="username">
    <el-input v-model="ruleForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="ruleForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="ruleForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="ruleForm.mobile"></el-input>
  </el-form-item>
    </el-form>
     <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click='updateusers'>确 定</el-button>
  </span>
</el-dialog>

<!-- 修改用户的提示框 -->

<el-dialog
  title="提示"
  :visible.sync="editlogVisible"
  width="50%"
  >
  <el-form :model="editForm" :rules="editFormrules" ref="editForm" label-width="100px" >
  <el-form-item label="用户名" prop="name">
    <el-input v-model="editForm.username" disabled></el-input>
  </el-form-item>
   <el-form-item label="邮箱" prop="email">
    <el-input v-model="editForm.email"></el-input>
  </el-form-item>
   <el-form-item label="手机号" prop="mobile">
    <el-input v-model="editForm.mobile"></el-input>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editlogVisible = false">取 消</el-button>
    <el-button type="primary"  @click="edituser">确 定</el-button>
  </span>
</el-dialog>
<!-- 分配角色的对话框 -->
    <el-dialog
  title="提示"
  :visible.sync="rolesVisible"
  width="50%"
  >
  <div>
      <p>当前的用户：{{userinfo.username}}</p>
      <p>当前的角色：{{userinfo.role_name}}</p>
      <p>分配新角色：
            <el-select v-model="valuelistid" placeholder="请选择">
             <el-option
                v-for="item in roleslist"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
             </el-option>
            </el-select>
      </p>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="rolesVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveroleinfo">确 定</el-button>
  </span>
</el-dialog>






  </div>
</template>

<script>
export default {
    name:'users',
    data(){
        return{
            queryInfo:{
                // 
                query:'',
                // 获取用户的第几页
                pagenum:1,
                // 获取的数据每页寄份数据
                pagesize:2
            },
            userlist:[],
            total:0,
            dialogVisible:false,
            ruleForm:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            rules:{
                username:[
                     { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                 password:[
                     { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 9, max: 15, message: '长度在 9 到 15 个字符', trigger: 'blur' }
                ],
                 email:[
                     { required: true, message: '请输入邮箱名称', trigger: 'blur' },
                    
                ],
                 mobile:[
                     { required: true, message: '请输入手机号码', trigger: 'blur' },
                    { min: 11,  message: '长度在11个字符以上', trigger: 'blur' }
                ],
            },
            editlogVisible:false,
            editForm:{},
            editFormrules:{
                email:[
                     { required: true, message: '请输入邮箱名称', trigger: 'blur' },
                    
                ],
                 mobile:[
                     { required: true, message: '请输入手机号码', trigger: 'blur' },
                    { min: 11,  message: '长度在11个字符以上', trigger: 'blur' }
                ],
            },
            // 分配角色弹框的隐藏
            rolesVisible:false,
            // 需要笔分配角色的用户信息
            userinfo:{},
            // 所有角色的数据列表
            roleslist:[],
            // 重新选择的角色id
            valuelistid:''
           
        }
        

    },
    created(){
        this.getusers()
    },
    methods:{
        // 获取用户数据
        getusers(){
            this.$http.get('users',{params:this.queryInfo}).then((res)=>{
                // console.log(res)
                if(res.data.meta.status !==200) return this.$message.error('获取用户列表失败')
                this.userlist=res.data.data.users
                this.total=res.data.data.total
            })
        },
        // 更改每页显示的数据条数
        handleSizeChange(newsize){
            this.queryInfo.pagesize=newsize
            this.getusers()
        },
        // 更改显示的页数
        handleCurrentChange(newpage){
            this.queryInfo.pagenum=newpage
            this.getusers()

            
        },
        // 改变用户状态
        userstatuschange(userinfo){
            // console.log(userinfo)
            this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`).then((res)=>{
                console.log(res)
                if(res.data.meta.status !==200){
                    userinfo.mg_state=!userinfo.mg_state
                    return this.$message.error('更新用户状态失败')

                }
                return this.$message.success('更新用户状态成功')
            })
        },
        // 显示添加用户表单
        isshowtalk(){
            this.dialogVisible=true
        },
        // 清除添加用户表单内的数据
        cleramall(){
            this.$refs.ruleForm.resetFields()
        },
        // 添加用户请求
        updateusers(){
            this.$refs.ruleForm.validate((vaild)=>{
                if(!vaild) return
                this.$http.post('users',this.ruleForm).then((res)=>{
                    if(res.data.meta.status!==201) return this.$message.error('添加用户失败')

                    this.getusers()
                    this.dialogVisible=false
                    return this.$message.success('添加用户成功')
                    

                })
            })
        },
        // 根据用户id值获取信息
        editformvis(id){
            console.log(id)
            this.$http.get('users/'+id).then((res)=>{
                if(res.data.meta.status!==200) return this.$message.error('获取用户数据失败')
                console.log(res.data)
                this.editForm=res.data.data
                this.editlogVisible=true


            })

        },
        // 改变用户信息
        edituser(){
            this.$refs.editForm.validate((vaild)=>{
                if(!vaild) return 
                this.$http.put('users/'+this.editForm.id,{
                   email:this.editForm.email,mobile:this.editForm.mobile
                }).then((res)=>{
                    if(res.data.meta.status!==200) return this.$message.error('修改用户数据失败')
                    this.editlogVisible=false
                    this.$message.success('修改用户数据成功')
                    this.getusers()
                })

            })
        },
        // 删除用户信息
        deleteuser(id){
        this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
            this.$http.delete('users/'+id).then((res)=>{
                if(res.data.meta.status!==200) return this.$message.error('删除用户失败')
                this.getusers()
                return this.$message.success('删除用户数据成功')
                
            })
        }).catch(()=>{
            return this.$message.info('取消删除用户成功')
        })
        },
        // 获取用户角色信息
        roleschange(role){
            this.userinfo=role
            this.$http.get('roles').then((res)=>{
                if(res.data.meta.status!==200) return this.$message.error('获取角色列表失败')
                this.roleslist=res.data.data
            })
            

            this.rolesVisible=true
        },
        // 保存改变的用户角色
        saveroleinfo(){
            if(!this.valuelistid) return this.$message.error('请选择要分配的角色')

            this.$http.put(`users/${this.userinfo.id}/role`,
            {rid:this.valuelistid}).then((res)=>{
                if(res.data.meta.status!==200) return this.$message.error('更新角色失败')
                this.rolesVisible=false
                this.getusers()
                this.valuelistid=''
                this.userinfo=''
                return this.$message.success('更新角色成功')
            })
        }
        
    }
}
</script>

<style>
.user-table{
    margin-top: 20px;
}
.el-pagination{
    padding-top: 20px;
    background-color: #fff;
}
</style>