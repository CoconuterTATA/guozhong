<template>
    <div class="container">
      <div class="image-loader-container">
        <div class="loader"></div>
        <div class="icon">
        <img :src="btc" alt="btcicon" class="btcIcon">
      </div>
      </div>
    <el-select v-model="selected" class="rounded-select">
      <el-option label="ETH" value="ETH"></el-option>
      <el-option label="BTC" value="BTC"></el-option>
    </el-select>
      <p class="title">BTC Gas Price (sat/vB)</p>
      <p class="subtitle">最新实时报价</p>
      <p class="subtitle">{{ currentTime }}</p>
      <p class="bitcoinPrice">{{ bitcoinPrice }}</p>
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
            <span v-if="index === 0">15 分钟</span>
            <span v-else-if="index === 1">30 分钟</span>
            <span v-else>45 分钟</span>
          </p><!-- 下方文本 -->
          <p class="custom-text-below">{{ customTextBelow[index] }}</p>

        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ElSelect, ElOption } from 'element-plus';
  import btc from '@/assets/image/btc.png';
  import orangeImage from '@/assets/image/orange-gas.png';
  import blueImage from '@/assets/image/blue-gas.png';
  import greenImage from '@/assets/image/green-gas.png';
  export default {
    data() {
      return {
        customTextAbove: ['sat/vB', 'sat/vB', 'sat/vB'],
        customTextBelow: ['$123', '$123', '$123'],
        selected:'',
        currentTime: new Date().toLocaleString(),
        bitcoinPrice: '$123456',
        imageSources: [blueImage, orangeImage, greenImage],
        btc,
        rectangleNumbers: [1, 2, 3],
      };
    },
    mounted() {
      
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
}
.rectangle span {
  font-size: 40px;
  font-weight: bold;
}
</style>