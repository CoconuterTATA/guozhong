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
        @input="checkInput"
      >
      <span class="clearIcon" v-if="tokenAddress" @click="clearInput">&#x2715;</span>
      <span class="searchIcon" @click="executeSearch">&#x1F50D;</span>
    </div>
  </div>
  <div class="loading" v-if="isLoading">
      <!-- 加载状态元素，例如加载图标 -->
      <div class="loaderSecur"></div>
  </div>
  <div v-if="isModalOpen" class="modal-overlay">
  <div class="modal">
    <span class="close-button" @click="closeModal">&#x2190;</span> <!-- 返回按钮 -->
    <img :src="imageUrl" alt="Image" class="modal-image">
    <div class="tabs">
      <span class="tab" :class="{ active: activeTab === 'result' }" @click="activeTab = 'result'">Result</span>
      <span class="tab" :class="{ active: activeTab === 'code' }" @click="activeTab = 'code'">Code</span>
      <span class="tab" :class="{ active: activeTab === 'abi' }" @click="activeTab = 'abi'">Abi</span>
    </div>
    <div class="tab-content">
      <div v-if="activeTab === 'result'">
        <!-- Result内容 -->
        <section class="info-section">
        <h3>合约信息</h3>
        <hr>
        <p>id: <span class="value">{{ tokenData.id || '无' }}</span></p>
        <hr>
        <p>编译器版本:<span class="value">{{ tokenData.compilerVersion || '无' }}</span></p>
        <hr>
        <p>合约名: <span class="value">{{ tokenData.contractName || '无' }}</span></p>
        <hr>
        <p>合约地址: <span class="contractAddress">{{ tokenData.contractAddress || '12312312' }}</span></p>
        <hr>
        <p>合约创建者: <span class="value">{{ tokenData.contractCreator || '无' }}</span></p>
        <hr>
        <p>合约哈希: <span class="value">{{ tokenData.createTxHash || '无' }}</span></p>
        <hr>
        <p>检测报告链接: <span class="contractAddress">{{ tokenData.reportLink || '无' }}</span></p>
        <hr>
        <p>合约是否开源: 
        <span class="value">
          <template v-if="tokenData.token">
            {{ tokenData.token }}
          </template>
          <template v-else>
            <span class="closeSource">合约未开源<span class="no-data-icon"></span></span>
          </template>
        </span>
      </p>
        <hr>
        <!-- 相关信息展示，例如Token、Symbol等 -->
      </section>
      <section class="risk-analysis">
        <h3>检测结果</h3>
        <hr>
        <!-- 相关信息展示，例如买入费率、卖出费率等 -->
        <!-- <p>买入费率: <span class="security">{{ tokenData.token || '0%' }}</span></p>
        <hr>
        <p>卖出费率: <span class="security">{{ tokenData.token || '0%' }}</span></p>  <hr> -->
        <p>高风险漏洞
          <span :class="{ 'highLevelVulnerability': tokenData.highLevelVulnerability !== 0, 'security': !tokenData.highLevelVulnerability }">
            <template v-if="tokenData.highLevelVulnerability">
              {{ tokenData.highLevelVulnerability }}
            </template>
            <template v-else>
              <span>无<span class="secure"></span></span>
            </template>
          </span>
        </p><hr>
        <p>中风险漏洞
          <span :class="{ 'mediumLevelVulnerability': tokenData.mediumLevelVulnerability !== 0, 'security': !tokenData.mediumLevelVulnerability }">
            <template v-if="tokenData.mediumLevelVulnerability">
              {{ tokenData.mediumLevelVulnerability }}
            </template>
            <template v-else>
              <span>无<span class="secure"></span></span>
            </template>
          </span>
        </p><hr>
        <p>低风险漏洞
          <span :class="{ 'lowLevelVulnerability': tokenData.lowLevelVulnerability !== 0, 'security': !tokenData.lowLevelVulnerability }">
            <template v-if="tokenData.lowLevelVulnerability">
              {{ tokenData.lowLevelVulnerability }}
            </template>
            <template v-else>
              <span>无<span class="secure"></span></span>
            </template>
          </span>
        </p><hr>
        <p>警告
          <span :class="{ 'warning': tokenData.warning !== 0, 'security': !tokenData.warning }">
            <template v-if="tokenData.warning">
              {{ tokenData.warning }}
            </template>
            <template v-else>
              <span>无<span class="secure"></span></span>
            </template>
          </span>
        </p><hr>
        <p>建议
          <span :class="{ 'needOpt': tokenData.warning !== 0, 'security': !tokenData.warning }">
            <template v-if="tokenData.needOpt">
              {{ tokenData.needOpt }}
            </template>
            <template v-else>
              <span>无<span class="secure"></span></span>
            </template>
          </span>
        </p><hr>
      <p>时间戳
        <span class="value">
          <template v-if="tokenData.timestamp">
            {{ tokenData.timestamp }}
          </template>
        </span>
      </p> <hr>
      <p>链
        <span class="value">
          <template v-if="tokenData.chain">
            {{ tokenData.chain }}
          </template>
        </span>
      </p> <hr>
      <p>可优化
        <span class="value">
          <template v-if="tokenData.optimizationUsed">
            {{ tokenData.optimizationUsed }}
          </template>
          <template v-else>
            <span class="security">安全<span class="secure"></span></span>
          </template>
        </span>
      </p> <hr>
      <p>runs
        <span class="value">
          <template v-if="tokenData.runs">
            {{ tokenData.runs }}
          </template>
          <template v-else>
            <span class="security">安全<span class="secure"></span></span>
          </template>
        </span>
      </p> <hr>
      <p>构造参数
        <span class="value">
          <template v-if="tokenData.constructorArguments">
            {{ tokenData.constructorArguments }}
          </template>
        </span>
      </p> <hr>
      <p>evm版本
        <span class="value">
          <template v-if="tokenData.evmVersion">
            {{ tokenData.evmVersion }}
          </template>
        </span>
      </p> <hr>
      <p>库
        <span class="value">
          <template v-if="tokenData.library">
            {{ tokenData.library }}
          </template>
        </span>
      </p> <hr>
      <p>证书类型
        <span class="value">
          <template v-if="tokenData.licenseType">
            {{ tokenData.licenseType }}
          </template>
        </span>
      </p> <hr>
      <p>代理
        <span class="value">
          <template v-if="tokenData.proxy">
            {{ tokenData.proxy }}
          </template>
        </span>
      </p> <hr>
      <p>实施
        <span class="value">
          <template v-if="tokenData.implementation">
            {{ tokenData.implementation }}
          </template>
        </span>
      </p> <hr>
      <p>swarmsource
        <span class="value">
          <template v-if="tokenData.swarmsource">
            {{ tokenData.swarmsource }}
          </template>
        </span>
      </p> <hr>
      <p>标记
        <span class="value">
          <template v-if="tokenData.remark">
            {{ tokenData.remark }}
          </template>
        </span>
      </p> <hr>
      </section>
      </div>
      <div v-if="activeTab === 'code'">
        <pre>{{ tokenData.code || '无代码信息' }}</pre>
      </div>
    </div>
    <div v-if="activeTab === 'abi'">
      <pre>{{ tokenData.abi || '无ABI信息' }}</pre>
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

      axios.post(url, { address: this.tokenAddress })
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
    
  }
};
</script>

