<template>
    <div class="app-container" v-if="!loading" ref="appContainer">
      <div class="inputs">
    <div class="input-group">
      <span class="input-label">合约名：</span>
      <el-input v-model="contractName"></el-input>
    </div>
    <div class="input-group">
      <span class="input-label">合约版本：</span>
      <el-input v-model="contractVersion"></el-input>
    </div>
    </div>
      <PropTable
          :loading="loading"
          @selection-change="selectionChange"
          :columns="column"
          :data="list"
          @reset="reset"
          @onSubmit="onSubmit"
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

  const formSize = ref('default')
  const ruleFormRef = ref<FormInstance>()
  const ruleForm = reactive({
    name: '',
    sex: null,
    price: null,
  })
  
  const contractName = ref('');
  const contractVersion = ref('');
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
  const column = [
    { type: 'selection', width: 60 ,fixed: 'left'},
    {name: 'id', label: '编号', inSearch: true, valueType: 'input',},
    { name: 'solcVersion', label: '合约版本', inSearch: true, valueType: 'input' },
    { name: 'contractName', label: '合约名', inSearch: true, valueType: 'input' , width: 280},
    { name: 'createdAt', label: '创建日期', sorter: true, inSearch: true, valueType: 'input', width: 180 },
    { name: 'reportLink', label: '检测报告结果', sorter: true, inSearch: true, type: 'link', width: 600 },
  ]

  onMounted(() => {
    nextTick(()=>{
      // let data = appContainer.value.
       // 在nextTick中获取数据，以确保在视图更新后执行
       axios.get('http://42.194.184.32:8080/record/listAuditRecord')
          .then(response => {
            data.value = response.data;
            loading.value = false; // 数据加载完成后隐藏加载动画
            originalData.value = response.data;
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
