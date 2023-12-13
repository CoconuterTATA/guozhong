<template>
    <div class="app-container" v-if="!loading" ref="appContainer">
      <div class="inputs">
    </div>
      <PropTable
          :loading="loading"
          @selection-change="selectionChange"
          :columns="column"
          :data="list"
          @reset="reset"
          @onSubmit="onSubmit"
          :showInput="true"
          @search="handleSearch"
      >
      </PropTable>
    </div>
  </template>
  <script lang="ts" setup name="comprehensive">
  import axios from 'axios';
  import {ref, reactive, onMounted, nextTick, watch} from 'vue'
  import * as dayjs from 'dayjs'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { FormInstance } from 'element-plus'
  const queryForm = reactive({
    id: null,
    solcVersion: null,
  })
  const originalData = ref([]);
  const loading = ref(true)
  const appContainer = ref(null)
  import PropTable from '@/components/Table/PropTable/index.vue'
  // const data = []
  const data = ref([]);
  const list = ref(data)

  const contractName = ref('');
  const contractVersion = ref('');
  // const loading = ref(true);
  const dialogVisible = ref(false)
  const title = ref('新增')
  const rowObj = ref({})
  const selectObj = ref([])



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
const handleSearch = ({ contractName, contractVersion }) => {
  list.value = originalData.value.filter(item => {
    const matchesName = contractName ? item.contractName.includes(contractName) : true;
    const matchesVersion = contractVersion ? item.solcVersion.includes(contractVersion) : true;
    return matchesName && matchesVersion;
  });
};


  const getHeight = ()=>{

  }
  const column = [
    { type: 'selection', width: 60 ,fixed: 'left'},
    {name: 'id', label: '编号', inSearch: true, valueType: 'input',},
    { name: 'solcVersion', label: '合约版本', inSearch: true, valueType: 'input' },
    { name: 'contractName', label: '合约名', inSearch: true, valueType: 'input' , width: 280},
    { name: 'createdAt', label: '创建日期', sorter: true, inSearch: true, valueType: 'input', width: 180 },
    { name: 'reportLink', label: '检测报告结果', sorter: true, inSearch: true, type: 'link', width: 600 },
  ]

  onMounted(async () => {
  try {
    const response = await axios.get('http://42.194.184.32:8080/record/listAuditRecord');
    data.value = response.data;
    originalData.value = response.data;
    list.value = response.data;
  } catch (error) {
    console.error('获取数据失败', error);
  } finally {
    loading.value = false; // 无论数据加载成功或失败，都应该停止加载状态
  }
});
  watch([contractName, contractVersion], () => {
  // 当输入框的内容发生变化时，执行查询
  performQuery();
});
const performQuery = () => {
  list.value = originalData.value.filter(item => {
    const contractNameValue = item.contractName || '';
    const contractVersionValue = item.solcVersion || '';
    return contractNameValue.includes(contractName.value) && contractVersionValue.includes(contractVersion.value);
  });
};

  </script>

  <style scoped>
  .el-input__wrapper {
  border: none; /* 如果要去掉边框 */
  padding: 0; /* 如果要调整内边距 */
  /* 其他需要调整的样式 */
}

.input-group .el-input {
  width: 40%; /* 输入框将占据其父元素的全部宽度 */
}

.inputs {
  display: flex;
  justify-content: space-between; /* 确保输入组之间有一些间隔 */
  position: relative;
  top: 4.4%;
  left: 2%;
  width: 80%;
}

.input-group {
  /* padding-top: 10px; 增加上内边距 */
  /* padding-bottom: 10px; 增加下内边距 */

  display: flex;
  align-items: center;
  flex: 1; /* 使所有输入组具有相同的宽度 */
  margin-right: -20%; /* 如果需要，可以在输入组之间添加一些间距 */
}

.input-label {
  margin-right: 10px; /* 标签与输入框之间的间距 */
}


/* 最后一个输入组不需要右边距 */
.inputs .input-group:last-child {
  margin-right: 20%;
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
