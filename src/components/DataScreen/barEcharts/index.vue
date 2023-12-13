<template>
  <div class="echarts" ref="chartsRef" />
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import axios from 'axios';
import { EChartsType } from 'echarts/core';
import { onMounted, ref, onBeforeUnmount } from 'vue';

// 引用图表容器
const chartsRef = ref<HTMLElement | null>();
// 颜色数组
const color = ['#ff0000', '#f39c12', '#27ae60', '#9b59b6', '#3498db'];

// 异步获取数据的函数
const fetchData = async () => {
  try {
    // 从接口获取数据
    const response = await axios.get('http://42.194.184.32:8080/smartfast/getVulnerabilityInfo');
    const data = response.data;
    // 更新图表
    updateChart(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// 更新图表的函数
const updateChart = (data: any) => {
  // 根据接口返回的数据生成图表的数据格式
  const dataOptions = Object.values(data).map((value: number, index: number) => ({
    value,
    itemStyle: {
      color: color[index],
    },
  }));

  // 图表的配置选项
  const options = {
    color,
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
          <div class="m-info" style="opacity: 0.95; font-size: 12px; color: white;">
            <div class="title" ></div>
            <div class="title">${name[0].value}</div>
          </div>`;
        return tipHtml;
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#bbdaff',
        margin: 20,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: '#2d5baf',
        },
      },
    },
    xAxis: {
      type: 'category',
      splitLine: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: '#2d5baf',
        },
      },
      data: ['高风险漏洞', '中风险漏洞', '低风险漏洞', '警告', '需要优化'],
      axisLabel: {
        color: '#fff',
        margin: 20,
        fontsize: 14,
        fontWeight: 'bold', // 设置字体粗细
      },
      axisTick: {
        show: false,
      },
    },
    series: [
      {
        data: dataOptions,
        type: 'bar',
        barMaxWidth: 18,
        markLine: {
          silent: true,
        },
      },
    ],
  };

  // 如果图表已经初始化，则设置新的选项
  if (chart) {
    chart.setOption(options);
  }
};

// 图表实例
let chart: EChartsType;

// 初始化图表的函数
const initChart = () => {
  // 初始化 ECharts 实例
  chart = echarts.init(chartsRef.value);
  // 初次获取数据并更新图表
  fetchData();
  return chart;
};

// 组件挂载时执行
onMounted(() => {
  // 初始化图表
  chart = initChart();
  // 每20秒更新一次数据
  setInterval(fetchData, 20000);
  // 监听窗口大小变化，调整图表大小
  window.addEventListener('resize', () => {
    chart && chart.resize();
  });
});

// 组件销毁前执行
onBeforeUnmount(() => {
  // 清除定时器，防止内存泄漏
  clearInterval(fetchData);
});
</script>

<style lang="scss" scoped>
.echarts {
  height: 100%;
  width: 100%;
}
</style>
