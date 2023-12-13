<!--suppress JSUnusedGlobalSymbols -->
<template>
  <div class="container">
    <img :src="imageUrl" alt="Image" class="center-image">
    <h2 class="title">服务舱合约安全分析</h2>
    <div class="dropdown">
      <select v-model="selectedOption">
        <option value="ETH">ETH</option>
        <option value="BTC">BTC</option>
        <option value="Optimism">Optimism</option>
      </select>
    </div>
    <div class="input-group">
      <input
        type="text"
        v-model="tokenAddress"
        placeholder="请输入要分析的Token地址"
        @input="checkInput">
      <span class="searchIcon" @click="executeSearch">&#x1F50D;</span>
<!--      <span class="clearIcon" v-if="tokenAddress" @click="clearInput">&#x2715;</span>-->
    </div>
  </div>
  <div class="loading" v-if="isLoading">
      <!-- 加载状态元素，例如加载图标 -->
      <div class="loaderSecur"></div>
  </div>


<!--  模态框背景内容-->
  <div v-if="isModalOpen" class="modal-overlay">
<!--    模态框主体-->
  <div class="modal">
    <span class="closeButton" @click="closeModal">&times;</span> <!-- 返回按钮 -->
<!--    模态框标签栏-->
    <div class="tabs">
      <span class="tab" :class="{ active: activeTab === 'result' }" @click="activeTab = 'result'">Result</span>
      <span class="tab" :class="{ active: activeTab === 'code' }" @click="activeTab = 'code'">Code</span>
      <span class="tab" :class="{ active: activeTab === 'abi' }" @click="activeTab = 'abi'">Abi</span>
    </div>

