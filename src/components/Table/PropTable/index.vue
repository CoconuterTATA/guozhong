<template>
  <div class="zb-pro-table">
    <div class="header">
      <el-form :inline="true" class="search-form" :model="formInline" ref="ruleFormRef">
        <template v-for="(item, index) in formSearchData" :key="index">
          <el-form-item class="elformcss" :label="item.label" v-show="isExpand ? isExpand : index < 1">
            <template v-if="item.valueType === 'input'" >
              <!-- <el-input class="inputsearch" v-model="formInline[item.name]" :placeholder="`请输入${item.label}`" /> -->
            </template>
            <template v-if="item.valueType === 'link'">
              <a :href="formInline[item.name]" target="_blank">{{ item.label }}</a>
            </template>
            <template v-if="item.valueType === 'select'">
              <el-select
                style="width: 100%"
                v-model="formInline[item.name]"
                :placeholder="`请选择${item.label}`"
              >
                <el-option
                  v-for="ite in item.options"
                  :key="ite.value"
                  :label="ite.label"
                  :value="ite.value"
                />
              </el-select>
            </template>
          </el-form-item>
        </template>
      </el-form>
      <el-select 
  v-model="selectedValue" 
  placeholder="请选择监控节点" 
  style="width: 20%;"
  v-if="showSuperVersion"
  @change="handleSelectChange"
>
  <el-option
    v-for="node in nodes"
    :key="node.value"
    :label="node.label"
    :value="node.value">
  </el-option>
</el-select>

<span 
    style="display: inline-block; width: 100%; height: 10%; padding-top: 5px; padding-left: 2%;" 
    v-if="showNums">
    当前监控节点数：{{ nodeCount }}
</span>

<ul class="ul-css" v-if="selectedFiles.length > 0">
    <li v-for="file in selectedFiles" :key="file.name">{{ file.name }}</li>
</ul>
<el-button 
    type="primary" 
    @click="uploadFiles" 
    v-if="selectedFiles.length > 0">
    检测
</el-button>
<el-button 
class="cancelButton"    
@click="cancelFiles" 
    v-if="selectedFiles.length > 0" >
    取消
</el-button>
<div class="search">
  <input type="file" ref="fileInput" @change="handleFileChange" accept=".pcap" multiple style="display: none;">
  <el-button type="primary" @click="triggerFileInput" v-if="showButton">上传pcap流量包</el-button>
  <el-button v-if="back" @click="backOff">返回</el-button>
  <el-button @click="refreshPage">更新</el-button>
  <div v-if="showInput" class="input-group-horizontal">
      <div class="input-group">
        <span class="input-label">合约名：</span>
        <el-input v-model="contractName"></el-input>
      </div>
      <div class="input-group">
        <span class="input-label">合约版本：</span>
        <el-input v-model="contractVersion"></el-input>
      </div>
      <el-button link type="primary" @click="emitSearch">搜索</el-button>
    </div>
  <el-button link type="primary" @click="isExpand = !isExpand">{{ isExpand ? '合并' : '' }}</el-button>
</div>
</div>
    <!----------底部---------------------->
    <div class="footer">
      <!-----------工具栏操作工具----------------->
      <div class="operator">
        <slot name="btn"></slot>
      </div>
      <!-- ------------表格--------------->
      <!-- ------------表格--------------->
      <div class="table">
  <el-table
    class="zb-table"
    v-loading="loading"
    @selection-change="(val) => emit('selection-change', val)"
    :data="list"
    :border="true"
  >
    <template v-for="item in columns">
      <!-- 处理链接类型的列 -->
      <el-table-column
        v-if="item.type === 'link'"
        :prop="item.name"
        :label="item.label"
        :width="item.width"
        :align="item.align ? item.align : 'center'"
        :fixed="item.fixed"
      >
        <template #default="scope">
          <a :href="scope.row[item.name]">{{ scope.row[item.name] }}</a>
        </template>
      </el-table-column>

      <!-- 处理ID列和sessionName列 -->
      <el-table-column
        v-else-if="item.name === 'id'"
        :prop="item.name"
        :label="item.label"
        :width="item.width"
        :align="item.align ? item.align : 'center'"
        :fixed="item.fixed"
      >
        <template #default="scope">
          <span 
            @click="handleCellClick(item.name, scope.row[item.name], scope.row)"
            style="font-weight: bold; color: blue; cursor: pointer;">
            {{ scope.row[item.name] }}
          </span>
        </template>
      </el-table-column>
      
      <el-table-column
    v-else-if="item.name === 'sessionId'"
    :prop="item.name"
    :label="item.label"
    :width="item.width"
    :align="item.align ? item.align : 'center'"
    :fixed="item.fixed"
  >
    <template #default="scope">
      <span 
        @click="handleCellClick(item.name, scope.row[item.name], scope.row)"
        style="font-weight: bold; color: green; cursor: pointer;">
        {{ scope.row[item.name] }}
      </span>
    </template>
  </el-table-column>

      <!-- 处理其他类型的列 -->
      <el-table-column
        v-else
        :prop="item.name"
        :label="item.label"
        :width="item.width"
        :align="item.align ? item.align : 'center'"
        :fixed="item.fixed"
      >
        <template #default="scope">
          <span>{{ scope.row[item.name] === null ? 'null' : scope.row[item.name] }}</span>
        </template>
      </el-table-column>
    </template>
  </el-table>
