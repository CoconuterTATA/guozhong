<template>
    <div class="app-container" ref="appContainer">
      <PropTable
          :loading="loading"
          @selection-change="selectionChange"
          :columns="column"
          :data="list"
          :showButton=false
          @reset="reset"
          @onSubmit="onSubmit"
          @handleCellClick="handleCellClick"
          :back=true
          @backOff="goBack"
      >
      </PropTable>
  </div>

  </template>
  <script lang="ts" setup name="comprehensive">
  import axios from 'axios';
  import {ref, reactive, onMounted, nextTick} from 'vue'
  import * as dayjs from 'dayjs'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { FormInstance } from 'element-plus'
  const queryForm = reactive({
    id: null,
    solcVersion: null,
  })

  const loading = ref(true)
  const appContainer = ref(null)
  import PropTable from '@/components/Table/PropTable/index.vue'
  const data = ref([]);
  const list = ref(data)

  const originalList = ref([]);  // 用于保存原始列表的状态
 
  const goBack = () => {
  console.log('goback')
  list.value = originalList.value;
  column.value = [];  // 清空现有的列定义
  column.value = [
    { name: 'id', label: 'ID', inSearch: true, valueType: 'input', width: 100 },
    { name: 'trafficFileName', label: '流量文件名', inSearch: true, valueType: 'input', width: 180 },
    { name: 'createdTime', label: '创建时间', sorter: true, inSearch: true, valueType: 'input', width: 180 },
    { name: 'sessionNum', label: '会话数量', sorter: true, inSearch: true, valueType: 'input', width: 120 },
    { name: 'path', label: '存储路径', inSearch: true, valueType: 'input' },
  ];
};


  const reset = () => {
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 500)
    ElMessage.success('触发重置方法')
  }

  const onSubmit = (val) => {
    console.log('val===', val);
    ElMessage.success('触发查询方法');
    // 使用筛选功能筛选表格数据
    let filteredData = data.value.filter(item => {
      let match = true;
      // 对每一个查询参数进行检查
      if (val.id && Number(item.id) !== Number(val.id)) match = false;
      if (val.solcVersion && item.solcVersion !== val.solcVersion) match = false;
      // 如果有其他参数，继续加入筛选条件...

      return match;
    });
    // 更新list，即表格的显示数据
    list.value = filteredData;
}



  const getHeight = ()=>{

  }
  const column = ref([
    // { type: 'selection', width: 60 ,fixed: 'left'},
    {name: 'id', label: 'ID', inSearch: true,sorter: true,valueType: 'input', width: 100},
    { name: 'trafficFileName', label: '流量文件名', inSearch: true, valueType: 'input', width:180 },
    { name: 'createdTime', label: '创建时间', sorter: true, inSearch: true, valueType: 'input', width: 180 },
    { name: 'sessionNum', label: '会话数量', sorter: true, inSearch: true, valueType: 'input', width: 120 },
    { name: 'path', label: '存储路径', inSearch: true, valueType: 'input' ,},
  ])

  const handleCellClick = async (columnName, value, row) => {
  console.log("Received column:", columnName);
  if (columnName === 'sessionId') {
    fetchDetailsBySessionId(value);
  } else if (columnName === 'id') {
    fetchListBySessionId(value);
  }
};



