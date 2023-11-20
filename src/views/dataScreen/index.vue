<template>
  <full-screen-container>
    <div class="m-data-screen">
      <div class="header">
        <div class="header-bg-title">安全评测服务舱数据大屏</div>
        <div class="date">{{timeDate}} {{ hourTime }}  </div>
      </div>
      <div class="center">
        <div class="item">
          <div class="item-icon item-icon1">
            <img src="@/assets/image/circle-bg.png" class="circle-bg" />
          </div>
          <div class="item-right">
            <div class="item-right-inner">
              <div class="text-title">SmartFast工具检测次数</div>
              <div class="text-number"
              ><count-to :startVal="0" :endVal=auditData.smartFastAuditNum :duration="3000" separator=""></count-to
              ></div>
              <div class="text-describe">共检测发现{{ auditData.vulnerabilitySum }}个漏洞</div>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="item-icon item-icon1">
            <img src="@/assets/image/circle-bg.png" class="circle-bg" />
          </div>
          <div class="item-right">
            <div class="item-right-inner">
              <div class="text-title">Oyente工具检测次数</div>
              <div class="text-number"
              ><count-to :startVal="0" :endVal=auditData.oyenteAuditNum :duration="3000" separator=""></count-to
              ></div>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="item-icon item-icon1">
            <img src="@/assets/image/circle-bg.png" class="circle-bg" />
          </div>
          <div class="item-right">
            <div class="item-right-inner">
              <div class="text-title">ToDetector工具检测次数</div>
              <div class="text-number"
              ><count-to :startVal="0" :endVal=auditData.toDetectorAuditNum :duration="3000" separator=""></count-to
              ></div>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="item-icon item-icon1">
            <img src="@/assets/image/circle-bg.png" class="circle-bg" />
          </div>
          <div class="item-right">
            <div class="item-right-inner">
              <div class="text-title">流量检测工具检测次数</div>
              <div class="text-number"
              ><count-to :startVal="0" :endVal=auditData.trafficDetectAuditNum :duration="3000" separator=""></count-to
              ></div>
              <div class="text-describe">共检测{{ auditData.pcapSession }}个会话{{ auditData.pcapPacket }}个包</div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="left">
          <div class="item-complex" style="margin-bottom: 20px">
            <line-charts width="100%" height="100%" />
          </div>
          <div class="item-complex">
            <MultilineCharts />
          </div>
        </div>
        <div class="middle">
         <div class="migration">
           <migration-charts height="100%" width="100%" id="migration" />
         </div>
        </div>
        <div class="right">
          <div class="item-complex" style="margin-bottom: 20px">
            <BarCharts width="100%" height="100%" />
          </div>
          <div class="item-complex">
            <PieCharts />
          </div>
        </div>
      </div>
    </div>
  </full-screen-container>
</template>

<script lang="ts" setup>
import {onBeforeUnmount, onMounted, ref} from 'vue'
import FullScreenContainer from './components/full-screen-container.vue'
import CountTo from '@/components/CountTo/index.vue'
import LineCharts from '@/components/DataScreen/lineEcharts/index.vue'
import BarCharts from '@/components/DataScreen/barEcharts/index.vue'
import MigrationCharts from '@/components/DataScreen/migrationEcharts/index.vue'
import MultilineCharts from '@/components/DataScreen/Multiline/index'
import PieCharts from '@/components/DataScreen/Pie/index'
import axios from "axios";

const timeDate = ref()
const hourTime = ref()
const time1 = ref()
const getHour = ()=>{
  let date = new Date()
  let hour = date.getHours().toString().padStart(2,'00')
  let minute = date.getMinutes().toString().padStart(2,'00')
  let second = date.getSeconds().toString().padStart(2,'00')
  hourTime.value =  `${hour}:${minute}:${second}`
  time1.value = setTimeout(()=>{
    time1.value&&clearTimeout(time1.value)
    getHour()
  },1000)
}
const getNowTime = ()=>{
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth()+1
  let day = date.getDate()
  timeDate.value = `${year}年${month}月${day}日`
  getHour()

}
onMounted(()=>{
  getNowTime()
})

onBeforeUnmount(()=>{
  time1.value = null
})


// 定义审计数据
const auditData = {
  smartFastAuditNum: null,
  oyenteAuditNum: null,
  toDetectorAuditNum: null,
  trafficDetectAuditNum: null,
  pcapSession: null,
  pcapPacket: null,
  vulnerabilitySum: null,
};


// 定义方法，使用的vite 的 script setup
const methods = {
  // 异步获取接口数据的方法
  async getAuditNum(url, propertyName) {
    try {
      const response = await axios.get(url);
      auditData[propertyName] = response.data; // Assuming the data is directly in response.data
      console.log(auditData);
    } catch (error) {
      console.error('获取数据失败', error);
    }
  },
  // 刷新所有值的方法
  refreshValues() {
    methods.getAuditNum('http://42.194.184.32:8080/smartfast/getAuditNum', 'smartFastAuditNum');
    methods.getAuditNum('http://42.194.184.32:8080/oyente/getAuditNum', 'oyenteAuditNum');
    methods.getAuditNum('http://42.194.184.32:8080/toDetector/getAuditNum', 'toDetectorAuditNum');
    methods.getAuditNum('http://42.194.184.32:8080/pcap/getAuditNum', 'trafficDetectAuditNum');
    methods.getAuditNum('http://42.194.184.32:8080/pcap/getSessionMaxID', 'pcapSession');
    methods.getAuditNum('http://42.194.184.32:8080/pcap/getPacketMaxID', 'pcapPacket');
    methods.getAuditNum('http://42.194.184.32:8080/smartfast/getVulnerabilitySum', 'vulnerabilitySum');
  },
};
// 在组件挂载后执行的逻辑
onMounted(() => {
  methods.refreshValues(); // Initial load
  setInterval(methods.refreshValues, 20000); // Refresh every 20 seconds
});


</script>

<style lang="scss" scoped>
@import "./index";
</style>
