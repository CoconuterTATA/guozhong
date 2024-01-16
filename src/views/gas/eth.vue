<template>
    <div class="container">
      <!--<div class="image-loader-container">
        <div class="loader"></div>
        <div class="icon">
        <img :src="eth" alt="ethicon" class="btcIcon">
      </div>
      </div>-->
    <el-select v-model="selected" class="rounded-select">
      <el-option label="ETH" value="ETH"></el-option>
      <el-option label="BSC" value="BSC"></el-option>
    </el-select>
	
		
	    <div v-if="selected === 'BSC'">
			<div class="image-loader-container">
			  <div class="loader"></div>
			  <div class="icon">
			  <img :src="bsc" alt="bscicon" class="btcIcon">
			</div>
			</div>
			<p class="title">BSC Gas Price</p>
		    <p class="subtitle">最新实时报价</p>
		        <p class="subtitle">{{ currentTime }}</p>
		        <p class="bitcoinPrice">{{ BscPrice }}</p>
				
				
		      <p class="blockNum">最新区块编号</p>
		       <p class="bluetext">{{ LastBlock2 }}</p>
		      
		        <div class="images">
		          <div class="image-container" v-for="(image, index) in imageSources" :key="index">
		            <p class="text-above">
		              <span v-if="index === 0">高速</span>
		              <span v-else-if="index === 1">标准</span>
		              <span v-else>缓慢</span>
		            </p>
		            <img :src="image" :alt="'Image ' + (index + 1)">
		            <div class="rectangle">
		              <span class="numberCss">{{ rectangleNumbers2[index] }}</span>
		            </div>
		            <p class="custom-text-above">{{ customTextAbove[index] }}</p>
		            <p class="text-below">
		              <span v-if="index === 0">2 分钟</span>
		              <span v-else-if="index === 1">5 分钟</span>
		              <span v-else>30 分钟</span>
		            </p><!-- 下方文本 -->
		            <!--<p class="custom-text-below">{{ customTextBelow[index] }}</p>-->
		          </div>
		        </div>
	
		    </div>
			
			<!-- 根据选择框的值切换页面 -->
			    <div v-else>
			      <!-- 第一个页面的内容 -->
				  <div class="image-loader-container">
				    <div class="loader"></div>
				    <div class="icon">
				    <img :src="eth" alt="ethicon" class="btcIcon">
				  </div>
				  </div>
			      <p class="title">ETH Gas Price (Gwei)</p>
				    <p class="subtitle">最新实时报价</p>
				    <p class="subtitle">{{ currentTime }}</p>
				    <p class="bitcoinPrice">{{ UsdPrice }}</p>
					
					<!--<div class="loading" v-if="isLoading==true">-->
					    <!-- 加载状态元素，例如加载图标 -->
					    <!--<div class="loader2" ></div>
					</div>-->
					
				  <p class="blockNum">最新区块编号</p>
				   <p class="bluetext">{{ LastBlock }}</p>
				  
				    <div class="images">
				      <div class="image-container" v-for="(image, index) in imageSources" :key="index">
				        <p class="text-above">
				          <span v-if="index === 0">高速</span>
				          <span v-else-if="index === 1">标准</span>
				          <span v-else>缓慢</span>
				        </p>
				        <img :src="image" :alt="'Image ' + (index + 1)">
				        <div class="rectangle">
				          <span class="numberCss">{{ rectangleNumbers[index] }}</span>
				        </div>
				        <p class="custom-text-above">{{ customTextAbove[index] }}</p>
				        <p class="text-below">
				          <span v-if="index === 0">2 分钟</span>
				          <span v-else-if="index === 1">5 分钟</span>
				          <span v-else>30 分钟</span>
				        </p><!-- 下方文本 -->
				        <!--<p class="custom-text-below">{{ customTextBelow[index] }}</p>-->
				      </div>
				    </div>
				    
				    
				    
				    <p class="blockNum">建议的基础费用</p>
				    <p class="bluetext">{{suggestBaseFee}}</p>
				    <div class="container">
				        <div class="recentBlock">
				  		<div class="title2">最近五个区块的gas使用率</div>
				  		
				  		
				  		<div class="row" v-for="(item, index) in items" :key="index">
				  		        <div class="col">{{ '#' + (index + 1) }}</div>
				  		        <div class="col">{{item}}</div>
				  		    </div>
				          	
				  		
				        </div>
				      </div>
				    <p class="blockNum">您愿意花费gas为 (wei)：</p>
				  		<div class="search-container">
				  		  <input v-model="searchText" type="text" class="search-input" placeholder="搜索...">
				  		  <button class="search-button" @click="search">搜索</button>
				  		</div>
						<div class="loading-overlay" v-if="isLoading==true">
						    <!--
						    <div class="loader2" ></div>-->
							<div class="loading-spinner"></div>
						</div>
				  		<p class="blockNum">您的交易确认时间预计为{{searchResult}}秒</p>
			    </div>
			
		</div>
    

  </template>
  
  <script>
  import { ElSelect, ElOption } from 'element-plus';
  import eth from '@/assets/image/eth.png';
  import bsc from '@/assets/image/BSC.png'
  import orangeImage from '@/assets/image/orange-gas.png';
  import blueImage from '@/assets/image/blue-gas.png';
  import greenImage from '@/assets/image/green-gas.png';
  import axios from 'axios';
  export default {
    data() {
      return {
        customTextAbove: ['sat/vB', 'sat/vB', 'sat/vB'],
        customTextBelow: ['$123', '$123', '$123'],
        selected:'',
        currentTime: new Date().toLocaleString(),
        imageSources: [blueImage, orangeImage, greenImage],
        eth,
		rectangleNumbers: [],
		UsdPrice: '',//ETH当前美元价格
		LastBlock: '',// 以太坊网络上最新的区块编号
		SafeGasPrice: '',//推荐的 gas 价格，交易有很高的概率在 30 分钟内被确认
		ProposeGasPrice: '',//推荐的 gas 价格，交易有很高的概率在 5 分钟内被确认
		FastGasPrice: '',//推荐的 gas 价格，交易有很高的概率在 2 分钟内被确认
		suggestBaseFee: '',//建议的基础费用
		gasUsedRatio : '', 
		items: [],
		searchResult: '____',
		bsc,
		isLoading: false,
		
		
		rectangleNumbers2: [],
		BscPrice: '',//
		LastBlock2: '',// 
		SafeGasPrice2: '',//
		ProposeGasPrice2: '',//
		FastGasPrice2: '',//
		

	  };
    },
	created() {
		this.fetchData();
		this.fetchData2();
		
	},
	methods: {
	    fetchData() {
	      axios.get('http://172.26.208.47:8080/publicChain/getEthGasTracker')
	        .then(response => {
	          this.UsdPrice = response.data.UsdPrice;
	          this.LastBlock = response.data.LastBlock;
	          this.SafeGasPrice = response.data.SafeGasPrice;
	          this.ProposeGasPrice = response.data.ProposeGasPrice;
	          this.FastGasPrice = response.data.FastGasPrice;
	          this.suggestBaseFee = response.data.suggestBaseFee;
	          this.gasUsedRatio = response.data.gasUsedRatio;
	
	          this.rectangleNumbers = [
	            parseInt(this.FastGasPrice),
	            parseInt(this.ProposeGasPrice),
	            parseInt(this.SafeGasPrice),
	          ];
	          this.items = this.gasUsedRatio.split(',').map(item => parseFloat(item));
	        })
	        .catch(error => {
	          console.error('Error fetching data:', error);
	        });
	    },
		
		fetchData2() {
		  axios.get('http://172.26.208.47:8080/publicChain/getBscGasTracker')
		    .then(response => {
		      this.BscPrice = response.data.UsdPrice;
		      this.LastBlock2 = response.data.LastBlock;
		      this.SafeGasPrice2 = response.data.SafeGasPrice;
		      this.ProposeGasPrice2 = response.data.ProposeGasPrice;
		      this.FastGasPrice2 = response.data.FastGasPrice;
			
		      this.rectangleNumbers2 = [
		        parseInt(this.FastGasPrice2),
		        parseInt(this.ProposeGasPrice2),
		        parseInt(this.SafeGasPrice2),
		      ];
		      //this.items = this.gasUsedRatio.split(',').map(item => parseFloat(item));
		    })
		    .catch(error => {
		      console.error('Error fetching data:', error);
		    });
		},
		
		search() {
			var url = "http://172.26.208.47:8080/publicChain/estimateConfirmTime?gasPrice=" + this.searchText;
			//axios.get('http://172.26.208.47:8080/publicChain/estimateConfirmTime',{ params: { query: this.searchText } })
			this.isLoading = true; // 立即显示加载图标
			this.isModalOpen = false; // 确保模态框最初不显示
			
			setTimeout(() => {
			  this.isLoading = false; // 2秒后隐藏加载图标
			  this.isModalOpen = true; // 然后显示模态框
			  // 在这里执行数据请求或其他需要的操作
			}, 2000); // 延迟2秒
			  console.log('查询操作：', this.tokenAddress);
			axios.get(url)
			  .then(response => {
			    this.searchResult = response.data;
				setTimeout(() => {
				      this.isLoading = false;
				    }, 2500);
			    //this.showModal = true;
				MessageBox.alert(response.data, '搜索结果', {
				            confirmButtonText: '关闭',
				          });
			})
			.catch(error => {
			    console.error('Error fetching data:', error);
			});
		},
		
	},
    mounted() {
		/*setTimeout(() => {
		      this.isLoading = false;
		    }, 2500);*/
    },
  components: {
    ElSelect,
    ElOption
  },
  // 其他的 data, methods 等
};
  </script>
  <style>
  .subtitle{
    color: darkgray;
  }
