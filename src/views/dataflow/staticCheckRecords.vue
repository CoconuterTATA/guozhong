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

  const formSize = ref('default')
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

  const batchDelete = () => {
    if (!selectObj.value.length) {
      return ElMessage.error('未选中任何行')
    }
    ElMessageBox.confirm('你确定要删除选中项吗?', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
    })
        .then(() => {
          ElMessage.success('模拟删除成功')
          list.value = list.value.concat([])
        })
        .catch(() => {})
  }
  const selectionChange = (val) => {
    selectObj.value = val
  }



  const edit = (row) => {
    title.value = '编辑'
    rowObj.value = row
    dialogVisible.value = true
    ruleForm.name = row.name
    ruleForm.sex = row.sex
    ruleForm.price = row.price
  }

  const del = (row) => {
    console.log('row==', row)
    ElMessageBox.confirm('你确定要删除当前项吗?', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
    })
        .then(() => {
          list.value = list.value.filter((item) => item.id !== row.id)
          ElMessage.success('删除成功')
          loading.value = true
          setTimeout(() => {
            loading.value = false
          }, 500)
        })
        .catch(() => {})
  }

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
    {name: 'id', label: 'ID', inSearch: true, valueType: 'input', width: 100},
    { name: 'trafficFileName', label: '流量文件名', inSearch: true, valueType: 'input', width:180 },
    { name: 'createdTime', label: '创建时间', sorter: true, inSearch: true, valueType: 'input', width: 180 },
    { name: 'sessionNum', label: '会话数量', sorter: true, inSearch: true, valueType: 'input', width: 120 },
    { name: 'path', label: '存储路径', inSearch: true, valueType: 'input' ,},

  ])

  const handleCellClick = async (value, row) => {
  console.log('Static Selected value changed to:', value);
  console.log('Static row:', row);

  // 根据 row 的属性来决定要执行的操作
  if ('sessionName' in row) {   // 使用 'in' 来检查属性是否存在
    fetchDetailsBySessionId(value);
  } else if ('id' in row) {
    fetchListBySessionId(value);
  }
}

const fetchDetailsBySessionId = (sessionId) => {
  // 更新表结构为会话详情
  column.value = [
    // ... 你的会话详情结构
  ];

  loading.value = true; // 开启加载动画
  axios.post(`http://42.194.184.32:8080/pcap/listPacketsBySessionld?session_id=${sessionId}`)
    .then(response => {
      console.error('根据会话Name获取详情成功');
      console.log(response.data);
      list.value = response.data; // 更新list的值
      loading.value = false; // 数据加载完成后隐藏加载动画
    })
    .catch(error => {
      console.error('根据会话Name获取详情失败', error);
      loading.value = false; // 处理错误情况，也隐藏加载动画
    });
}


const fetchListBySessionId = (para) => {

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
    console.error('根据sessionId获取数据成功');
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
    nextTick(()=>{
      // let data = appContainer.value.
       // 在nextTick中获取数据，以确保在视图更新后执行
       axios.get('http://42.194.184.32:8080/pcap/listDetectRecord')
          .then(response => {
            data.value = response.data;
            loading.value = false; // 数据加载完成后隐藏加载动画
            // console.log(data.value)
            console.log('获取到的数据:', response.data);
            list.value = response.data;
          })
          .catch(error => {
            console.error('获取数据失败', error);
            loading.value = false; // 处理错误情况，也隐藏加载动画
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
