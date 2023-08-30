<template>
    <div class="m-code-editor">
      <div class="header">
        <el-card>
          <div>
            <span>smartfast合约检测台</span>
          </div>
        </el-card>
      </div>
      <div class="content">
        <div class="editor-container">
          <CodeMirror v-model="codeValue"/>
        </div>
        <div class="options-container">
          <el-card>
            <div>
              <span>solc版本</span>
              <el-select v-model="selectedVersion">
                <el-option v-for="version in solidityVersions" :key="version" :label="version" :value="version" />
              </el-select>
              <el-button @click="submitCode">提交</el-button>
            </div>
          </el-card>

            <pieChart/>
            <!-- 这里是数据展示区域，你可以根据需要添加内容 -->

        </div>
      </div>
      <div class="footer">
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  import CodeMirror from '@/components/CodeMirror/index.vue';
  import pieChart from '@/views/echarts/pieEcharts/index.vue';
  const selectedVersion = ref('');
  const codeValue = ref('');
  const solidityVersions = ['0.8.7', '0.7.6', '0.6.12']; // 示例Solidity版本列表
  
  const submitCode = () => {
    // 在这里处理提交代码的逻辑
    console.log(codeValue.value);
  };
  </script>
  
  <style lang="scss" scoped>
  .m-code-editor {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  
    & .header {
      flex-shrink: 0;
    }
  
    & .content {
      display: flex;
      flex-grow: 1;
    }
  
    & .editor-container,
    & .options-container {
      flex: 1;
      padding: 10px;
      box-sizing: border-box;
    }
  
    & .footer {
      flex-shrink: 0;
    }
  }
  </style>
  