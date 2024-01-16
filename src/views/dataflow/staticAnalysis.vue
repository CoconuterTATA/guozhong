<template>
  <div class="app-container" ref="appContainer">
    <!-- Loading圆圈 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
    <!-- PropTable 组件 -->
    <PropTable
      :loading="loading"
      @selection-change="selectionChange"
      :columns="column"
      :data="list"
      :showButton=true
      @reset="reset"
      @onSubmit="onSubmit"
      @files-uploaded="handleFilesUploaded"
    >
    </PropTable>
  </div>
</template>

  <script lang="ts" setup name="comprehensive">
  import axios from 'axios';
  import {ref, reactive, onMounted, nextTick} from 'vue'
  const queryForm = reactive({
    id: null,
    solcVersion: null,
  })
  const loading = ref(true)
  const appContainer = ref(null)
  import PropTable from '@/components/Table/PropTable/index.vue'
  // const data = []
  const data = ref([]); 
  const list = ref(data)
  const allData = ref([]); 
  const filteredData = ref([]); 
  

  const handleFilesUploaded = (fileNames) => {
    loading.value = true; 
    setTimeout(() => {
      fetchData(fileNames);
    }, 3000); 
};
const fetchData = async (fileNames) => {
    try {
      const response = await axios.get('http://172.26.208.47:8080/trafficDetect');
      list.value = response.data;
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      loading.value = false; 
    }
};
  
  const getHeight = ()=>{
  
  }
  const column = [
    // { type: 'selection', width: 60 ,fixed: 'left'},
    {name: 'sessionId', label: '会话ID', inSearch: true, valueType: 'input'},
    { name: 'sessionName', label: '会话名', inSearch: true, valueType: 'input', width:180 },
    { name: 'protocol', label: 'TCP/UDP', sorter: true, inSearch: true, valueType: 'input', width: 180 },
    { name: 'sourceIp', label: '源IP', sorter: true, inSearch: true, valueType: 'input', width: 280 },
    { name: 'sourcePort', label: '源端口', sorter: true, inSearch: true, valueType: 'input', width: 80 },
    { name: 'destinationIp', label: '目标IP', inSearch: true, valueType: 'input' ,width : 280},
    { name: 'destinationPort', label: '目标端口', inSearch: true, valueType: 'input' , width: 100},
    { name: 'detectResult', label: '是否具有风险', sorter: true, inSearch: true, valueType: 'input', width: 280 },
    { name: 'trafficfileName', label: '检测流量文件名', sorter: true, inSearch: true, valueType: 'input', width: 280}
  ]

  onMounted(() => {
    nextTick(()=>{
    })
    setTimeout(() => {
      loading.value = false
    }, 500)
  })
  </script>
  
  <style scoped>

  
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

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .edit-input {
    padding-right: 100px;
  }
  .app-container{
    flex: 1;
    display: flex;
    width: 100%;
    height: auto;
    padding: 16px;
    box-sizing: border-box;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
  </style>
  