.bitcoinPrice {
  background-color: #b2f2bb; /* 浅绿色背景 */
  color: #95c492; /* 绿色文本 */
  padding: 6px; /* 添加一些内边距 */
  border-radius: 5px; /* 可选的圆角边框 */
  display: inline-block;
  position: relative;
  bottom: 2%;
  /* 可根据需要添加其他样式，如字体大小、边框等 */
}
.blockNum {
  color: #353935;
}
.recentBlock {
	  width: 350px; 
	     height: 200px;
	     background-color: white;
	     border-radius: 40px;
	     box-shadow: 0 0 20px rgba(0, 0, 0, 0.2); /* 增加阴影的模糊度和透明度 */
}
.row {
	  display: flex;
	      height: 16%;
}
.col {
    width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 15px;
        font-weight: bold;
        color: #333;
        border-radius: 10px;
}
  .title2 {
     display: flex;
        justify-content: center;
        align-items: center;
        height: 10%;
        font-size: 15px;
        font-weight: bold;
        color: #333;
        text-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        margin-bottom: 15px; /* 增加标题和下面文字的间距为20px */
  }
  .bluetext {
	  color: #1E90FF;
	  font-weight: bold;
  }
  
   
	.search-container {
	    display: flex;
	    align-items: center;
	    border: 2px solid green;
	    border-radius: 5px;
	    padding: 5px;
	  }
	
	  .search-input {
	    border: none;
	    padding: 5px;
	    margin-right: 5px;
	    outline: none;
	    flex-grow: 1;
	  }
	
	  .search-button {
	    background-color: green;
	    color: white;
	    border: none;
	    padding: 5px 10px;
	    border-radius: 5px;
	    cursor: pointer;
	  }
	
	  .search-button:hover {
	    background-color: darkgreen;
	  }


  .text-above, .text-below,.custom-text-above, .custom-text-below {
  right: 5%;
  position: absolute;
  width: 100%;
  text-align: center;
  color: #f3f3f3; /* 自定义颜色 */
  font-size: 16px; /* 自定义字体大小 */
}
.custom-text-above{
  bottom: 32%;
  font-size: 13px;
  color:darkgray;
}
.custom-text-below{
  bottom: 10%;
  color: #333333;
  font-size: 13px;
}
.text-above {
  top: 10px; /* 调整距离以适应您的布局 */
  color: #f3f3f3;
}

