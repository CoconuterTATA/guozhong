<template>
    <div class="m-code-editor">
      <div class="header">
        <el-card>
          <div class="analysiscontainer">
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
        <div class="detection-result">
          <h3>检测结果</h3>
          <p>协议名：{{ responseData.protocol }}</p>
          <p>errorcount：<span class="error-count">{{ responseData.errorCount }}</span></p>
          <p class="text-pre-wrap">verification result：{{ responseData.summary }}</p>
        </div>
        <div class="claim-section">
          <h3>Claim</h3>
          <el-table :data="responseData.claims" style="width: 100%" :span-method="mergeProtocolCells">
  <el-table-column prop="protocolName" label="Protocol" width="180"></el-table-column>
  <el-table-column prop="role" label="Role" width="100"></el-table-column>
  <el-table-column prop="claimDetails" label="Claim Details"></el-table-column>
  <el-table-column prop="status" label="Status" width="120" :formatter="formatStatus"></el-table-column>
  <el-table-column prop="remark" label="Remark"></el-table-column>
  <el-table-column label="Attack" width="160">
    <template #default="scope">
      <el-button 
        v-if="!scope.row.status" 
        type="text" 
        @click="openAttackImage(findFigForClaim(scope.row, responseData.figs))"
      >
        View Attack
      </el-button>
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
const codeValue = ref('');
const errorCount = ref(0);
const verificationResult = ref('');
const dialogVisible = ref(false); // 初始设为 true 以便查看样式
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



const mergeProtocolCells = ({ row, column, rowIndex }) => {
  if (column.property === 'protocolName') {
    if (rowIndex > 0 && responseData.value.claims[rowIndex].protocolName === responseData.value.claims[rowIndex - 1].protocolName) {
      return [0, 0];
    }
    let rowspan = 1;
    for (let i = rowIndex + 1; i < responseData.value.claims.length; i++) {
      if (responseData.value.claims[i].protocolName === row.protocolName) {
        rowspan++;
      } else {
        break;
      }
    }
    return [rowspan, 1];
  }
  return [1, 1]; 
};


const startDetection = async () => {
  try {
    const formData = new FormData();
    formData.append('protocolName', protocolName.value);
    formData.append('protocolCode', codeValue.value); 
    const response = await axios.post('http://172.26.208.47:8080/protocolAnalysis', formData, {
      headers: {
        'Content-Type': 'multipart/form-data' 
      }
    });
    console.log(response.data)
    responseData.value = response.data;
    dialogVisible.value = true;
  } catch (error) {
    console.error('Error message:', error);
  }
};

const findFigForClaim = (claim, figs) => {
  if (!claim.status) {
    const unassignedFig = figs.find(fig => !fig.assigned);
    if (unassignedFig) {
      unassignedFig.assigned = true;
      return unassignedFig.figBase64;
    }
  }
  return null;
};


const findFigBase64 = (fileName) => {
  console.log('Looking for image:', fileName); 
  const fig = responseData.value.figs.find(f => f.figName === fileName);
  if (fig) {
    console.log('Found image:', fig.figBase64); 
    return fig.figBase64;
  } else {
    console.log('Image not found for:', fileName); 
    return null;
  }
};


const getStatusColor = (status) => {
  return status ? 'green' : 'red';
};
const openAttackImage = (figBase64) => {
  console.log('Opening image with data:', figBase64); // 用于调试
  const imageWindow = window.open();
  imageWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Attack Image</title>
    </head>
    <body>
      <img src="${figBase64}" alt="Attack Image" />
    </body>
    </html>
  `);
};


  
  onMounted(() => {
  })
  
</script>
  
  
  
  
  
  

  <style lang="scss" scoped>

.detection-result, .claim-section {
  border: 1px solid lightblue;
  padding: 10px;
  margin-bottom: 10px;
}
.detection-result {
  margin-bottom: 20px; 
}

.content {
    display: flex;
    flex-grow: 1;
  }
.text-pre-wrap {
  white-space: pre-wrap;
}
.analysiscontainer {
    display: flex; 
    align-items: center; 
}
.error-count {
  font-weight: bold;
  color: red;
}
.analysiscontainer > * {
    margin-right: 10px; 
}




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
  