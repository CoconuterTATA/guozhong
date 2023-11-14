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
              <div v-if="isLoading" id="Loading">
      <!-- 加载动画 -->
      <div class="loader-inner ball-beat">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
              <p>检测报告下载链接：<a :href="downloadLink" download>{{ downloadLinkText }}</a></p>
            </div>
          </el-card>
          <el-card>
            <div class="app-container">
              <div class="chart-wrapper" >
                <div ref="chartsRef" class="app-echarts"></div>
              </div>
            </div>
            <div class="result-show-text">
              <el-card v-if="auditMessage">
                <div v-html="auditMessage"></div>
              </el-card>
            </div>
          </el-card>
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
  const solidityVersions = ['0.8.0', '0.7.6', '0.7.5', '0.7.4', '0.7.3', '0.7.2',
    '0.7.1', '0.7.0', '0.6.12', '0.6.11', '0.6.10', '0.6.9', '0.6.8', '0.6.7', '0.6.6',
    '0.6.5', '0.6.4', '0.6.3', '0.6.2', '0.6.1', '0.6.0', '0.5.17', '0.5.16', '0.5.15',
    '0.5.14', '0.5.13', '0.5.12', '0.5.11', '0.5.10', '0.5.9', '0.5.8', '0.5.7', '0.5.6',
    '0.5.5', '0.5.4', '0.5.3', '0.5.2', '0.5.1', '0.5.0', '0.4.26', '0.4.25', '0.4.24', '0.4.23',
    '0.4.22', '0.4.21', '0.4.20', '0.4.19', '0.4.18', '0.4.17', '0.4.16', '0.4.15', '0.4.14',
    '0.4.13', '0.4.12', '0.4.11', '0.4.10', '0.4.9', '0.4.8', '0.4.7', '0.4.5', '0.4.4', '0.4.3',
    '0.4.2', '0.4.1', '0.4.0']; // 示例Solidity版本列表
  const downloadLink = "http://42.194.184.32:8080/download"; // 初始化为空
  const downloadLinkText = ref('检测结果下载链接');

  const chartsRef = ref<HTMLElement | null>()
  const reminderValue = ref(0);
  const optimizationValue = ref(0);
  const highRiskValue = ref(0);
  const lowRiskValue = ref(0);
  const mediumRiskValue = ref(0);
  const backgroundColor = '#101736';
  const auditMessage = ref('');
  const isLoading = ref(false);
const title = {
  text: '检测结果',
  textStyle: {
    // color: '#fff',
    fontSize: 16,
  },
  padding: 100,
  top: 5,
  left: 'center',
};
const legend = {
  //data，就是取得每个series里面的name属性。
  orient: 'vertical',
  icon: 'circle', //图例形状
  padding: 0,
  bottom: 'center',
  right: 0,
  itemWidth: 20, //小圆点宽度
  itemHeight: 10, // 小圆点高度
  itemGap: 10, // 图例每项之间的间隔。[ default: 10 ]横向布局时为水平间隔，纵向布局时为纵向间隔。
  textStyle: {
    fontSize: 14,
    // color: '#ffffff',
  },
};
const tooltip = {
  show: true,
  formatter: '{b}:{d}%',
};
const color = ['#9b59b6', '#3498db', '#ff0000', '#27ae60', '#f39c12'];
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
      radius: ['0%', '60%'], //环形图的本质就在这里 [内半径!=0，外半径] 外半径越大，圆越大
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
        length: 10, //连接饼图第1段线条的长度 length length2 不写自适应
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
    isLoading.value = true;
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
        auditMessage.value = `
            <div class="result-section">
                <h1>审计结果</h1>
                <p>审计合约名: <strong>${response.data.ContractName}</strong></p>
                <p>审计合约版本: <strong>${response.data.ContractVersion}</strong></p>
                <p>审计报告文件名: <strong>${response.data.ContractReport}</strong></p>
                <p>经smartfast智能合约审计工具发现，该智能合约安全存在
                <span style="color: #ff0000; font-weight: bold; font-size: 20px;">${response.data.high}个高风险漏洞</span>，
                <span style="color: #f39c12; font-weight: bold; font-size: 20px;">${response.data.medium}个中风险漏洞</span>，
                <span style="color: #27ae60; font-weight: bold; font-size: 20px;">${response.data.low}个低风险漏洞</span>，
                <span style="color: #9b59b6; font-weight: bold; font-size: 20px;">${response.data["need attention"]}个地方需要注意</span>以及
                <span style="color: #3498db; font-weight: bold; font-size: 20px;">${response.data.opt}个地方需要优化</span>，
                详细合约审计结果可通过见检查结果下载链接。</p>
                <p style="margin-top: 20px; display: flex; justify-content: space-between;">
                        <span>检测耗时: ${response.data.ExecutedTime}</span>
                        <span style="color: #7F7F7F">审计时间: ${response.data.AuditTime}</span>
                </p>
            </div>
          `;


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
  isLoading.value = false;  // 隐藏加载动画
};
  </script>

  <style lang="scss" scoped>
  .chart-wrapper {
  position: relative;
  bottom: 100px;  /* 这个高度可以根据你的饼图大小调整 */
}

#Loading {
  top:50%;
  left:50%;
  position: absolute;
  -webkit-transform: translateY(-50%)  translateX(-50%);
  transform: translateY(-50%)  translateX(-50%);
  z-index:100;
}
@-webkit-keyframes ball-beat {
  50% {
    opacity: 0.2;
    -webkit-transform: scale(0.75);
    transform: scale(0.75);
  }

  100% {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

@keyframes ball-beat {
  50% {
    opacity: 0.2;
    -webkit-transform: scale(0.75);
    transform: scale(0.75);
  }

  100% {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

.ball-beat > div {
  background-color: #279fcf;
  width: 30px;   /* 增大了宽度 */
  height: 30px;  /* 增大了高度 */
  border-radius: 100% !important;
  margin: 4px;   /* 增大了间隔 */
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  display: inline-block;
  -webkit-animation: ball-beat 0.7s 0s infinite linear;
  animation: ball-beat 0.7s 0s infinite linear;
}

.ball-beat > div:nth-child(2n-1) {
  -webkit-animation-delay: 0.35s !important;
  animation-delay: 0.35s !important;
}


.result-section {
  h1 {
    color: #333; /* 文字颜色 */
    font-size: 28px; /* 字体大小 */
    margin-bottom: 20px; /* 底部外边距 */
    text-align: center; /* 文字居中对齐 */
  }
  /* 设置段落的样式 */
  p {
    color: #666; /* 文字颜色 */
    font-size: 16px; /* 字体大小 */
    margin-bottom: 10px; /* 底部外边距 */
  }
}


  .result-show-text {
  position: relative;
  width: 100%;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  margin-top: -200px;
}

.app-echarts {
  position: sticky;
  top: 10px;  /* 距离视口顶部的距离，可以根据需要调整 */
  width: 100%;
  height: 800px;  /* 这个高度可以根据你的饼图大小调整 */
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