<!--    模态框结果内容-->
    <div class="tab-content">
      <div class="card-icon">
        <img :src="imageUrl" alt="iconOfFWC" id="cardImage" class="iconFWC">
        <h1 class="front-icon">安全评测服务舱</h1>
      </div>

      <div v-if="activeTab === 'result'" class="result">
        <div class="contractInfo">
          <h2>合约基本信息</h2>
          <p class="flex-container">id: <span class="right-aligned">{{ tokenData.id || '无' }}</span></p>
          <p class="flex-container">合约名: <span class="right-aligned">{{ tokenData.contractName || '无' }}</span></p>
          <p class="flex-container">编译器版本: <span class="right-aligned">{{ tokenData.compilerVersion || '无'  }}</span></p>
          <p class="flex-container">合约地址: <span class="evm_converge-box">{{ tokenData.contractAddress || '无' }}</span></p>
          <p class="flex-container">合约创建者: <span class="evm_converge-box">{{ tokenData.contractCreator || '无' }}</span></p>
          <p class="flex-container">合约哈希: <span class="evm_converge-box">{{ tokenData.createTxHash || '无' }}</span></p>
          <p class="flex-container">时间戳: <span class="right-aligned">{{ tokenData.timestamp || '无' }}</span></p>
          <p class="flex-container">链类型: <span class="right-aligned">{{ tokenData.chain || '无' }}</span></p>
          <p class="flex-container">evm版本: <span class="evm_converge-box">{{ tokenData.evmVersion || '无' }}</span></p>
          <p class="flex-container">optimizationUsed: <span class="evm_converge-box">{{ tokenData.optimizationUsed || '无' }}</span></p>
          <p class="flex-container long-text-content">constructorArguments: <span class="evm_converge-box long-text">{{ tokenData.constructorArguments || '无' }}</span></p>
          <p class="flex-container">runs: <span class="evm_converge-box">{{ tokenData.runs || '无' }}</span></p>
          <p class="flex-container">library: <span class="evm_converge-box">{{ tokenData.library || '无' }}</span></p>
          <p class="flex-container">licenseType: <span class="evm_converge-box">{{ tokenData.licenseType || '无' }}</span></p>
          <p class="flex-container">proxy: <span class="evm_converge-box">{{ tokenData.proxy || '无' }}</span></p>
          <p class="flex-container">implementation: <span class="evm_converge-box">{{ tokenData.implementation || '无' }}</span></p>
          <p class="flex-container">swarmsource: <span class="evm_converge-box">{{ tokenData.swarmsource || '无' }}</span></p>
          <p class="flex-container">remark: <span class="evm_converge-box">{{ tokenData.remark || '无' }}</span></p>
          <p>合约是否开源:
            <span class="value">
              <template v-if="tokenData.openSource">
                {{ tokenData.openSource }}
              </template>
              <template v-else>
                <span class="closeSource">合约未开源<span class="no-data-icon"></span></span>
              </template>
            </span>
          </p>
        </div>

        <h2>漏洞统计</h2>
        <div class="vulnerability">
            <p>高风险漏洞
              <span :class="{ 'highLevelVulnerability': tokenData.highLevelVulnerability !== 0, 'security': !tokenData.highLevelVulnerability }">
                <template v-if="tokenData.highLevelVulnerability">
                  {{ tokenData.highLevelVulnerability }}
                </template>
                <template v-else>
                  <span>无<span class="secure"></span></span>
                </template>
              </span>
            </p>
            <p>中风险漏洞
              <span :class="{ 'mediumLevelVulnerability': tokenData.mediumLevelVulnerability !== 0, 'security': !tokenData.mediumLevelVulnerability }">
                <template v-if="tokenData.mediumLevelVulnerability">
                  {{ tokenData.mediumLevelVulnerability }}
                </template>
                <template v-else>
                  <span>无<span class="secure"></span></span>
                </template>
              </span>
            </p>
            <p>低风险漏洞
              <span :class="{ 'lowLevelVulnerability': tokenData.lowLevelVulnerability !== 0, 'security': !tokenData.lowLevelVulnerability }">
                <template v-if="tokenData.lowLevelVulnerability">
                  {{ tokenData.lowLevelVulnerability }}
                </template>
                <template v-else>
                  <span>无<span class="secure"></span></span>
                </template>
              </span>
            </p>
            <p>警告
              <span :class="{ 'warning': tokenData.warning !== 0, 'security': !tokenData.warning }">
                <template v-if="tokenData.warning">
                  {{ tokenData.warning }}
                </template>
                <template v-else>
                  <span>无<span class="secure"></span></span>
                </template>
              </span>
            </p>
            <p>建议
              <span :class="{ 'needOpt': tokenData.warning !== 0, 'security': !tokenData.warning }">
                <template v-if="tokenData.needOpt">
                  {{ tokenData.needOpt }}
                </template>
                <template v-else>
                  <span>无<span class="secure"></span></span>
                </template>
              </span>
            </p>
            <p class="flex-container">检测报告链接:
              <a :href="tokenData.reportLink" target="_blank" class="right-aligned" v-if="tokenData.reportLink">
                {{ tokenData.reportLink }}
              </a>
            </p>
          </div>
      </div>

      <div v-if="activeTab === 'code'">
        <h3>合约代码</h3>
        <div class="editor-box">
          <pre>{{ tokenData.code || '无代码信息' }}</pre>
        </div>
      </div>
      <div v-if="activeTab === 'abi'">
        <h3>合约ABI</h3>
        <div class="editor-box">
          <pre class="abi-container">{{ tokenData.abi }}</pre>
        </div>
      </div>
    </div>
  </div>
</div>


</template>

