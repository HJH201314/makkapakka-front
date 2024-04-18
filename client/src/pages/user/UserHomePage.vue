<script setup lang="ts">
import UserInfo from '@/pages/user/components/UserInfo.vue';
import LiveCard from '@/pages/live/components/LiveCard.vue';
import {LeftOutlined} from '@ant-design/icons-vue';
import {useUserStore} from '@/stores/useUserStore';
import {useIntersectionObserver} from '@vueuse/core';
import Appointment from '@/pages/live/components/appointment.vue';

definePage({
  path: '/user/home',
  name: '用户 - 直播页',
});

// 观测页面顶部是否移出
const realPageTopRef = ref();
useIntersectionObserver(realPageTopRef, ([{ isIntersecting }]) => {
  if (!isIntersecting) {

  }
});

const userStore = useUserStore();

let fans = ref(111);
let follow = ref(222);
let likes = ref(333);
let time = ref('1h');
let name = ref('啊啊啊');
let avatar = ref('https://img2.imgtp.com/2024/04/11/it1yVDsC.jpg');
let coverURL = ref('https://img2.imgtp.com/2024/04/11/Qer8kHaD.jpg');
let date = ref(new Date(2024, 4, 20, 12, 0, 0, 0));
</script>

<template>
  <div class="user-page">
    <!--    用户信息，包含：头像、粉丝数据、关注按钮、用户名、简介-->
    <img
      style="position: absolute; width: 100vw; z-index: -1"
      src="https://img2.imgtp.com/2024/04/11/nmd5j2r5.jpg"
      class="test"
      alt=""
    />
    <div class="toolbar">
      <!-- 返回按钮 -->
      <div class="back-icon"><LeftOutlined style="color: white;" /></div>
    </div>
    <div class="real-page">
      <div
        ref="realPageTopRef"
        style="margin-top: 10rem; box-shadow: 0 -5px 20px 10px rgba(0, 0, 0, 0.23)"
      ></div>
      <UserInfo
        :is-myself="true"
        :avatar="userStore.userInfo.avatarUrl || avatar"
        v-model:fans="fans"
        v-model:follow="follow"
        v-model:likes="likes"
        v-model:time="time"
        :name="userStore.userInfo.name || name"
        :desc="userStore.userInfo.description || '我个人认为这个意大利面就应该拌42号混凝土。'"
        :followed="false"
      />
      <div class="white-area">
        <div class="living">
          <LiveCard
            :avatar="userStore.userInfo.avatarUrl || avatar"
            :name="userStore.userInfo.name || name"
            :coverURL="coverURL"
            title="嘿嘿嘿"
          />
        </div>
        <div class="living">
          <LiveCard
            :avatar="userStore.userInfo.avatarUrl || avatar"
            :name="userStore.userInfo.name || name"
            :coverURL="coverURL"
            title="嘿嘿嘿"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/main';

.user-page {
  display: flex;
  flex: 1;
  height: 100vh;
  width: 100vw;
  position: relative;
  flex-direction: column;

  .toolbar {
    z-index: 10;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 1rem;
    display: flex;

    .back-icon {
      height: 2rem;
      width: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.23);
    }
  }

  .real-page {
    overflow: auto;

    .white-area {
      background: white;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }
}

</style>
