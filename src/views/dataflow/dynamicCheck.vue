<template>
    <div class="app-container" ref="appContainer">
      <PropTable
          :loading="loading"
          @selection-change="selectionChange"
          :columns="column"
          :data="list"
          :showButton=false
          :showSuperVersion=true
          :showNums=true
          :nodes="versionNodes"
          :nodeCount="nodecount"
          @reset="reset"
          @onSubmit="onSubmit"
          @handleSelectChange="handleSelectChange"
          @handleCellClick="handleCellClick"
          :linkToNormal="['protocol']" 
      >
        <template v-slot:btn>
          <div style="display: flex; justify-content: flex-end">
           
          </div>
        </template>
        <template v-slot:sex="scope">{{ scope.row.sex ? '男' : '女' }}</template>
        <template v-slot:operation="scope">
        </template>
        <template v-slot:reportLink="scope">
          {{ scope.row.reportLink }}
    <a :href="scope.row.reportLink" target="_blank">查看报告</a>
</template>
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
  // const data = []
  const data = ref([]); 
  const list = ref(data)
  const versionNodes = ref([])
  const formSize = ref('default')
  const nodecount = ref(0)
  const ruleFormRef = ref<FormInstance>()
  const ruleForm = reactive({
    name: '',
    sex: null,
    price: null,
  })
  

  const dialogVisible = ref(false)
  const title = ref('新增')
  const rowObj = ref({})
  const selectObj = ref([])
  const add = () => {
    title.value = '新增'
    dialogVisible.value = true
  }
  
  
  const handleCellClick = async (value, row) =>{
    console.log('Dynamic Selected value changed to:', value);
    console.log(row)
  }
  
  const handleSelectChange = async (val) => {
    console.log('Selected value changed to:', val);
    
    try {
        const response = await axios.get(`http://172.26.208.47:3000/search/${val}`);
        
        if (response.status === 200) {
            console.log(response.data)
            list.value = response.data;
        } else {
            console.error('Error fetching data:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


  
  const getHeight = ()=>{
  
  }
  const column = [
    // { type: 'selection', width: 60 ,fixed: 'left'},
    {name: 'time', label: '时间', inSearch: true, valueType: 'input'},
    { name: 'ttl', label: 'TTL', inSearch: true, valueType: 'input', width:180 },
    { name: 'len', label: 'LEN', inSearch: true, valueType: 'input' , width: 180},
    { name: 'protocol', label: 'TCP/UDP', sorter: true, inSearch: true, valueType: 'input', width: 180 },
    { name: 'source_ip', label: '源IP', sorter: true, inSearch: true, valueType: 'input', width: 280 },
    { name: 'source_port', label: '源端口', sorter: true, inSearch: true, valueType: 'input', width: 80 },
    { name: 'destination_ip', label: '目标IP', inSearch: true, valueType: 'input' ,width : 280},
    { name: 'destination_port', label: '目标端口', inSearch: true, valueType: 'input' , width: 100},
    { name: 'risklevel', label: '是否具有风险', sorter: true, inSearch: true, valueType: 'input', width: 280 },
  ]

  onMounted(() => {
    nextTick(()=>{
      axios.get('http://172.26.208.47:3000/active_nodes')
    .then(response => {
      const data = response.data;
      list.value = data.data || [];  // 请按照你的API结构进行调整
      versionNodes.value = data.nodes.map(node => {
        return { value: node, label: node };
      });
      nodecount.value = data.count;
      loading.value = false;
    })
    .catch(error => {
      console.error('获取数据失败', error);
      loading.value = false;
    });
    })
    setTimeout(() => {
      loading.value = false
    }, 500)
  })
  </script>
  
  <style scoped>
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
  