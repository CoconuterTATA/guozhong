<template>
  <div class="m-code-editor">
    <div class="header">
      <el-card>
        <div>
          <span><b>Oyenet合约检测台</b></span>
          <span class="version">合约版本:</span>
            <el-select v-model="selectedVersion">
              <el-option v-for="version in solidityVersions" :key="version" :label="version" :value="version" />
            </el-select>
            <el-button @click="submitCode">开始检测</el-button>
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
    <div class="loading" v-if="isLoading">
      <!-- 加载状态元素，例如加载图标 -->
      <div class="loader"></div>
    </div>
<!-- 模态框主体内容 -->
    <div class="modal-content">
<!--        模态框标签栏-->
      <span class="closeButton" @click="closeModal">&times;</span>
      <div class="tabs"> <!-- 标签容器，居中显示 -->
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

<!--        模态框结果内容-->
      <div class="card-content">
        <!-- 切换内容 -->
        <div v-if="showResults">
          <div class="card-icon">
            <img :src="imageUrl" alt="iconOfFWC" id="cardImage" class="iconFWC">
            <h1 class="front-icon">安全评测服务舱</h1>
          </div>
          <div class="contractInfo">
            <h2>合约基本信息</h2>
            <p class="flex-container">合约类型: <span class="right-aligned">{{ contract_type || '无' }}</span></p>
            <p class="flex-container">合约版本: <span class="right-aligned">{{ selectedVersion }}</span></p>
            <p class="flex-container">EVM代码覆盖率: <span class="evm_converge-box">{{ evm_code_coverage ? evm_code_coverage + '%' : '无' }}</span></p>
          </div>
            <h2>漏洞统计</h2>
            <div class="vulnerability">
              <p><span class="label">调用栈:</span> <span class="code-block">{{ callstack.length > 0 ? callstack.join(', ') : '无' }}</span></p>
              <p><span class="label">时间依赖:</span> <span class="code-block">{{ time_dependency.length > 0 ? time_dependency.join(', ') : '无' }}</span></p>
              <p><span class="label">重入:</span> <span class="code-block">{{ reentrancy.length > 0 ? reentrancy.join(', ') : '无' }}</span></p>
              <p><span class="label">整数溢出:</span> <span class="code-block">{{ integer_overflow.length > 0 ? integer_overflow.join(', ') : '无' }}</span></p>
              <p><span class="label">多签名合约漏洞:</span> <span class="code-block">{{ parity_multisig_bug_2.length > 0 ? parity_multisig_bug_2.join(', ') : '无' }}</span></p>
              <p><span class="label">整数下溢:</span> <span class="code-block">{{ integer_underflow.length > 0 ? integer_underflow.join(', ') : '无' }}</span></p>
              <p><span class="label">货币并发:</span> <span class="code-block">{{ money_concurrency.length > 0 ? money_concurrency.join(', ') : '无' }}</span></p>
              <p><span class="label">断言失败:</span> <span class="code-block">{{ assertion_failure.length > 0 ? assertion_failure.join(', ') : '无' }}</span></p>
            </div>
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
import axios from 'axios';

const selectedVersion = ref('');
const codeValue = ref('');
const solidityVersions = ['0.5.17', '0.5.16', '0.5.15',
  '0.5.14', '0.5.13', '0.5.12', '0.5.11', '0.5.10', '0.5.9', '0.5.8', '0.5.7', '0.5.6',
  '0.5.5', '0.5.4', '0.5.3', '0.5.2', '0.5.1', '0.5.0', '0.4.26', '0.4.25', '0.4.24', '0.4.23',
  '0.4.22', '0.4.21', '0.4.20', '0.4.19', '0.4.18', '0.4.17', '0.4.16', '0.4.15', '0.4.14',
  '0.4.13', '0.4.12', '0.4.11', '0.4.10', '0.4.9', '0.4.8', '0.4.7', '0.4.5', '0.4.4', '0.4.3',
  '0.4.2', '0.4.1', '0.4.0']; // 示例Solidity版本列表
const showResults = ref(false); // 默认显示结果

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
  isLoading.value = true;
  console.log(isModalVisible.value)

