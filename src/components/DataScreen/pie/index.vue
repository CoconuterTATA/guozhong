<template>
  <div ref="chartsRef" class="echarts"/>
</template>
<script lang="ts" setup>
import * as echarts from 'echarts'
import { EChartsType } from 'echarts/core'
import { onMounted, ref } from 'vue'
import axios from "axios";
const chartsRef = ref<HTMLElement | null>()
let color = ['#fd566a', '#9787ff', '#fdb36a', '#fdd56a', '#6da7ff', '#63e1f2', '#ff3000'];

let options = {
  color: color,
  title: [{
    text: '检测合约版本统计',
    top: '44%',
    textAlign: 'center',
    left: '49.50%',
    backgroundColor: '#163253',
    borderRadius: 100,
    textStyle: {
      color: '#fff',
      fontSize: 20,
      fontWeight: '400',
    },
  }],
  tooltip: {
    show: false,
  },
  toolbox: {
    show: false,
  },
  series: [
    {
      name: '',
      type: 'pie',
      clockWise: false,
      radius: [105,109],
      hoverAnimation: false,
      itemStyle: {
        normal: {
          borderWidth: 5,
          shadowBlur: 20,
          borderColor: color[0],
          shadowColor: color[0],
        },
      },
      label: {
        show: true,
        position: 'outside',
        textStyle: {
          fontSize: 16, // 设置字体大小
          fontWeight: 'bold', // 设置字体粗细
          color: '#fff', // 设置字体颜色
        },
      },
      labelLine: {
        length: 10,
        length2: 20,
        show: true,
        color: '#00ffff',
      },
      data: [],
    }
  ],
};

let chart: EChartsType

const fetchData = async () => {
  try {
    const response = await axios.get("http://42.194.184.32:8080/smartfast/getVersionCounts");
    const  data = await response.data;
    updateChart(data);
  } catch (e) {
    console.error("Error fetching data: ", e);
  }
};

const updateChart = (chartData) => {
  const data = Object.keys(chartData).map((version, index) => ({
    value: chartData[version],
    name: version,
    itemStyle: {
      normal: {
        borderWidth: 5,
        shadowBlur: 20,
        borderColor: color[index],
        shadowColor: color[index],
      },
    },
  }));

  options.series[0].data = data;
  chart.setOption(options);
};

const initChart = () => {
  const chart = echarts.init(chartsRef.value)
  fetchData(); // 第一次获取数据
  setInterval(fetchData, 20000); // Fetch data every 20 seconds
  return chart
}
onMounted(() => {
  chart = initChart()
  window.addEventListener('resize', function () {
    chart && chart.resize()
  })
})
</script>

<style lang="scss" scoped>
.echarts{
  width: 100%;
  height: 100%;

}
</style>