.text-below {
  bottom: 20%; /* 调整距离以适应您的布局 */
  font-size: 14px;
}
  .image-loader-container {
  position: relative;
  display: inline-block; /* 或者根据需要调整 */
}

/* 加载动画样式 */
.loader {
  border: 5px solid #f3f3f3; /* 浅色边框 */
  border-top: 5px solid #FFAC1C; /* 蓝色边框 */
  border-radius: 50%;
  width: 250px;
  height: 250px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: spin 2s linear infinite;
}

/* 动画效果 */
@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

  .btcIcon{
    display: block;
  max-width: 100%;
  height: auto;
  }
  .numberCss{
    color: white;
    /* font-size: 0em; */
  }
.container {
  text-align: center;
  width: 300px; /* 容器宽度 */
  margin: 10% auto;
}
.images {
  display: flex;
  justify-content: space-around;
  width: 100%;
}
.image-container {
  position: relative;
}
.rectangle {
  position: absolute;
  top: 60px;
  left: 40px;
  width: 100px;
  height: 60px;
  background-color: rgba(128, 128, 128, 0.5);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}
.title{
  font-weight: bolder;
  font-size: 30px;
  color: #333333;
}
.rectangle span {
  font-size: 40px;
  font-weight: bold;
}
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

.loader2 {
  border: 5px solid #f3f3f3; /* 浅灰色边框 */
  border-top: 5px solid #3498db; /* 蓝色边框 */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
  position: relative;
  left: 5%;
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