try {
  isLoading.value = true;
  const formData = new FormData();
  formData.append('code', codeValue.value);
  formData.append('solcVersion', selectedVersion.value);

  const response = await axios.post('http://172.26.208.47:8080/oyente', formData);

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

    // 在获取结果后弹出检测结果
    showResults.value = true;


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






<!--样式-->
<style lang="scss" scoped>
.flex-container {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center; /* 确保垂直居中 */
  white-space: nowrap;
}

.right-aligned, .evm_converge-box {
  /* 你可以保留原来的样式，或者根据需要调整 */
}

.right-aligned{
  display: inline-block;
  width: 96%;
  text-align: right;
}
//顶部总样式
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

//代码编辑框样式
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

// solc版本选择样式
.version{
  margin-left: 70%;
}


/* 模态框（背景） */
.modal {
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
  /* 方向为垂直 */
  flex-direction: column;
  background-color: #fefefe;
  margin: 15% auto; /* 15% 从顶部和居中定位 */
  padding: 20px;
  border: 1px solid #888;
  width: 50%; /* 宽度 */
  border-radius: 10px;
}

//模态框结果内容样式
.card-content {
  text-align: left; /* 左对齐文本 */
  font-family: 'Roboto', sans-serif; /* 使用Roboto字体 */
  color: #666666;
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
//模态框顶部标签样式
.selected {
  color: green;
  border-bottom: 2px solid green;
}
.tabs {
  text-align:center;
  margin-top: 10px;
}
.tab {
  cursor: pointer;
  padding: 5px;
  margin: 0 10px;
  display: inline-block; /* 让元素按照inline-block排列 */
  font-size: 18px; /* 调整字体大小 */
  transition: all 0.3s ease; /* 使状态变化有动画效果 */
}
.card-content p {
  border-bottom: 1px solid #e0e0e0;  /* 添加底部边框 */
  margin-bottom: 15px;  /* 控制横线之间的间隔 */
  padding-bottom: 15px;  /* 控制文字到横线的距离 */
}
.text-right {
  display: inline-block; /* 或inline */
  width: 96%; /* 根据需要调整 */
  text-align: right;
}

.evm_converge-box {
  display: inline-block; /* 使框的大小适应文字内容 */
  padding: 2px; /* 控制文本与边框之间的间距 */
  border: 0.5px solid cadetblue; /* 设置边框 */
  background-color: lightblue; /* 设置背景颜色 */
  color: dodgerblue; /* 设置文字颜色 */
  border-radius: 5px; /* 添加圆角效果，调整数值以控制圆角的弧度 */

  text-align: right;
}
.vulnerability p{
  display: flex;
  flex-direction: column;
  //align-items: center;
}



//检测结果样式
.label {
  flex-shrink: 0; /* 防止标签内容收缩 */
  width: 150px; /* 或其他适当的宽度 */
  text-align: left; /* 文本左对齐 */
}

.code-block {
  //flex-grow: 1; /* 占据剩余空间，使内容水平居中 */
  width: 95%;
  background-color: #f5f5f5; /* 背景颜色 */
  border: 1px solid #ccc; /* 边框 */
  border-radius: 5px; /* 圆角边框 */
  padding: 10px; /* 内边距，控制代码块内容与边框之间的间距 */
  font-family: monospace; /* 使用等宽字体，例如 Courier New 或 Monospace */
  font-size: 14px; /* 字体大小 */
  line-height: 1.4; /* 行高，控制行与行之间的间距 */
  overflow: auto; /* 添加滚动条以处理长代码 */
}

/* 关闭按钮 */
.closeButton {
  color: #241e1e;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}



/* 模态框主体内容icon样式 */
.iconFWC {
  width: 100px; /* 设置图标的大小 */
  height: 90px;
}

.card-icon { /*设置居中*/
  display: flex; /*设置图标容器为弹性布局*/
  flex-direction: column; /*设置子元素垂直排列*/
  align-items: center;
  text-align: center;
}

.front-icon {
  font-size: 24px; /* 调整图标的大小 */
  color: #00B200; /* 绿色 */
}


//加载组件样式
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* 设置加载状态的高度 */
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite; /* 旋转动画 */
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>