<script>
import imageUrl from '@/assets/image/FWCicon.png';
import axios from 'axios'
export default {
  data() {
    return {
      tokenData: {
        highLevelVulnerability: 1,
        lowLevelVulnerability: 2,
        mediumLevelVulnerability: 3,
        warning: 4,
        needOpt: 5,
      },
      riskAnalysis: {},
      imageUrl,
      tokenAddress: '',
      isModalOpen: false,
      activeTab: 'result',
      isLoading: false,
      selectedOption: 'ETH',
    };
  },
  methods: {
    clearInput() {
      this.tokenAddress = '';
    },
    executeSearch() {
      this.isLoading = true;
      const url = this.selectedOption === 'ETH'
        ? 'http://42.194.184.32:8080/smartFast/EthAudit'
        : 'http://42.194.184.32:8080/smartFast/BscAudit';
      console.log(this.tokenAddress)
      const params = new URLSearchParams();
      params.append('address', this.tokenAddress);
      axios.post(url, params)
        .then(response => {
          this.tokenData = response.data;
          this.isModalOpen = true;
        })
        .catch(error => {
          // this.isModalOpen = true; //调试用
          console.error('请求错误:', error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    checkInput() {
      // 检查输入
    },
    closeModal() {
    this.isModalOpen = false; // 关闭模态框
  },
  },
};
</script>

<style>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed; /* 使用 fixed 定位使其相对于视口居中 */
  top: 0;
  left: 0;
  width: 100vw; /* 视口宽度 */
  height: 100vh; /* 视口高度 */
  background-color: rgba(255, 255, 255, 0.5); /* 可选：半透明背景 */
  z-index: 1000; /* 确保加载图标在其他内容之上 */
}

.loaderSecur {
  border: 5px solid #f3f3f3; /* 浅灰色边框 */
  border-top: 5px solid #3498db; /* 蓝色边框 */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
  position: relative;
  left: 5%;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.highLevelVulnerability{
  float: right;
  color: #ff0000; /* 字体颜色 */
  background-color: rgb(167, 67, 27); /* 背景颜色 */
  border: 1px solid #D0D4D8; /* 边框颜色和大小 */
  padding: 2px 5px; /* 内边距：垂直和水平 */
  border-radius: 4px; /* 边框圆角 */
}

.mediumLevelVulnerability{
  color: #f39c12;
  float: right;
  background-color: rgb(215, 228, 42); /* 背景颜色 */
  border: 1px solid #D0D4D8; /* 边框颜色和大小 */
  padding: 2px 5px; /* 内边距：垂直和水平 */
  border-radius: 4px; /* 边框圆角 */
}

.lowLevelVulnerability{
  color: #27ae60;
  float: right;
  background-color: rgb(57, 90, 78); /* 背景颜色 */
  border: 1px solid #D0D4D8; /* 边框颜色和大小 */
  padding: 2px 5px; /* 内边距：垂直和水平 */
  border-radius: 4px; /* 边框圆角 */
}
.warning{
  color: #9b59b6;
  float: right;
  background-color: rgb(208, 200, 212); /* 背景颜色 */
  border: 1px solid #D0D4D8; /* 边框颜色和大小 */
  padding: 2px 5px; /* 内边距：垂直和水平 */
  border-radius: 4px; /* 边框圆角 */
}
.needOpt{
  color: #3498db;
  float: right;
  background-color: rgb(141, 182, 236); /* 背景颜色 */
  border: 1px solid #D0D4D8; /* 边框颜色和大小 */
  padding: 2px 5px; /* 内边距：垂直和水平 */
  border-radius: 4px; /* 边框圆角 */
}
.security{
  float: right;
  color: #1e8a36; /* 字体颜色 */
  background-color: rgb(176, 224, 206); /* 背景颜色 */
  border: 1px solid #D0D4D8; /* 边框颜色和大小 */
  padding: 2px 5px; /* 内边距：垂直和水平 */
  border-radius: 4px; /* 边框圆角 */
}
.secure {
  float: right;
  display: inline-block;
  width: 20px; /* 图标宽度 */
  height: 20px; /* 图标高度 */
  background-color: green; /* 绿色背景 */
  border-radius: 50%; /* 圆形 */
  position: relative;
  text-align: center; /* 文字居中 */
  line-height: 20px; /* 居中对齐文字 */
}

.secure::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 0;
  width: 8px;
  height: 14px;
  border: solid white;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg);
}

.closeSource{
  float: right;
  color: #db0f42; /* 字体颜色 */
  background-color: rgb(224, 176, 182); /* 背景颜色 */
  border: 1px solid #D0D4D8; /* 边框颜色和大小 */
  padding: 2px 5px; /* 内边距：垂直和水平 */
  border-radius: 4px; /* 边框圆角 */
}
.no-data-icon{
  float: right;
  display: inline-block;
  width: 20px; /* 图标宽度 */
  height: 20px; /* 图标高度 */
  background-color: red; /* 红色背景 */
  border-radius: 50%; /* 圆形 */
  color: white; /* 白色文字 */
  text-align: center; /* 文字居中 */
  line-height: 20px; /* 居中对齐文字 */
}
.no-data-icon::after {
  content: 'X'; /* 显示的 'X' 文字 */
}

.value{
  float: right;
}


hr {
  border: none; /* 移除默认边框 */
  height: 1px; /* 设置高度，这将决定横线的粗细 */
  background-color: rgba(170, 165, 165, 0.747); /* 设置横线颜色 */
  margin-top: 20px; /* 设置顶部边距 */
  margin-bottom: 20px; /* 设置底部边距 */
}

/*模态框背景*/
.modal-overlay {
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
.modal {
  /* 方向为垂直 */
  flex-direction: column;
  background-color: #fefefe;
  margin: 15% auto; /* 15% 从顶部和居中定位 */
  padding: 20px;
  border: 1px solid #888;
  width: 50%; /* 宽度 */
  border-radius: 10px;

}


/* 模态框主体内容icon样式 */
.iconFWC {
  width: 100px; /* 设置图标的大小 */
  height: 90px;
}

.card-icon { /*设置居中*/
  display: flex; /*设置图标容器为弹性布局*/
  margin-top: 30px;
  flex-direction: column; /*设置子元素垂直排列*/
  align-items: center;
  text-align: center;
}

.front-icon {
  font-size: 24px; /* 调整图标的大小 */
  color: #00B200; /* 绿色 */
}


/* 关闭按钮 */
.closeButton {
  color: #241e1e;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.tabs {
  display: flex;
  justify-content: center;
}

.tab {
  margin: 0 10px;
  font-size: 20px;
  cursor: pointer;
  /* 其他样式 */
}

.tab.active {
  color: green;
  border-bottom: 2px solid green;
}

.tab-content {
  /* 模态框结果内容样式 */
}

.loader {
  /* 加载图标样式 */
}


.container {
  text-align: center;
  width: 300px; /* 容器宽度 */
  margin: 10% auto;
}

.dropdown select, .input-group input {
  width: 100%; /* 宽度为100% */
  padding: 8px; /* 统一内边距 */
  margin: 10px auto; /* 垂直间距 */
  border: 1px solid #ccc; /* 统一边框样式 */
  box-sizing: border-box; /* 盒子模型调整，边框和内边距不再增加宽度 */
  /* 根据需要添加其他样式 */
}
.modal-image{
  width: 15%;
  margin-left: 43%;
}
.center-image {
  max-width: 100%;
  width:70%;
  margin: auto;
}

.input-group {
  position: relative;
}

.input-group input {
  padding-right: 30px; /* 为图标留出空间 */
}


.title {
  color: green;
  margin-bottom: 10px;
}



.checkbox-group {
  margin: 20px 0;
}

.input-group {
  position: relative;

}

.input-group input {
  width: 100%;
  padding-right: 30px; /* 为图标留出空间 */
}

.searchIcon {
  position: absolute;
  top: 50%;
  right: 5px; /* 调整图标与输入框的距离 */
  transform: translateY(-50%);
  cursor: pointer;
}


  .label {
    flex-shrink: 0; /* 防止标签内容收缩 */
    width: 150px; /* 或其他适当的宽度 */
    text-align: left; /* 文本左对齐 */
  }

  .code-block {
  /* flex-grow: 1; 占据剩余空间，使内容水平居中 */
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

.evm_converge-box {
  display: inline-block; /* 使框的大小适应文字内容 */
  padding: 2px; /* 控制文本与边框之间的间距 */
  border: 1px solid cadetblue; /* 设置边框 */
  background-color: lightblue; /* 设置背景颜色 */
  color: dodgerblue; /* 设置文字颜色 */
  border-radius: 5px; /* 添加圆角效果，调整数值以控制圆角的弧度 */

  text-align: right;
}

.flex-container {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center; /* 确保垂直居中 */
  white-space: nowrap;
}
.right-aligned{
  display: inline-block;
  width: 96%;
  text-align: right;
}

  .result p {
    border-bottom: 1px solid #e0e0e0;  /* 添加底部边框 */
    margin-bottom: 15px;  /* 控制横线之间的间隔 */
    padding-bottom: 15px;  /* 控制文字到横线的距离 */
  }


  .editor-box {
    /* 设置编辑框的高度 */
    height: 800px; /* 或者你希望的任何高度 */
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

  /* 添加用于处理长文本内容的样式 */
  .long-text {
    max-height: 200px; /* 根据需要调整最大高度 */
    overflow-y: auto; /* 如果内容超过最大高度，则启用垂直滚动 */
    word-wrap: break-word; /* 避免长单词溢出 */
  }

  /* 将此类添加到包含长文本的特定元素上（例如 constructorArguments） */
  .long-text-content {
    /* 可根据需要添加其他样式以处理长文本内容 */
  }

.abi-container {
  white-space: pre-wrap;
  font-family: 'Courier New', monospace;
}

</style>