</div>


      <!-- ------------分页--------------->
      <div class="pagination">
        <el-pagination
          v-model:currentPage="currentPage1"
          :page-sizes="[20, 30, 40, 50, 100]"
          :page-size="pageSize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="props.data.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import  axios  from 'axios';
  import { computed, ref } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { FormInstance } from 'element-plus'
  const ruleFormRef = ref<FormInstance>()
  const emit = defineEmits(['files-uploaded','search','reset', 'onSubmit', 'selection-change', 'upload', 'triggerFileInput','handleSelectChange', 'handleCellClick','backOff'])
  const selectedValue = ref(null)
  const emitSearch = () => {
  emit('search', { contractName: contractName.value, contractVersion: contractVersion.value });
};
  let props = defineProps({
    columns: {
      type: Array<any>,
      default: () => [],
    },
    nodes:{
      type: Array<any>,
      default: () => [],
    }
    ,
    data: {
      type: Array<any>,
      default: () => [],
    },
    nodeCount:{
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    showButton:{
      type: Boolean,
      default: false,
    },
    showSuperVersion:{
      type: Boolean,
      default: false,
    },
    showNums:{
      type:Boolean,
      default:false,
    },
    showInput:{
      type:Boolean,
      default:false,
    },
    back:{
      type:Boolean,
      default:false,
    }
  })

  const selectedFiles = ref([]);
  const contractName = ref('');
  const contractVersion = ref('');
  const fileInput = ref(null)
  const currentPage1 = ref(1)
  // 收缩展开
  const isExpand = ref(false)
  // 每页显示几个数据
  const pageSize = ref(20)
  const uploadedFiles = ref([]);
  const showFileDialog = ref(false);

  const handleCellClick = (columnName, value, row) => {
    console.log("Clicked column:", columnName);
    console.log("Clicked value:", value);
    console.log("Clicked row:", row);

    if (columnName === 'id') {
        // ID列的点击处理
        emit('handleCellClick', columnName, value, row);
    } else if (columnName === 'sessionId') {
        // SessionID列的点击处理
        emit('handleCellClick', columnName, value, row);
    }
  }




const refreshPage = () =>{
  window.location.reload();
}
const backOff = () =>{
  // console.log('callback')
  emit('backOff')
}
const cancelFiles = () => {
    selectedFiles.value = [];
    fileInput.value.value = ''; // 清空文件输入的值
};


  const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`)
    pageSize.value = val
  }
  const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`)
    currentPage1.value = val
  }

  const list = computed(() => {
    let arr = JSON.parse(JSON.stringify(props.data))
    return arr.splice((currentPage1.value - 1) * pageSize.value, pageSize.value)
  })

  const listLoading = ref(false)
  const confirmEdit = (row) => {
    row.edit = false
  }
  const cancelEdit = (row) => {
    row.edit = false
  }

  import { reactive } from 'vue'

  let obj = {}
  let search = []
  for (let item of props.columns) {
    if (item.inSearch) {
      obj[item.name] = null
    }
    if (item.inSearch) {
      search.push(item)
    }
  }
  const formSearchData = ref(search)
  const formInline = reactive(obj)
  const handleSelectChange = (newValue) =>{
    console.log('Child component: selected value changed to:', newValue);
    emit('handleSelectChange',newValue)

  }
  const onSubmit = () => {
    console.log('submit!', formInline)
    emit('onSubmit', formInline)
  }
  const uploadFiles = () => {
    upload(selectedFiles.value); 
    emit('files-uploaded', selectedFiles.value.map(file => file.name));
    selectedFiles.value = []; 
    fileInput.value.value = ''; // 清空文件输入的值
};
  const upload = (files) => {  
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('file', files[i]);
  }
  
  axios.post('http://172.26.208.47:8080/uploadTrafficFile', formData)
    .then(response => {
      console.log('上传成功', response.data);
    })
    .catch(error => {
      console.error('上传失败', error);
    });
}
  const triggerFileInput = () => {
    fileInput.value.click(); 
  }
  const handleFileChange = (event) => {
    const files = event.target.files;
    selectedFiles.value = Array.from(files);
};



  const reset = (formEl: FormInstance | undefined) => {
    formSearchData.value.forEach((item) => {
      formInline[item.name] = null
    })
    emit('reset')
  }
</script>
<style scoped lang="scss">

.input-group-horizontal {
  display: flex;
  align-items: center;
  justify-content: start;
  position: absolute;
  top: 9.3%; /* 根据需要调整 */
  left: 3%; /* 根据需要调整 */
}

.input-group {
  margin-right: 15%; /* 在输入框之间添加间隔 */
}


.ul-css{
  position: relative;
}
.elformcss{
  opacity: 0;
}
.inputsearch{
  // display: none;
}
.cancelButton{
  margin-right: 2%;
}
  ul{
    margin-right: 5%;
    position: relative;
    top: -5px;
  }
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
  .zb-pro-table {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .header {
      display: flex;
      padding: 16px 16px 0 16px;
      margin-bottom: 16px;
      border-radius: 4px;
      background: white;
      box-shadow: 0 0 12px rgb(0 0 0 / 5%);
      .search-form {
        flex: 1;
        ::v-deep {
          .el-input--default {
            width: 200px;
          }
        }
      }
      .search {
        flex-shrink: 0;
        white-space: nowrap;
      }
    }
    .footer {
      flex: 1;
      display: flex;
      padding: 16px;
      flex-direction: column;
      border-radius: 4px;
      overflow: hidden;
      background: white;
      box-shadow: 0 0 12px rgb(0 0 0 / 5%);
      min-height: 300px;
      .operator {
        margin-bottom: 15px;
      }
      .table {
        position: relative;
        flex: 1;
      }
      .zb-table {
        position: absolute;
        height: 100%;
      }
    }
    ::v-deep {
      .el-table__header th {
        font-size: 15px;
        font-weight: 700;
        color: #252525;
      }
    }
    .pagination {
      width: 100%;
      display: flex;
      justify-content: center;
      padding-top: 20px;
      box-sizing: border-box;
    }
  }
</style>
