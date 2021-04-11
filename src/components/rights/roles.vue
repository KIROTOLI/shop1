<template>
  <div>
       <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>   
    </el-breadcrumb>
    <el-col class="button1">
      <el-row>
        <el-button  type='primary' @click="rolelogVisible = true">添加用户</el-button>
      </el-row>
    </el-col>
    <el-table :data='roleslist'>
      <el-table-column type='expand'>
        <template v-slot='scope' class="out">
          <el-row v-for="item in scope.row.children" :key="item.id" class="row1">
            <!-- 第一层 -->
            <el-col :span='6' >
              <el-tag closable @close="deleteright(scope.row,item.id)">{{item.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>   
            </el-col>  
                   <!--第二层与第三层  -->
            <el-col :span='18' >
              <el-row v-for="item1 in item.children" :key="item1.id" class="row1" >
                <el-col :span='6'>
              <el-tag type="success" closable @close="deleteright(scope.row,item1.id)">{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>   

                </el-col>
                <el-col :span='18' >
              <el-tag v-for="item2 in item1.children" :key="item2.id" type="warning" closable @close="deleteright(scope.row,item2.id)">{{item2.authName}}</el-tag>   
                </el-col>
              </el-row>

            </el-col>
          </el-row>
   
        </template>
      </el-table-column>
      <el-table-column type='index' ></el-table-column>
      <el-table-column type='角色名称' prop='roleName'></el-table-column>
      <el-table-column type='角色描述' prop='roleDesc'></el-table-column>
      <el-table-column type='角色管理' width='200px'>
        <template v-slot='scope'>
          <el-button type="primary" icon="el-icon-edit" size='mini' @click="editroless(scope.row.id)"></el-button>
        <el-button type="danger" icon="el-icon-share" size='mini' @click='changerole(scope.row)'></el-button>
        <el-button type="warning" icon="el-icon-delete" size='mini' @click="deleterole(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>


     <el-dialog
    title="添加用户"
    :visible.sync="rolelogVisible"
     width="50%"
    @close='clearrole'> 
    <el-form :model="roleForm" :rules="rules" ref="roleForm" label-width="100px" class="demo-ruleForm" >
 
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="roleForm.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="roleForm.roleDesc"></el-input>
  </el-form-item>
    </el-form>
     <span slot="footer" class="dialog-footer">
    <el-button @click="rolelogVisible = false">取 消</el-button>
    <el-button type="primary" @click='updateroles'>确 定</el-button>
  </span>
</el-dialog>


<!-- 修改用户的提示框 -->
   <el-dialog
    title="修改用户"
    :visible.sync="roleslogVisible"
     width="50%"
    > 
    <el-form :model="rolesForm" :rules="ruless" ref="rolesForm" label-width="100px" class="demo-ruleForm" >
 
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="rolesForm.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="rolesForm.roleDesc"></el-input>
  </el-form-item>
    </el-form>
     <span slot="footer" class="dialog-footer">
    <el-button @click="roleslogVisible = false">取 消</el-button>
    <el-button type="primary" @click="edittorole">确 定</el-button>
  </span>
</el-dialog>


<!-- 更改权限的对话框 -->
<el-dialog
  title="提示"
  :visible.sync="changeVisible"
  width="50%"
  @close='cleartree'>
  <el-tree :data="roletree" :props="roletreeProps" ref="roletree" show-checkbox node-key='id' default-expand-all :default-checked-keys='defkeys'></el-tree>

  <span slot="footer" >
    <el-button @click="changeVisible = false">取 消</el-button>
    <el-button type="primary" @click="alltorights">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
export default {
name:'roles',
      data(){
        return{
          roleslist:[],
          rolelogVisible:false,
          roleForm:{
            roleName:'',
            roleDesc:'',
          },
          rules:{
                roleName:[
                     { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                 roleDesc:[
                     { required: true, message: '请输入角色描述', trigger: 'blur' },
                    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                ],
                
            },
             roleslogVisible:false,
              rolesForm:{
           },
          ruless:{
                roleName:[
                     { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                 roleDesc:[
                     { required: true, message: '请输入角色描述', trigger: 'blur' },
                    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                ],
                
            },
            changeVisible:false,
            roletree:[],
            roletreeProps:{
              children: 'children',
              label: 'authName'
            },
            // 默认选中的节点id值
            defkeys:[],
            // 即将修改权限的用户id值
            roleId:''
        }
      },
      created(){
        this.getroleslist()
      },
      methods:{
          getroleslist(){
            this.$http.get('roles').then((res)=>{
              if(res.data.meta.status!==200) return this.$message.error('获取用户列表失败')
              this.roleslist=res.data.data

            })
          },
          updateroles(){

             this.$refs.roleForm.validate((vaild)=>{
               if(!vaild) return 
              this.$http.post('roles',this.roleForm).then((res)=>{
              if(res.data.meta.status!==201) return this.$message.error('添加用户失败')
              this.rolelogVisible=false
              this.getroleslist()
              return this.$message.success('添加用户成功')
             })


            

            })
          },
          clearrole(){
            this.$refs.roleForm.resetFields()
          },
          editroless(id){
            this.roleslogVisible=true
            this.$http.get('roles/'+id).then((res)=>{
              if(res.data.meta.status1==200) return this.$message.error('获取用户数据失败')
              this.rolesForm=res.data.data
            })
          },
          edittorole(){
            this.$refs.rolesForm.validate((vaild)=>{
               if(!vaild) return 
               console.log(this.rolesForm.roleId)
              this.$http.put('roles/'+this.rolesForm.roleId,this.rolesForm).then((res)=>{
                console.log(res)
              if(res.data.meta.status!==200) return this.$message.error('修改用户失败')
              this.roleslogVisible=false
              this.getroleslist()
              return this.$message.success('修改用户成功')
             })
            })
          },
          deleterole(id){
                this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
        }).then(()=>{
            this.$http.delete('roles/'+id).then((res)=>{
                if(res.data.meta.status!==200) return this.$message.error('删除用户失败')
                this.getroleslist()
                return this.$message.success('删除用户数据成功')
                
            })
        }).catch(()=>{
            return this.$message.info('取消删除用户成功')
        })
        },
         deleteright(role,rightId){
           this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
        }).then(()=>{
            this.$http.delete(`roles/${role.id}/rights/${rightId}`).then((res)=>{
                if(res.data.meta.status!==200) return this.$message.error('删除用户权限失败')
                // this.getroleslist()
                  role.children=res.data.data
                return this.$message.success('删除用户权限成功')
                
            })
        }).catch(()=>{
            return this.$message.info('取消删除用户权限成功')
        })
        },
        changerole(role){
          this.roleId=role.id
              this.changeVisible=true
              this.$http.get('rights/tree').then((res)=>{
                  if(res.data.meta.status!==200) return this.$message.error('获取用户权限失败')
                  this.roletree=res.data.data
                  this.getleafkeys(role,this.defkeys)
              })
        },
         // 递归获取所有的id值
      getleafkeys(node,arr){
        if(!node.children){
          return arr.push(node.id)
        }

        node.children.forEach(item=>{
          this.getleafkeys(item,arr)
        })
      },
      cleartree(){
        this.defkeys=[]
      },
      // 更改角色权限
      alltorights(){
        const keys=[
          ...this.$refs.roletree.getCheckedKeys(),
          ...this.$refs.roletree.getHalfCheckedKeys()
        ]
        const keystr = keys.join(',')
        // console.log(keystr)
        this.$http.post(`roles/${this.roleId}/rights`,{rids:keystr}).then((res)=>{
          if(res.data.meta.status!==200) return this.$message.error('更改用户权限失败')

          this.changeVisible=false
          this.$message.success('更新用户权限成功')
          return this.getroleslist()
        })
        

      }
    }
     
     
}

</script>

<style>
.button1{
  margin-top: 20px;
}
.row1{
  border-bottom: 1px solid #eee;
  
  padding-bottom: 20px;
  
}


</style>