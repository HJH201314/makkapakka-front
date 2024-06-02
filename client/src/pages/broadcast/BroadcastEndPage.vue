<template>
  <div class="outer">
    <div class="header">
      <span>{{ params.title }}</span>
    </div>
    <div class="main">
      <div class="time">
        <span>{{ params.duration }}</span>
      </div>
      <span>直播时长</span>
    </div>
    <div class="footer">
      <span>直播已结束</span>
      <div class="button" @click="goBack">
        <Return class="rollbcak-icon"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Return } from '@icon-park/vue-next';
import { useUrlSearchParams } from '@vueuse/core';
import { AndroidUtil } from '@/utils/android.util';

definePage({
  name: '直播结束',
  path: '/broadcast/end',
});

const params = useUrlSearchParams('history', {
  initialValue: {
    title: '',
    duration: '0',
  },
});

// 返回上一页
function goBack() {
  AndroidUtil.quit();
}
</script>

<style scoped lang="scss">
@import '@/assets/main';

.outer {
  width: w(375px);
  height: 100vh;
  background-color: $color-black-lighter;
  color: white;

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    padding-top: 12rem;
  }

  .main {
    padding-top: 7rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .time {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 3rem;
      font-size: 3rem;
      font-weight: bold;
      color: $color-primary;
    }
  }

  .footer {
    padding-top: 12rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    .button {
      background-color: #fff;
      width: 5rem;
      height: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;

      .rollbcak-icon {
        font-size: 2.33rem;
        color: $color-black-lighter;
      }
    }
  }
}
</style>
