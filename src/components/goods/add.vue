<template>
  <div>
          <!-- 面包屑导航 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加商品</el-breadcrumb-item>   
    </el-breadcrumb>
    <el-card>
         <el-alert
            title="添加商品信息"
            type="info"
            center
            show-icon
            :closable='false'>
        </el-alert>
         <el-steps :space="200" :active="+activenum" finish-status="success">
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
            </el-steps>
        <el-form :model="addruleForm" :rules="addrules" ref="addruleForm" label-width="100px" label-position='top'>
             <el-tabs :tab-position="'left'"  v-model="activenum" :before-leave='beforetableleave' @tab-click='tabclick'>
                <el-tab-pane label="基本信息" name='0'>
                    <el-form-item label='商品名称' prop='goods_name'>
                        <el-input v-model="addruleForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label='商品价格' prop='goods_price'>
                        <el-input v-model="addruleForm.goods_price" type='number'></el-input>
                    </el-form-item>
                      <el-form-item label='商品重量' prop='goods_weight'>
                        <el-input v-model="addruleForm.goods_weight"></el-input>
                    </el-form-item>
                      <el-form-item label='商品数量' prop='goods_number'>
                        <el-input v-model="addruleForm.goods_number" type='number'></el-input>
                    </el-form-item>
                    <el-form-item label='商品分类' prop='goods_cat'>
                        <el-cascader
                        v-model="addruleForm.goods_cat"
                        :options="catelist"
                        :props="cascprops"
                        @change="handelchange"
                        ></el-cascader>
                    </el-form-item>
                    
                    
                </el-tab-pane>
                <el-tab-pane label="商品参数" name='1'>
                     <el-form-item :label='item.attr_name' v-for="item in manytabledata" :key="item.attr_id">
            
                        <el-checkbox-group v-model="item.attr_vals">
                            <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key='i'></el-checkbox>
                            
                        </el-checkbox-group>
                
                     </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name='2'>
                    <el-form-item :label='item.attr_name' v-for="item in onlytabledata" :key="item.attr_id">
                        <el-input v-model="item.attr_vals[0]"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name='3'>
                    <el-upload
                    class="upload-demo"
                    action="http://www.ysqorz.top:8888/api/private/v1/upload"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :headers='headerstal'
                    :on-success='handelsuccess'
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                 
                    </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name='4'>
                    <quill-editor v-model="this.addruleForm.goods_introduce" ></quill-editor>
                    <el-button type='primary' @click="adds">添加商品</el-button>
                </el-tab-pane>
                
            </el-tabs>
        </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
    name:'add',
    data(){
        return{
            activenum:'0',
            addruleForm:{
                goods_name:'',
                goods_price:0,
                goods_weight:0,
                goods_number:0,
                // 商品所属于的分组
                goods_cat:[],
                pics:[],
                goods_introduce:'',
                attrs:[]
            },
            addrules:{
                goods_name:[
                 { required: true, message: '请输入商品名称', trigger: 'blur' },
                ],
                goods_price:[
                 { required: true, message: '请输入商品价格', trigger: 'blur' },
                ],
                goods_weight:[
                 { required: true, message: '请输入商品重量', trigger: 'blur' },
                ],
                goods_number:[
                 { required: true, message: '请输入商品数量', trigger: 'blur' },
                ],
                goods_cat:[
                     { required: true, message: '请选择商品分类', trigger: 'blur' },
                
                ]
            },
            catelist:[],
            cascprops:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
                expandTrigger:"hover" 
            },
            manytabledata:[],
            onlytabledata:[],
              headerstal:{
            Authorization:
            window.sessionStorage.getItem('token')
        }
            
        }
    },
    created(){
        this.getcatlist()
    },
    methods:{
        getcatlist(){
            this.$http.get('categories').then((res)=>{
                if(res.data.meta.status!==200) return this.$message.error('获取商品信息失败');
                this.catelist=res.data.data

            })
        },
        handelchange(){
            if(this.addruleForm.goods_cat.length!==3){
                return this.addruleForm.goods_cat=[]

            }
            console.log(this.addruleForm.goods_cat)
        },
        beforetableleave(activeName,oldactivename){
            if(oldactivename==='0' && this.addruleForm.goods_cat.length!==3){
                this.$message.error('请先选择商品分类')
                return false
            }

        },
        tabclick(){
            if(this.activenum==='1'){
                this.$http.get(`categories/${this.cateid}/attributes`,{
                    params:{
                        sel:'many'
                    }
                }).then((res)=>{
                    if(res.data.meta.status!==200) return this.$message.error('获取参数列表失败')
                    res.data.data.forEach(item=>{
                        item.attr_vals=item.attr_vals.split(' ')
                    })
                    this.manytabledata=res.data.data
                })
            }else if(this.activenum==='2'){
                 this.$http.get(`categories/${this.cateid}/attributes`,{
                    params:{
                        sel:'only'
                    }
                }).then((res)=>{
                    if(res.data.meta.status!==200) return this.$message.error('获取参数列表失败')
                    res.data.data.forEach(item=>{
                        item.attr_vals=item.attr_vals.split(' ')
                    })
                    this.onlytabledata=res.data.data
                })
            }
        },
        handlePreview(){

        },
        handleRemove(file){
            const filepath=file.response.data.tmp_path
            const i=this.addruleForm.pics.findIndex(x=>{
                x.pic===filepath
            })
            this.addruleForm.pics.splice(i,1)
            console.log(this.addruleForm.pics)

        },
        handelsuccess(res){
            const picinfo=
            {pic:res.data.tmp_path}
            this.addruleForm.pics.push(picinfo)
        },
        adds(){
            this.$refs.addruleForm.validate((valid)=>{
                if(!valid) return this.$message.error('请填写必要的表单项')
            })
            // JSON.parse(JSON.stringify(obj))
            this.addruleForm.goods_cat=
            this.addruleForm.goods_cat.join(',')

            this.manytabledata.forEach(item=>{
                const newinfo={
                    attr_id:item.attr_id,
                    attr_value:item.attr_vals.join(' ')
                }
                this.addruleForm.attrs.push(newinfo)
            })
            this.onlytabledata.forEach(item=>{
                const newinfo={
                    attr_id:item.attr_id,
                    attr_value:item.attr_vals
                }
                this.addruleForm.attrs.push(newinfo)
            })
            this.$http.post('goods',this.addruleForm).then((res)=>{
                if(res.data.meta.status!==201) return this.$message.error('添加商品失败') 
                this.$message.success('添加商品成功')
                this.$router.push('/goods')            })

            console.log(this.addruleForm.goods_cat)
        }
      
    },
    computed:{
        cateid(){
            if(this.addruleForm.goods_cat.length===3){
                return this.addruleForm.goods_cat[2]
        }
        return null
        }
    }
}
</script>

<style>
.el-steps{
    margin-top: 20px;
    margin-left: 50px;
}
</style>