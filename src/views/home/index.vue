<template>
  <div class="home-container">
    <el-row class="row-bg" :gutter="10">
      <el-col :xs="24" :sm="12" :lg="8">
        <el-card class="box-card" style="height: 100%">
          <!-- <el-image
              class="wechat"
              :src="weLogo"
              :preview-src-list="[weLogo]"
              style="max-width: 200px"
              :data-resid="Date.now()"
          /> -->
          <div class="personal">
            <div>
              <!-- <el-avatar :size="50" :src="AvatarLogo" /> -->
            </div>
            <div class="name"></div>
            <div class="description"></div>
            <div class="list">
              <div>合约撰写是要求合约编程者在编程时避免已有的漏洞，防止合约在后续执行中出现问题。但是，不是所有人都可以百分之百确定自己的合约不存在漏洞。所以这就要求合约在部署前需要进行审计，该平台就是提供对合约审计的服务，通过大量有关智能合约漏洞和审计的文字描述、代码和图片，为人们普及相应的知识。同时该平台还使用了SmartCheck和Securify审计方法，更加形象、生动、准确地为人们讲解合约审计方法和提供审计服务。

该平台就像是人们和智能合约审计的接口，人们可以通过该平台学习到许多有关智能合约漏洞和其安全审计的知识。从而让更多的人了解如何撰写一个更加完整、安全的智能合约，以减小由于合约存在漏洞导致用户隐私泄露或相关利益受损的风险。该平台基于不同的引擎（SmartFast、SmartCheck、Securify和TODChecker）对Solidity语言的智能合约进行审计，并且可以完成对审计时间的计算、合约审计结果的代码表示、审计报告的自动生成。为了增强人们的体验度，该平台通过界面渲染，一步步把审计的相关信息直观地显示出来，并且将合约审计的时间数据利用echarts进行绘图分析，从而分析不同审计方法的性能。
</div>
            </div>
            <!-- <el-divider></el-divider> -->
            <!-- <div style="margin-bottom: 15px"><h5>个性标签</h5></div> -->
            <!-- <div>
              <el-tag style="margin-right: 10px">怕麻烦</el-tag>
            </div> -->
            <!-- <el-divider></el-divider>
            <div style="margin-bottom: 15px"><h5>最喜欢的一句话</h5></div>
            <div>---------- 开心最重要</div>
            <el-divider></el-divider>
            <div style="margin-bottom: 15px"
            ><h5>如果对你有帮助的话，可以麻烦点一颗 Star、Fork、Watch! 你的鼓励是我继续优化的动力~~</h5></div
            > -->
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="16">
        <el-row class="custom" :gutter="10">
          <el-col :xs="24" :sm="12" :lg="8">
            <el-card style="margin-bottom: 10px">
              <div class="grid-content">
                <div class="left"
                ><el-icon style="font-size: 24px; color: white"><user /></el-icon
                ></div>
                <div class="right">
                  <div
                      class="h2"
                      style="color: #2d8cf0"
                  ><count-to
                      :start-val="0"
                      :end-val="5268"
                      :duration="2000"
                      :autoplay="true"
                  ></count-to
                  ></div>
                  <div>低风险漏洞</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-card style="margin-bottom: 10px">
              <div class="grid-content">
                <div class="left" style="background: #64d572"
                ><el-icon style="font-size: 24px; color: white"><user /></el-icon
                ></div>
                <div class="right">
                  <div
                      class="h2"
                      style="color: #64d572"
                  ><count-to
                      :start-val="0"
                      :end-val="9599"
                      :duration="2000"
                      :autoplay="true"
                  ></count-to
                  ></div>
                  <div>中风险漏洞 </div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-card style="margin-bottom: 10px">
              <div class="grid-content">
                <div class="left" style="background: #f25e43"
                ><el-icon style="font-size: 24px; color: white"><user /></el-icon
                ></div>
                <div class="right">
                  <div
                      class="h2"
                      style="color: #f25e43"
                  ><count-to
                      :start-val="0"
                      :end-val="595453"
                      :duration="2000"
                      :autoplay="true"
                  ></count-to
                  ></div>
                  <div>高风险漏洞 </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>工具系列</span>
            </div>
          </template>
          <div style="display: flex">
            <el-card
                style="flex: 1; margin-right: 20px; cursor: pointer"
                class="card-item"
                @click="goTo('https://ext.dcloud.net.cn/plugin?id=7511')"
            >
              <div style="color: white; margin-bottom: 10px"><h3>SmartFast</h3></div>
              <div style="font-size: 12px; color: white"
              >uniapp 表格组件
                支持固定表头和首列、上拉加载更多、及固定多列，表格自适应内容，排序，多选checkbox、可点击删除，编辑、合计功能，兼容多端</div
              >
            </el-card>
            <el-card
                style="flex: 1; cursor: pointer"
                class="card-item"
                @click="goTo('https://github.com/zouzhibin/vue-admin-perfect')"
            >
              <div style="color: white; margin-bottom: 10px"><h3>SecurityCheck</h3></div>
              <div style="font-size: 12px; color: white"
              >系统基于vue3+vuex+ element-plus+ts后台管理系统</div
              >
            </el-card>
          </div>
        </el-card>
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>本周合约检测量</span>
            </div>
          </template>
          <div>
            <bar-charts height="300px" width="100%" id="bar1"></bar-charts>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
  import { User } from '@element-plus/icons-vue'
  import { ref } from 'vue'
  import AvatarLogo from '@/assets/image/avatar.png'
  import weLogo from '@/assets/image/we.png'
  import CountTo from '@/components/CountTo/index.vue'
  import BarCharts from '@/views/echarts/simple/components/bar.vue'
  

  const goTo = (url) => {
    window.open(url, '_blank')
  }
</script>

<style scoped lang="scss">
@import "./index";
</style>
