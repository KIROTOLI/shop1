<template>
  <div class="logoin">
      <div class="loge">
            <img src="../assets/logo.png" alt="">
            <el-form ref="form"   class="logo-form" :model="logos" :rules="rules">
                <el-form-item label="" prop="username">
                    <el-input v-model="logos.username"  prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                  <el-form-item label="" prop="password">
                    <el-input  v-model="logos.password" prefix-icon="el-icon-lock" type='password'></el-input>
                </el-form-item>
                <div class="logo-button">
                    <el-button type="primary" @click="logoin">登录</el-button>
                <el-button type="info" @click="reset">重置</el-button>
                </div>
            </el-form>
      </div>

  </div>
</template>

<script>
export default {
    name:'logoin',
    data(){
        return{
            logos:{
                username:'',
                password:''
            },
            rules:{
                 username: [
                { required: true, message: '请输入用户名称', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                 password: [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
            }
        }
    },
    methods:{
        reset(){
            this.$refs.form.resetFields()
        },
        logoin(){
            this.$refs.form.validate((res)=>{
                // console.log(res)
                if(!res) return
                this.$http.post('login',this.logos).then((r)=>{
                    // console.log(r)
                    if(r.data.meta.status===200){
                        console.log(r)
                        window.sessionStorage.setItem('token',r.data.data.token)
                        this.$router.push('./home')
                        return this.$message.success('登录成功')
                    }else{
                        console.log(r)
                        return this.$message.error('登录失败')
                    }
                })
                // console.log(result)
            })
        }
    }
}
</script>

<style scoped>
.loge{
    width: 425px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}
.loge img{
    width: 120px;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    border: 1px solid #fff;
    border-radius: 50%;
    padding: 5px;
    background-color: #fff;
}
.logo-form{
    width: 100%;
    /* display: flex; */
    flex-wrap: wrap;
    position: absolute;
    bottom: 10px;
    
}
.logo-button{
    display: flex;
    justify-content: flex-end;

}
</style>