<style>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed; /* 使用 fixed 定位使其相对于视口居中 */
  top: 0%;
  left: 0%;
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
  top: 0px;
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
.contractAddress{
  float: right;
  color: #4A90E2; /* 字体颜色 */
  background-color: #F0F4F8; /* 背景颜色 */
  border: 1px solid #D0D4D8; /* 边框颜色和大小 */
  padding: 2px 5px; /* 内边距：垂直和水平 */
  border-radius: 4px; /* 边框圆角 */
}
.value{
  float: right;
}
.modal::-webkit-scrollbar {
  width: 10px; /* 滚动条宽度 */
}

.modal::-webkit-scrollbar-track {
  background: #f1f1f1; /* 滚动条轨道颜色 */
}

.modal::-webkit-scrollbar-thumb {
  background: #888; /* 滚动条滑块颜色 */
}

.modal::-webkit-scrollbar-thumb:hover {
  background: #555; /* 滚动条滑块悬停颜色 */
}

hr {
  border: none; /* 移除默认边框 */
  height: 1px; /* 设置高度，这将决定横线的粗细 */
  background-color: rgba(170, 165, 165, 0.747); /* 设置横线颜色 */
  margin-top: 20px; /* 设置顶部边距 */
  margin-bottom: 20px; /* 设置底部边距 */
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  width: 600px; /* 固定宽度 */
  height: 100%; /* 固定高度 */
  overflow: auto; /* 启用滚动条 */
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  /* 其他样式 */
}

.close-button {
  position: relative;
  top: 10px;
  left: 10px;
  width: 30px;
  height: 30px;
  background-color: #f5f5f5;
  border-radius: 50%;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.info-section, .risk-analysis, .pool-size, .holding-info {
  margin-bottom: 20px;
  /* 样式调整 */
}
.tabs {
  display: flex;
  justify-content: center;
}

.tab {
  margin: 0 10px;
  cursor: pointer;
  /* 其他样式 */
}

.tab.active {
  color: green;
  border-bottom: 2px solid green;
}

.tab-content {
  /* 内容区域样式 */
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

.clearIcon, .searchIcon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.clearIcon {
  right: 30px;
}

.searchIcon {
  right: 5px;
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

.clearIcon, .searchIcon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.clearIcon {
  right: 30px; /* 可根据需要调整位置 */
}

.searchIcon {
  right: 5px; /* 可根据需要调整位置 */
}

</style>
