<template>
  <div>
          <!-- 面包屑导航 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>   
    </el-breadcrumb>
    <el-card>
<!-- <div id="mian" style="width:600px;height:400px;"></div> -->
<v-chart class="chart" :option="option" />
    </el-card>
  </div>
</template>

<script>
// import echarts from 'echarts'
// import * as echarts from 'echarts'
// export default {
//     name:'reports',
//     data(){
//         return{

//         }
//     },
//     created(){

//     },
//     mounted(){
        
//         this.echars()
    



        
//     },
//     methods:{
//             echars(){
//                 var myChart=echarts.init(document.querySelector('#main'))
//         var option={
//             title:{
//                 text:'echart'
//             },
//             tooltip:{},
//             legend:{
//                 data:['销量']
//             },
//             xAxis:{
//                 data:['衬衫','羊毛衫','雪纺衫','裤子','高跟鞋','袜子']
//             },
//             yAxis:{},
//             series:[{
//                 name:'销量',
//                 type:'bar',
//                 data:[5,20,36,10,10,20]
//             }]
//         }
//         myChart.setOption(option)
//             }

//     }
// }

import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
// import 'echarts'


use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
//   series
]);

export default {
  name: "HelloWorld",
  components: {
    VChart
  },
  provide: {
    [THEME_KEY]: "light"
  },
  data() {
    return {
      option: {}
    };
  },
  mounted(){
      this.$http.get('reports/type/1').then((res)=>{
          this.option=res.data.data
      })
  }
};
</script>

<style>
.chart {
  height: 400px;
}
</style>
// {
//         title: {
//           text: "Traffic Sources",
//           left: "center"
//         },
//         tooltip: {
//           trigger: "item",
//           formatter: "{a} <br/>{b} : {c} ({d}%)"
//         },
//         legend: {
//           orient: "vertical",
//           left: "left",
//           data: [
//             "Direct",
//             "Email",
//             "Ad Networks",
//             "Video Ads",
//             "Search Engines"
//           ]
//         },
//         series: [
//           {
//             name: "Traffic Sources",
//             type: "pie",
//             radius: "55%",
//             center: ["50%", "60%"],
//             data: [
//               { value: 335, name: "Direct" },
//               { value: 310, name: "Email" },
//               { value: 234, name: "Ad Networks" },
//               { value: 135, name: "Video Ads" },
//               { value: 1548, name: "Search Engines" }
//             ],
//             emphasis: {
//               itemStyle: {
//                 shadowBlur: 10,
//                 shadowOffsetX: 0,
//                 shadowColor: "rgba(0, 0, 0, 0.5)"
//               }
//             }
//           }
//         ]
//       }