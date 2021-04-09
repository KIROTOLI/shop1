<template>
    <div id="home">
        <el-button type='info' @click='logoout'>退出</el-button>
    </div>
</template>

<script>
export default {
    name:'home',
    methods:{
        logoout(){
            window.sessionStorage.clear()
            this.$router.push('/logoin')
        }
    }
}
</script>

<style scoped>

</style>>

</style>