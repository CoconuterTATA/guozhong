<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>
<script lang="ts" setup>
  import axios from 'axios';
  import * as echarts from 'echarts';
  import { EChartsType } from 'echarts/core';
  import { onMounted, ref } from 'vue';

  let props = defineProps({
    className: {
      type: String,
      default: 'chart',
    },
    config: {
      type: Object,
      default: () => {},
    },
    id: {
      type: String,
      default: 'chart',
    },
    width: {
      type: String,
      default: '200px',
    },
    height: {
      type: String,
      default: '200px',
    },
  })
  const options = {
    grid: {
      top: 10,
      left: '2%',
      right: '2%',
      bottom: '2%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [150, 230, 150, 80, 70, 110, 130],
        type: 'bar',
      },
    ],
  }
  let chart: EChartsType
  const initChart = () => {
    let chart = echarts.init(document.getElementById(props.id))
    chart.setOption(options)
    return chart
  }
  const fetchChartData = async () => {
    try {
      const response = await axios.get('http://42.194.184.32:8080/smartfast/getRecent7dayContracts');
      updateChartData(response.data);
    } catch (error) {
      console.error('获取数据失败', error);
    }
  };

  const updateChartData = (data) => {
    const dates = Object.keys(data).sort();
    const counts = dates.map(date => data[date]);

    chart.setOption({
      xAxis: {
        data: dates
      },
      series: [{
        data: counts
      }]
    });
  };
  onMounted(() => {
    chart = initChart()
    fetchChartData();
    window.addEventListener('resize', function () {
      chart && chart.resize()
    })
  })
</script>