const fetchDetailsBySessionId = (sessionId) => {
  // 更新表结构为会话详情
  column.value = [];
  column.value = [
    { name: 'packetId', label: '数据包ID',inSearch: true, valueType: 'input' ,width: 100 },
    { name: 'timestamp', label: '时间戳', inSearch: true, valueType: 'input' ,width: 180 },
    { name: 'packetLength', label: '数据包长度', inSearch: true, valueType: 'input' ,width: 120 },
    { name: 'ethernetHeaderSize', label: '以太网头部大小', inSearch: true, valueType: 'input' ,width: 150 },
    { name: 'dstMacAddr', label: '目标MAC地址',inSearch: true, valueType: 'input' , width: 150 },
    { name: 'srcMacAddr', label: '源MAC地址',inSearch: true, valueType: 'input' , width: 150 },
    { name: 'type', label: '类型',inSearch: true, valueType: 'input' , width: 100 },
    { name: 'ipVersion', label: 'IP版本',inSearch: true, valueType: 'input' , width: 100 },
    { name: 'dstIpAddr', label: '目标IP地址',inSearch: true, valueType: 'input' , width: 150 },
    { name: 'srcIpAddr', label: '源IP地址',inSearch: true, valueType: 'input' , width: 150 },
    { name: 'protocol', label: '协议',inSearch: true, valueType: 'input' , width: 100 },
    { name: 'ttl', label: 'TTL',inSearch: true, valueType: 'input' , width: 100 },
    { name: 'ipv4HeaderSize', label: 'IPv4头部大小', inSearch: true, valueType: 'input' ,width: 150 },
    { name: 'dstPort', label: '目标端口',inSearch: true, valueType: 'input' , width: 120 },
    { name: 'srcPort', label: '源端口',inSearch: true, valueType: 'input' , width: 120 },
    { name: 'sessionName', label: '会话名', inSearch: true, valueType: 'input' ,width: 150 }
  ];

  const params = new URLSearchParams();
  console.log(sessionId)
  params.append('session_id', sessionId);
  loading.value = true; // 开启加载动画
  axios.post(`http://42.194.184.32:8080/pcap/listPacketsBySessionId`, params)
    .then(response => {
      console.log(response.data);
      console.log('success')
      list.value = response.data; // 更新list的值
      loading.value = false; // 数据加载完成后隐藏加载动画
    })
    .catch(error => {
      console.error('根据会话ID获取详情失败', error);
      loading.value = false; // 处理错误情况，也隐藏加载动画
    });
}


const fetchListBySessionId = (para) => {
column.value = [];
column.value = [
  {name: 'sessionId', label: '会话ID', inSearch: true, valueType: 'input', width: 100},
  {name: 'sessionName', label: '会话名', inSearch: true, valueType: 'input', width: 100},
  {name: 'sourceIp', label: '源IP', inSearch: true, valueType: 'input', width: 400},
  { name: 'destinationIp', label: '目标IP', inSearch: true, valueType: 'input', width:180 },
  { name: 'destinationPort', label: '目标端口', sorter: true, inSearch: true, valueType: 'input', width: 180 },
  { name: 'detectResult', label: '风险等级', sorter: true, inSearch: true, valueType: 'input', width: 80 },
  { name: 'protocol', label: '协议', inSearch: true, valueType: 'input' ,},
]
loading.value = true; // 开启加载动画
axios.post(`http://42.194.184.32:8080/pcap/listSessionByTrafficId?traffic_id=${para}`)
  .then(response => {
    console.log('根据Id获取session数据成功');
    console.log(response.data);
    list.value = response.data; // 更新list的值
    loading.value = false; // 数据加载完成后隐藏加载动画
  })
  .catch(error => {
    console.error('根据sessionId获取数据失败', error);
    loading.value = false; // 处理错误情况，也隐藏加载动画
  });
}

onMounted(() => {
  nextTick(() => {
    axios.get('http://42.194.184.32:8080/pcap/listDetectRecord')
      .then(response => {
        data.value = response.data;
        originalList.value = response.data;
        list.value = response.data;
        loading.value = false;
        console.log(column.value)
      })
      .catch(error => {
        console.error('获取数据失败', error);
        loading.value = false;
      });
  });
});

  </script>

  <style scoped>
.back-button {
  position: absolute;
  top: 3%;     /* 控制按钮距离顶部的距离 */
  right: 6%;   /* 控制按钮距离右侧的距离 */
  color: white;
  background-color: #409EFF;
  border-color: #409EFF;
}

  .edit-input {
    padding-right: 100px;
  }
  .app-container{
    position: relative;
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
  .back-button{
    position: absolute;
    top: 2.8%;
  }
  </style>
