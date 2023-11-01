<template>
    <div class="m-code-editor">
      <div class="header">
        <el-card>
          <div>
            <span>Oyenet合约检测台</span>
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
              <!-- <p>检测报告下载链接：<a :href="downloadLink" download>{{ downloadLinkText }}</a></p> -->
            </div>
          </el-card>
          <el-card>

                <!-- <div ref="chartsRef" class="app-echarts"></div> -->
<div class="card-content">
  <img :src="imageUrl" alt="iconOfFWC" id="cardImage" class="iconFWC">
        <h3>漏洞统计</h3>
        <p>调用栈: {{ callstack }}</p>
        <p>时间依赖: {{ time_dependency }}</p>
        <p>重入: {{ reentrancy }}</p>
        <p>整数溢出: {{ integer_overflow }}</p>
        <p>多签名合约漏洞: {{ parity_multisig_bug_2 }}</p>
        <p>整数下溢: {{ integer_underflow }}</p>
        <p>货币并发: {{ money_concurrency }}</p>
        <p>断言失败: {{ assertion_failure }}</p>
        <h3>EVM代码覆盖率: {{ evm_code_coverage }}</h3>
        <h3>合约类型: {{ contract_type }}</h3>
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
  import imageUrl from '@/assets/image/FWCicon.png';
  import CodeMirror from '@/components/CodeMirror/index.vue';
  import {ref,onMounted} from "vue";
  import {useResizeElement} from '@/hooks/useResizeElement'
  import * as echarts from 'echarts'
  import axios from 'axios';
  
  const selectedVersion = ref('');
  const codeValue = ref('');
  const solidityVersions = ['0.8.0', '0.7.5', '0.7.4','0.7.3', '0.7.2', '0.7.1', '0.7.0', '0.5.0', '0.4.24']; // 示例Solidity版本列表
  const downloadLink = "http://42.194.184.32:8080/download"; // 初始化为空
  const downloadLinkText = ref('检测结果下载链接');

  // const imageUrl = require('@/assets/image/FWCicon.png');
  const callstack = ref([])
  const time_dependency = ref([])
  const reentrancy = ref([])
  const integer_overflow = ref([])
  const parity_multisig_bug_2 = ref([])
  const integer_underflow = ref([])
  const money_concurrency = ref([])
  const assertion_failure = ref([])
  const evm_code_coverage = ref(0)
  const contract_type = ref("")


  const chartsRef = ref<HTMLElement | null>()
  const reminderValue = ref(0);
  const optimizationValue = ref(0);
  const highRiskValue = ref(0);
  const lowRiskValue = ref(0);
  const mediumRiskValue = ref(0);
  const backgroundColor = '#101736';
  const auditMessage = ref('');
  const isLoading = ref(false);


onMounted(() => {
  // chartInstance.value = echarts.init(chartsRef.value);
  // chartInstance.value.setOption(options);
  // let {addObserver} = useResizeElement(chartInstance.value, chartsRef.value);
  // addObserver();
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
  // .card-content{
  //   position: sticky;
  // top: 10px;  /* 距离视口顶部的距离，可以根据需要调整 */
  // width: 100%;
  // height: 800px;  /* 这个高度可以根据你的饼图大小调整 */
  // }

  .card-content {
    font-family: 'Roboto', sans-serif; /* 使用Roboto字体 */
    color: #8a2c2c;  
    position: sticky;
    top: 20px;
    width: 100%;
    // max-width: 600px; /* 限制最大宽度，增加可读性 */
    height: 800px; /* 设置为auto使其根据内容调整 */
    // padding: 20px; /* 增加内边距 */
    background-color: #ffffff; /* 背景颜色 */
    border-radius: 8px; /* 圆角 */
    // box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); /* 增加一些阴影增加深度感 */
    padding: 50px 20px 20px 10px;  /* 上, 右, 下, 左 */

    /* 使用Flexbox使内容垂直居中 */
    // display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.card-content h3, .card-content p {
    
    border-bottom: 1px solid #e0e0e0;  /* 添加底部边框 */
    margin-bottom: 15px;  /* 控制横线之间的间隔 */
    padding-bottom: 10px;  /* 控制文字到横线的距离 */
}

.card-content p:last-of-type, .card-content h3:last-of-type {
    // border-bottom: none;  /* 确保最后一个元素没有边框 */
}

.iconFWC{
  padding: 0px 0px 0px 450px;  /* 上, 右, 下, 左 */
  width: 120px;
  height: 120px;
  top: 100px;
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
