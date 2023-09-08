<template>
    <div class="m-code-editor">
      <div class="header">
        <el-card>
          <div>
            <span>SmartFast合约检测台</span>
          </div>
        </el-card>
      </div>
      <div class="content">
        <div class="editor-container">
          <CodeMirror v-model="codeValue"/>
        </div>
        <div class="options-container">
          <el-card>
            <div>
              <span>solc版本</span>
              <el-select v-model="selectedVersion">
                <el-option v-for="version in solidityVersions" :key="version" :label="version" :value="version" />
              </el-select>
              <el-button @click="submitCode">提交</el-button>
              <p>检测结果下载链接：<a :href="downloadLink" download>{{ downloadLinkText }}</a></p>
            </div>
          </el-card>

          <div class="app-container">
            <div class="chart-wrapper">
              <div ref="chartsRef" class="app-echarts"></div>
          </div>
        </div>

        </div>
      </div>
      <div class="footer">
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  // import { ref } from 'vue';
  import CodeMirror from '@/components/CodeMirror/index.vue';
  import {ref,onMounted} from "vue";
  import {useResizeElement} from '@/hooks/useResizeElement'
  import * as echarts from 'echarts'
  import axios from 'axios';
  const selectedVersion = ref('');
  const codeValue = ref('');
  const solidityVersions = ['0.8.7', '0.7.6', '0.6.12','0.8.0']; // 示例Solidity版本列表
  const downloadLink = "http://42.194.184.32:8080/download"; // 初始化为空
  const downloadLinkText = ref('检测结果下载链接');
  
  const chartsRef = ref<HTMLElement | null>()
  const reminderValue = ref(0);
  const optimizationValue = ref(0);
  const highRiskValue = ref(0);
  const lowRiskValue = ref(0);
  const mediumRiskValue = ref(0);
  const backgroundColor = '#101736';
const title = {
  text: '检测结果',
  textStyle: {
    // color: '#fff',
    fontSize: 16,
  },
  padding: 0,
  top: 35,
  left: 'center',
};
const legend = {
  //data，就是取得每个series里面的name属性。
  orient: 'vertical',
  icon: 'circle', //图例形状
  padding: 0,
  bottom: 'center',
  right: 30,
  itemWidth: 14, //小圆点宽度
  itemHeight: 14, // 小圆点高度
  itemGap: 21, // 图例每项之间的间隔。[ default: 10 ]横向布局时为水平间隔，纵向布局时为纵向间隔。
  textStyle: {
    fontSize: 14,
    // color: '#ffffff',
  },
};
const tooltip = {
  show: true,
  formatter: '{b}:{d}%',
};
const color = ['#03acd1', '#04cab7', '#03c781', '#fce348', '#fc2d8a'];
const chartInstance = ref(null);
let options = {
  // backgroundColor,
  color,
  title,
  tooltip,
  legend,

  series: [
    {
      name: '合约检测结果',
      type: 'pie',
      center: ['50%', '50%'], //圆心的位置
      top: '2%', //单单指的饼图距离上面的距离，top越大饼图越小
      left: '0%', //单单指的饼图距离左面的距离，会改变饼图的大小
      radius: ['0%', '70%'], //环形图的本质就在这里 [内半径!=0，外半径] 外半径越大，圆越大
      avoidLabelOverlap: false, //做同心圆用到
      clockwise:false, //顺时针排列
      startAngle: 160, //起始角度 影响不大
      roseType:"area", //area|radius

      label: {
        show: true, //false不显示饼图上的标签
        position: 'outside', //inside（在饼图上显示）,outside(默认就会出现引导线) center
        formatter: '{b}:{c}',
      },


      //只有设置了label:show=ture;position=outside 设置labelLine才会有效
      labelLine: {
        show: true, //显示引导线
        length: 30, //连接饼图第1段线条的长度 length length2 不写自适应
        length2: 10, //链接饼图第2段线条长度
        smooth: true, //是否光滑连接线
      },
      itemStyle: {
        //每个扇形的设置
        borderColor: 'rgba(0,0,0,.1)', //扇形边框颜色
        borderWidth: 0, //扇形边框大小 要先给borderColor颜色 设置borderWidth才会有效果

      },
      data: [
      { value: reminderValue.value, name: '提醒' },
      { value: optimizationValue.value, name: '优化' },
      { value: highRiskValue.value, name: '高风险漏洞' },
      { value: lowRiskValue.value, name: '低风险漏洞' },
      { value: mediumRiskValue.value, name: '中风险漏洞' },
      ].sort((a, b) => b.value - a.value), //数组从大到小排序

      emphasis: {
        scale: true,
        scaleSize: 10,

        //启用鼠标放上去放大效果，这个挺好的
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
};

onMounted(() => {
  chartInstance.value = echarts.init(chartsRef.value);
  chartInstance.value.setOption(options);
  let {addObserver} = useResizeElement(chartInstance.value, chartsRef.value);
  addObserver();
})

  const submitCode = async () => {
  try {
    const formData = new FormData();
    formData.append('code', codeValue.value);
    formData.append('solcVersion', selectedVersion.value);

    const response = await axios.post('/api/smartFast', formData);

    if (response.data) {
        console.log('high:', response.data.high);
        console.log('opt:', response.data.opt);
        console.log('low:', response.data.low);
        console.log('medium:', response.data.medium);
        console.log('need attention:', response.data["need attention"]);

        reminderValue.value = response.data["need attention"];
        console.log(reminderValue.value)
        optimizationValue.value = response.data.opt;
        highRiskValue.value = response.data.high;
        lowRiskValue.value = response.data.low;
        mediumRiskValue.value = response.data.medium;
        options.series[0].data = [
          { value: response.data["need attention"], name: '提醒' },
          { value: response.data.opt, name: '优化' },
          { value: response.data.high, name: '高风险漏洞' },
          { value: response.data.low, name: '低风险漏洞' },
          { value: response.data.medium, name: '中风险漏洞' }
        ].sort((a, b) => b.value - a.value); // 从大到小排序
        
        // 使用setOption方法更新图表
        chartInstance.value.setOption(options, true); 
        // chart.setOption(options);
    }

    console.log('传输成功')
    console.log(formData)
    // 从后端返回的响应中获取下载链接
  
  } catch (error) {
    console.error('Error submitting code:', error);
  }
};
  </script>
  
  <style lang="scss" scoped>
  .chart-wrapper {
  position: relative;
  height: 300px;  /* 这个高度可以根据你的饼图大小调整 */
}

.app-echarts {
  position: sticky;
  top: 10px;  /* 距离视口顶部的距离，可以根据需要调整 */
  width: 100%;
  height: 600px;  /* 这个高度可以根据你的饼图大小调整 */
}
  .m-code-editor {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  
    & .header {
      flex-shrink: 0;
    }
  
    & .content {
      display: flex;
      flex-grow: 1;
    }
  
    & .editor-container,
    & .options-container {
      flex: 1;
      padding: 10px;
      box-sizing: border-box;
    }
  
    & .footer {
      flex-shrink: 0;
    }
  }
  </style>
  