<template>
  <div>
    <!-- 顶部 card  -->
    <top-panel class="row-container" />
    <!-- 中部图表  -->
    <middle-chart class="row-container" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'DashboardLive',
};
</script>

<script setup lang="ts">
import TopPanel from './components/TopPanel.vue';
import MiddleChart from './components/MiddleChart.vue';
import RankList from './components/RankList.vue';
</script>

<style scoped>
.row-container:not(:last-child) {
  margin-bottom: 16px;
}
:deep() .t-card__body {
  padding-top: 0;
}
</style>
