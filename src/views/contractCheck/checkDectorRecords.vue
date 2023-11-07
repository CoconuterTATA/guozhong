<template>
    <div class="m-code-editor">
      <div class="header">
        <el-card>
          <div>
            <span>Oyenet合约检测台</span>
            <span class="version">solc版本</span>
              <el-select v-model="selectedVersion">
                <el-option v-for="version in solidityVersions" :key="version" :label="version" :value="version" />
              </el-select>
              <el-button @click="submitCode">提交</el-button>
          </div>
        </el-card>
      </div>
      <div class="content">
        <div class="editor-container">
          <CodeMirror v-model="codeValue"/>
        </div>
        <div class="options-container">

        </div>
      </div>

      <div class="footer">
      </div>
    </div>
    <!-- 模态框 -->
    <div id="resultModal" class="modal" v-show="isModalVisible">
  <!-- 模态框内容 -->
  <div class="modal-content">
    <span class="closeButton" @click="closeModal">&times;</span>
    <div class="tabs" style="text-align:center; margin-top: 10px;"> <!-- 标签容器，居中显示 -->
      <span 
        class="tab" 
        :class="{ selected: showResults }" 
        @click="showResults = true"
      >
        Result
      </span>
      <span 
        class="tab" 
        :class="{ selected: !showResults }" 
        @click="showResults = false"
      >
        Code
      </span>
    </div>
    <div class="card-content">
      <!-- 切换内容 -->
      <div v-if="showResults">
        <img :src="imageUrl" alt="iconOfFWC" id="cardImage" class="iconFWC">
      <h3>漏洞统计</h3>
      <p>调用栈: <span>{{ callstack.length > 0 ? callstack.join(', ') : '无' }}</span></p>
      <p>时间依赖: <span>{{ time_dependency.length > 0 ? time_dependency.join(', ') : '无' }}</span></p>
      <p>重入: <span>{{ reentrancy.length > 0 ? reentrancy.join(', ') : '无' }}</span></p>
      <p>整数溢出: <span>{{ integer_overflow.length > 0 ? integer_overflow.join(', ') : '无' }}</span></p>
      <p>多签名合约漏洞: <span>{{ parity_multisig_bug_2.length > 0 ? parity_multisig_bug_2.join(', ') : '无' }}</span></p>
      <p>整数下溢: <span>{{ integer_underflow.length > 0 ? integer_underflow.join(', ') : '无' }}</span></p>
      <p>货币并发: <span>{{ money_concurrency.length > 0 ? money_concurrency.join(', ') : '无' }}</span></p>
      <p>断言失败: <span>{{ assertion_failure.length > 0 ? assertion_failure.join(', ') : '无' }}</span></p>
      <h3>EVM代码覆盖率: <span>{{ evm_code_coverage ? evm_code_coverage + '%' : '无' }}</span></h3>
      <h3>合约类型: <span>{{ contract_type || '无' }}</span></h3>
      </div>
      <div v-else>
        <h3>提交的合约代码</h3>
        <div class="editor-box"> <!-- 编辑框，可滚动 -->
          <pre>{{ codeValue }}</pre>
        </div>
      </div>
    </div>
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
  const showResults = ref(true); // 默认显示结果

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
  const isModalVisible = ref(false);
  const isLoading = ref(false);


