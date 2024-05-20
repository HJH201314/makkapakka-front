<template>
  <div class="outer">
    <div class="header">
      <span>发布直播预约</span>
    </div>
    <div class="main">
      <div class="time">
        <div class="left">
          <span>时间</span>
        </div>
        <div class="right">
          <!--          todo 日期、时间选择器-->
          <input type="datetime-local" v-model="time" />
        </div>
      </div>
      <div class="title">
        <div class="left">
          <span>标题</span>
        </div>
        <div class="right">
          <input type="text" placeholder="请填写标题" v-model="title" />
        </div>
      </div>
    </div>
    <div class="footer">
      <button class="button" @click="sendPost">发布预约</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const rid = ref(''); // 直播间id
const uid = ref(''); // 用户id
const time = ref(''); // 预约时间 "2023-5-10 10:10"
const title = ref(''); // 预约标题

// 发布预约
const sendPost = () => {
  console.log(title.value);
};
</script>

<style scoped lang="scss">
@import '@/assets/main';

.outer {
  width: w(375px);
  position: fixed;
  bottom: 0;
  //background-color: #f2f3f5;
  z-index: 999;

  .header {
    border-radius: 1rem 1rem 0 0;
    background-color: #ffffff;
    text-align: center;
    border-bottom: 1px solid #f2f3f5;
    font-size: 1.1rem;
    padding: 0.8rem;
  }

  .main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    width: 100%;

    .time {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 3rem;
      border-bottom: 1px solid #f2f3f5;

      .left {
        font-size: 0.8rem;
        padding: 0 1.5rem;
      }

      .right {
        width: 75%;
        padding: 0 1.5rem 0 0;

        input {
          width: 100%;
          height: 1.5rem;
          border-radius: 0.4rem;
          border: none;
          padding: 0.2rem;
        }
      }
    }

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 3rem;

      .left {
        font-size: 0.8rem;
        padding: 0 1.5rem;
      }

      .right {
        width: 75%;
        padding: 0 1.5rem 0 0;

        input {
          width: 100%;
          height: 1.5rem;
          border-radius: 0.4rem;
          padding: 0.2rem;
          font-size: 0.8rem;
          border: none;
        }
      }
    }
  }

  .footer {
    justify-content: center;
    align-content: center;
    align-items: center;
    display: flex;
    width: 100%;
    height: 6rem;
    background-color: #f2f3f5;

    .button {
      width: 90%;
      height: 2.5rem;
      border-radius: 0.4rem;
      background-color: $color-primary;
      color: #ffffff;
      border: none;
    }
  }
}
</style>
