<template>
    <div class="m-code-editor">
      <div class="header">
        <el-card>
          <div class="container">
            <span><b>安全协议分析台</b></span>
            <el-input placeholder="请输入协议名" v-model="protocolName" style="margin-left: auto; width: 500px;"></el-input>
            <el-button @click="startDetection">开始检测</el-button>
          </div>
        </el-card>
      </div>
      <!-- 其他内容 -->
      <div class="content">
      <div class="editor-container">
        <CodeMirror v-model="codeValue"/>
      </div>
      <div class="options-container">
      </div>
    </div>
      <el-dialog title="" v-model="dialogVisible" :style="{ width: '80%' }">
        <div>
          <h3>检测结果</h3>
          <p>协议名：{{ responseData.protocol }}</p>
          <p>errorcount：<span class="error-count">{{ responseData.errorCount }}</span></p>
          <p class="text-pre-wrap">verification result：{{ responseData.summary }}</p>
        </div>
        <div>
          <h3>Claim</h3>
          <el-table :data="responseData.claims" style="width: 100%">
            <el-table-column prop="protocolName" label="Protocol" width="180"></el-table-column>
            <el-table-column prop="role" label="Role" width="100"></el-table-column>
            <el-table-column prop="claimDetails" label="Claim Details"></el-table-column>
            <el-table-column prop="status" label="Status" width="120" :formatter="formatStatus"></el-table-column>
            <el-table-column prop="remark" label="Remark"></el-table-column>
            <el-table-column label="Attack" width="160">
              <template #default="scope">
                <el-button v-if="scope.row.attacks && scope.row.attacks.length > 0" type="text" @click="openAttackImage(scope.row.attacks[0].fileName)">View Attack</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
    </div>
</template>
  
  
  <script lang="ts" setup>
  // import { ref } from 'vue';
  import CodeMirror from '@/components/CodeMirror/index.vue';
  import {ref,onMounted} from "vue";
  import axios from 'axios';

const protocolName = ref('');
const errorCount = ref(0);
const verificationResult = ref('');
const dialogVisible = ref(true); // 初始设为 true 以便查看样式
const responseData = ref({
  summary: "Verification results:\nclaim id [wmf-Lowe,I1], Secret(Kir): No attacks within bounds.\nclaim id [wmf-Lowe,I2], Nisynch: At least 1 attack.\nclaim id [wmf-Lowe,R1], Secret(Kir): No attacks within bounds.\nclaim id [wmf-Lowe,R2], Nisynch: At least 1 attack.\n",
  figs: [
    {
      figName: "scyther_zeJMRE.png",
      figBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA..."
    }
  ],
  protocol: "wmf-lowe.spdl",
  claims: [
    {
      claimDetails: "Secret Kir",
      attackNumber: 0,
      role: "I",
      getVerified: "null",
      protocolName: "wmf-Lowe",
      attacks: [],
      statement: "I",
      remark: "No attacks within bounds.",
      claimId: "wmf-Lowe,I1",
      status: true
    },
    {
      claimDetails: "Nisynch",
      attackNumber: 1,
      role: "I",
      getVerified: "Falsified",
      protocolName: "wmf-Lowe",
      attacks: [
        {
          fileName: "scyther_5v3jsk.png",
          figureTitle: "Attack for claim wmf-Lowe,I2",
          figureType: "png",
          statement: "attack"
        },
        {
          fileName: "scyther_zeJMRE.png",
          figureTitle: "Attack for claim wmf-Lowe,I2",
          figureType: "png",
          statement: "attack"
        }
      ],
      statement: "I",
      remark: "At least 1 attack.",
      claimId: "wmf-Lowe,I2",
      status: false
    },
    {
      claimDetails: "Secret Kir",
      attackNumber: 0,
      role: "R",
      getVerified: "null",
      protocolName: "wmf-Lowe",
      attacks: [],
      statement: "R",
      remark: "No attacks within bounds.",
      claimId: "wmf-Lowe,R1",
      status: true
    },
    {
      claimDetails: "Nisynch",
      attackNumber: 1,
      role: "R",
      getVerified: "Falsified",
      protocolName: "wmf-Lowe",
      attacks: [
        {
          fileName: "scyther_iH8wUF.png",
          figureTitle: "Attack for claim wmf-Lowe,R2",
          figureType: "png",
          statement: "attack"
        },
        {
          fileName: "scyther_XaD2rf.png",
          figureTitle: "Attack for claim wmf-Lowe,R2",
          figureType: "png",
          statement: "attack"
        }
      ],
      statement: "R",
      remark: "At least 1 attack.",
      claimId: "wmf-Lowe,R2",
      status: false
    }
  ],
  errorCount: 2,
  timestamp: "2023-12-08 14:17:35"
});





const startDetection = async () => {
  dialogVisible.value = true;

};

const getStatusColor = (status) => {
  return status ? 'green' : 'red';
};
const openAttackImage = (fileName) => {
  // 模拟打开图片链接的操作
  alert(`Open image: ${fileName}`);
};
const mergeProtocolCells = ({ row, column, rowIndex, columnIndex }) => {
//   if (columnIndex === 0) { 
//     if (rowIndex !== 0) {
//       if (responseData.claims[rowIndex].protocolName === responseData.claims[rowIndex - 1].protocolName) {
//         return [0, 0]; 
//       } else {
//         let rowspan = 1;
//         for (let i = rowIndex + 1; i < responseData.claims.length; i++) {
//           if (responseData.claims[i].protocolName === row.protocolName) {
//             rowspan++;
//           } else {
//             break;
//           }
//         }
//         return [rowspan, 1]; 
//       }
//     }
//   }
};
  
  onMounted(() => {
  })
  
</script>
  
  
  
  
  
  
  <!--样式-->
  <style lang="scss" scoped>
     .content {
    display: flex;
    flex-grow: 1;
  }
  .text-pre-wrap {
  white-space: pre-wrap;
}
.container {
    display: flex; /* 设置水平布局 */
    align-items: center; /* 垂直居中 */
}
.error-count {
  font-weight: bold;
  color: red;
}
.container > * {
    margin-right: 10px; /* 添加右边距，防止元素紧挨在一起 */
}

.container el-input {
    width: 0px; /* 设置输入框的宽度，可根据需要调整 */
}

  //顶部总样式
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
  
    & .editor-container{
      width: 100%;
    }
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
  