onMounted(() => {
})
const closeModal = () => {
  isModalVisible.value = false;
};
  const submitCode = async () => {
  isModalVisible.value = true;
  console.log(isModalVisible.value)
  try {
    isLoading.value = true; 
    const formData = new FormData();
    formData.append('code', codeValue.value);
    formData.append('solcVersion', selectedVersion.value);

    const response = await axios.post('/api/oyente', formData);

    if (response.data) {
      callstack.value = response.data.vulnerabilities.callstack;
      time_dependency.value = response.data.vulnerabilities.time_dependency;
      reentrancy.value = response.data.vulnerabilities.reentrancy;
      integer_overflow.value = response.data.vulnerabilities.integer_overflow;
      parity_multisig_bug_2.value = response.data.vulnerabilities.parity_multisig_bug_2;
      integer_underflow.value = response.data.vulnerabilities.integer_underflow;
      money_concurrency.value = response.data.vulnerabilities.money_concurrency;
      assertion_failure.value = response.data.vulnerabilities.assertion_failure;
      evm_code_coverage.value = parseFloat(response.data.evm_code_coverage);
      contract_type.value = response.data.contract_type;
      console.log(response.data)
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

  .selected {
  color: green;
  border-bottom: 2px solid green;
}

/* 可以添加更多样式来美化文本 */
.tab {
  cursor: pointer;
  padding: 5px;
  margin: 0 10px;
  display: inline-block; /* 让元素按照inline-block排列 */
  font-size: 18px; /* 调整字体大小 */
  transition: all 0.3s ease; /* 使状态变化有动画效果 */
}
.toggle-button {
  /* 使按钮自身对齐到中心 */
  align-self: center;
  /* 可选：为按钮添加一些间距 */
  // margin-top: 10px;
  // margin-bottom: 10px;
}
.editor-box {
  /* 设置编辑框的高度 */
  height: 500px; /* 或者你希望的任何高度 */
  /* 添加滚动条 */
  overflow-y: auto;
  /* 可选：添加内边距 */
  padding: 15px;
  /* 设置背景和字体颜色 */
  background-color: white;
  color: black;
  /* 设置字体大小 */
  font-size: 1em;
  /* 设置滚动条样式 */
  scrollbar-width: thin;
  scrollbar-color: blue grey;
  /* 增加边框，更好的区分编辑框 */
  border: 1px solid #ccc;
  /* 设置字体家族 */
  font-family: 'Courier New', Courier, monospace;
}
  
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

.version{
  margin-left: 70%;
}
  .result-show-text {
  position: relative;
  width: 100%;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  margin-top: -200px;
}

  .card-content {
    font-family: 'Roboto', sans-serif; /* 使用Roboto字体 */
    color: #8a2c2c;  
    position: sticky;
    top: 20px;
    width: 100%;
    // max-width: 600px; /* 限制最大宽度，增加可读性 */
    height: 40%; /* 设置为auto使其根据内容调整 */
    // padding: 20px; /* 增加内边距 */
    background-color: #ffffff; /* 背景颜色 */
    border-radius: 8px; /* 圆角 */
    // box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); /* 增加一些阴影增加深度感 */
    padding: 50px 20px 60px 0px;  /* 上, 右, 下, 左 */

    /* 使用Flexbox使内容垂直居中 */
    // display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.card-content h3, .card-content p {
    
    border-bottom: 1px solid #e0e0e0;  /* 添加底部边框 */
    margin-bottom: 15px;  /* 控制横线之间的间隔 */
    padding-bottom: 15px;  /* 控制文字到横线的距离 */
}

.card-content p:last-of-type, .card-content h3:last-of-type {
    // border-bottom: none;  /* 确保最后一个元素没有边框 */
}

.iconFWC{
  padding: 0px 10px 10px 550px;  /* 上, 右, 下, 左 */
  width: 190px;
  height: 190px;
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

    & .editor-container{
      width: 100%;
    }
    & .options-container {
      flex: 1;
      padding: 10px;
      box-sizing: border-box;
    }

    & .footer {
      flex-shrink: 0;
    }
  }

  /* 模态框（背景） */
.modal {
  // display: none; /* 默认隐藏 */
  position: absolute;
  z-index: 1; /* 位于顶层 */
  left: 0;
  top: 0;

  width: 100%; /* 全屏宽 */
  height: 100%; /* 全屏高 */
  overflow: auto; /* 启用滚动条 */
  background-color: rgb(0,0,0); /* 背景色 */
  background-color: rgba(0,0,0,0.4); /* 背景色，带透明度 */
}

/* 模态框内容 */
.modal-content {
  // display: flex;
  // align-items: center;
  /* 方向为垂直 */
  flex-direction: column;
  background-color: #fefefe;
  margin: 15% auto; /* 15% 从顶部和居中定位 */
  padding: 20px;
  border: 1px solid #888;
  width: 50%; /* 宽度 */
  height: 800px;
  border-radius: 10px;
}

/* 关闭按钮 */
.closeButton {
  color: #241e1e;
  // float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

/* 其他样式 */
.iconFWC {
  width: 50px; /* 图标宽度 */
  height: auto; /* 高度自适应 */
}

.card-content {
  text-align: left; /* 左对齐文本 */
}

  </style>
