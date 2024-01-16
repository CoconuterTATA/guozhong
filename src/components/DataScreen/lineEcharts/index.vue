<template>
  <div class="echarts" ref="chartsRef" />
</template>
<script setup lang="ts">
import BarCharts from './components/bar.vue'
import * as echarts from 'echarts'
import { EChartsType } from 'echarts/core'
import { onMounted, ref,reactive } from 'vue'
import axios from "axios";
const chartsRef = ref<HTMLElement | null>()


const options = {
  grid: {
    top: '10%',
    left: '3%',
    right: '4%',
    bottom: '10%',
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderWidth: 0,
    borderColor: 'rgba(0,0,0,0.7)',
    formatter: (name, val) => {
      const tipHtml = `
                     <div class="m-info" style=" opacity: 0.95;font-size: 12px; color: white;" >
                         <div class="title" ></div>
                         <div class="title" >当日合约检测量${name[0].data}</div>
                 </div>`
      return tipHtml
    },
  },
  yAxis: {
    // 设置坐标轴的 文字样式
    axisLabel: {
      color: '#bbdaff',
      margin: 20, // 刻度标签与轴线之间的距离。
    },
    // 坐标轴轴线相关设置。
    splitLine: {
      lineStyle: {
        color: '#2d5baf',
      },
    },
  },
  xAxis: {
    splitLine: {
      show: false,
    },
    // 坐标轴轴线相关设置。
    axisLine: {
      lineStyle: {
        color: '#2d5baf',
      },
    },
    type: 'category',
    data: [], // 待接口返回数据
    axisLabel: {
      // 设置坐标轴的 文字样式
      color: '#bbdaff',
      margin: 20, // 刻度标签与轴线之间的距离。
    },
    boundaryGap: false, // 设置坐标轴两边的留白 ，从刻度原点开始，
    axisTick: {
      // 取消坐标轴刻度线
      show: false,
    },
  },
  series: [
    {
      data: [], // 待接口返回数据
      type: 'line',
      // smooth:false,   //关键点，为true是不支持虚线的，实线就用true
      symbolSize: 12, // 拐点圆的大小
      symbol: 'circle',
      markLine: {
        silent: true,
      },
      itemStyle: {
        normal: {
          color: '#920783', // 设置 symbol的颜色
          lineStyle: {
            width: 3,
            color: '#920783',
            type: 'solid', // 'dotted'虚线 'solid'实线
          },
        },
      },
    },
  ],

}

let chart: EChartsType
const initChart = () => {
  const chart = echarts.init(chartsRef.value)
  chart.setOption(options)
  return chart
}
onMounted(() => {
  chart = initChart()
  window.addEventListener('resize', function () {
    chart && chart.resize()
  })
  // 使用axios请求接口获取数据
  axios.get('http://172.26.208.47:8080/smartfast/getRecent7dayContracts')
      .then((res) => {
    // 将返回的数据转换为数组格式
      const data = res.data
      const keys = Object.keys(data)
      const values = Object.values(data)
        chart.setOption({
          xAxis: {
            data: keys,
          },
          series: [
            {
              data: values,
            },
          ],
        })
  })
})
</script>
<style lang="scss" scoped>
.echarts {
  height: 100%;
  width: 100%;
}
</style>
