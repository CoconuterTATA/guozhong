<template>
    <div class="app-container" ref="appContainer">
      <PropTable
          :loading="loading"
          @selection-change="selectionChange"
          :columns="column"
          :data="list"
          @reset="reset"
          @onSubmit="onSubmit"
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
  
  const formSize = ref('default')
  const ruleFormRef = ref<FormInstance>()
  const ruleForm = reactive({
    name: '',
    sex: null,
    price: null,
  })
  

  const dialogVisible = ref(false)
  const title = ref('新增')




  
  const getHeight = ()=>{
  
  }
  const column = [
    { type: 'selection', width: 60 ,fixed: 'left'},
    { name: 'contractType', label: '合约类型', inSearch: true, valueType: 'input',width: 200},
	{ name: 'solcVersion', label: '合约版本', inSearch: true, valueType: 'input' ,width: 200},
    { name: 'evmCodeCoverage', label: 'EVM代码覆盖率', inSearch: true, valueType: 'input' , width: 200},
    { name: 'callstack', label: '调用栈', sorter: true, inSearch: true, valueType: 'input', width: 180 },
    { name: 'timeDependency', label: '时间依赖', sorter: true, inSearch: true, type: 'link', width: 200 },
    { name: 'reentrancy', label: '重入', inSearch: true, valueType: 'input' , width: 280},
    { name: 'integerOverflow', label: '整数溢出', sorter: true, inSearch: true, valueType: 'input', width: 180 },
    { name: 'parityMultisigBug_2', label: '多签名合约漏洞', sorter: true, inSearch: true, type: 'link', width: 300 },
    { name: 'integerUnderflow', label: '整数下溢', inSearch: true, valueType: 'input' , width: 280},
    { name: 'moneyConcurrency', label: '货币并发', sorter: true, inSearch: true, valueType: 'input', width: 180 },
    { name: 'assertionFailure', label: '断言失败', sorter: true, inSearch: true, type: 'link', width: 300 },
  ]

  onMounted(() => {
    nextTick(()=>{
      // let data = appContainer.value.
       // 在nextTick中获取数据，以确保在视图更新后执行
       axios.get('http://172.26.208.47:8080/toDetector/record')
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
  