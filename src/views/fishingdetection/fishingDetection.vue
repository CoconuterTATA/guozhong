<template>
  <div class="container">
    <img :src="imageUrl" alt="Image" class="center-image">
    <h2 class="title">钓鱼账户检测</h2>
    
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
  <!--<div class="loading" v-if="isLoading">
      <div class="loader"></div>
  </div>-->
  <div class="loading-overlay" v-if="isLoading==true">
  	<div class="loading-spinner"></div>
  </div>
  <div v-if="isModalOpen" class="modal-overlay">
  <div class="modal">
    <span class="close-button" @click="closeModal">&#x2190;</span> <!-- 返回按钮 -->
    
    <div class="tab-content">
      <div v-if="activeTab === 'result'">
        
      <section class="risk-analysis">
        <h3>钓鱼账户检测</h3>
      </section>
	  
	  <div v-if="isPhishingAccount === '1'">
	  <p>Address:</p>
	  <div class="red-box">警告！！！该地址疑似被用于钓鱼诈骗，请谨慎与该地址进行交互</div>
	  
	  <div class="white-box">Overview</div>
	  <div class="white-box">More info</div>
		<table>
		      <tr>
		        <td>交易HASH</td>
		        <td>区块号</td>
		        <td>From</td>
		        <td>To</td>
		        <td>Value</td>
		      </tr>
			  
			   <tr v-for="row in 3" :key="row">
			    <td></td>
			    <td></td>
			    <td></td>
			    <td></td>
			    <td></td>
				</tr>
		</table>
		  
	  </div>
	  
	  
	  <div v-else>
	  <p>Address:     {{tokenAddress}}</p>
	  <div class="green-box">该用户为正常用户</div>
	  
	  <div class="white-box">Overview
		<p>ETH BALANCE     {{Balance}} ETH</p>
	  
	  </div>
	  <div class="white-box">More info
		<p>上一个交易    {{transactions[1].FromAddress}} </p>
		<p>第一个交易    {{transactions[0].FromAddress}} </p>
	  
	  </div>
	  		<table>
	  		      <tr>
	  		        <td>交易HASH</td>
	  		        <td>区块号</td>
	  		        <td>From</td>
	  		        <td>To</td>
	  		        <td>Value</td>
	  		      </tr>
	  			  
	  			   <!--<tr v-for="row in 3" :key="row">-->
				   <tr v-for="(transaction, index) in transactions" :key="index">
	  			    <td>{{ transaction.TransactionHash }}</td>
	  			    <td>{{ transaction.BlockNumber }}</td>
	  			    <td>{{ transaction.FromAddress }}</td>
	  			    <td>{{ transaction.ToAddress }}</td>
	  			    <td>{{ transaction.Value }}</td>
	  				</tr>
				
					
	  		</table>
		</div>
		
	</div>
	  		  
	  
      
      
    </div>
  </div>
</div>


</template>

<script>
import imageUrl from '@/assets/image/phishing.png';
import axios from 'axios';
export default {
  data() {
    return {
    tokenData: {},
    riskAnalysis: {},
    imageUrl,
    tokenAddress: '',
    isModalOpen: false,
    activeTab: 'result',
    isLoading: false,
	isPhishingAccount: '',
	address: '',
	Balance:'',
	transactions: [],
    };
  },
  /*created() {
  	this.fetchData();
  },*/
  methods: {
    clearInput() {
      this.tokenAddress = '';
    },
    executeSearch() {
      this.isLoading = true; // 立即显示加载图标
      this.isModalOpen = false; // 确保模态框最初不显示

    setTimeout(() => {
      this.isLoading = false; // 2秒后隐藏加载图标
      this.isModalOpen = true; // 然后显示模态框
      // 在这里执行数据请求或其他需要的操作
    }, 2000); // 延迟2秒
      console.log('查询操作：', this.tokenAddress);
	  
	  
	  var url = "http://42.194.184.32:8080/transactionAudit?address=" + this.tokenAddress;
	    axios.get(url)
	     .then(response => {
	      this.address = response.data.address;
	      this.isPhishingAccount = response.data.isPhishingAccount;
		  this.Balance = response.data.Balance;
		  this.transactions = response.data.transactions;
	  	console.log('已查询：', this.tokenAddress);
	      
	  })
	  .catch(error => {
	      console.error('Error fetching data:', error);
	  });
    },
    checkInput() {
      // 检查输入
    },
    closeModal() {
    this.isModalOpen = false; // 关闭模态框
	},
	/*fetchData() {
		var url = "http://42.194.184.32:8080/transactionAudit?address=" + this.tokenAddress;
		  axios.get(url)
		   .then(response => {
		    this.address = response.data.address;
		    this.isPhishingAccount = response.data.isPhishingAccount;
			console.log('已查询：', this.tokenAddress);
		    
		})
		.catch(error => {
		    console.error('Error fetching data:', error);
		});
	}*/
	
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

.loader {
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
  overflow-x:auto;
  overflow-y:auto;
}

.modal {
  width: 900px; /* 固定宽度 */
  height: 95%; /* 固定高度 */
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

.red-box {
  width: 600px;
  height: 40px;
  background-color: #FF6A6A;
  border-radius: 10px;
  margin-bottom: 10px;
  text-align: center;
}

.green-box {
  width: 600px;
  height: 40px;
  background-color: #54FF9F;
  border-radius: 10px;
  margin-bottom: 10px;
  text-align: center;
}


.white-box {
  width: 400px;
  height: 140px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-bottom: 10px;
}

.text-box {
  width: 550px;
  height: 200px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
}

.row {
  display: flex;
  margin-bottom: 5px;
}

.column {
  flex: 1;
  padding: 5px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 5px;
}


table {
  border-collapse: collapse;
  width: 100%;
}

td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}

.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .loading-spinner {
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
  }

</style>
