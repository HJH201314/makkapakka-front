<script setup lang="ts">
import UserInfo from '@/pages/user/components/UserInfo.vue';
import LiveCard from '@/pages/live/components/LiveCard.vue';
import { LeftOutlined } from '@ant-design/icons-vue';
import { useUserStore } from '@/stores/useUserStore';
import { useIntersectionObserver } from '@vueuse/core';
import Appointment from '@/pages/live/components/appointment.vue';

definePage({
  path: '/user/home',
  name: '用户 - 直播页',
});

// 观测页面顶部是否移出
const realPageTopRef = ref();
useIntersectionObserver(realPageTopRef, ([{ isIntersecting }]) => {
  if (!isIntersecting) {
    // ignore
  }
});

const userStore = useUserStore();
const uid = userStore.userInfo.id;
const fans = ref(111);
const likes = ref(333);
const time = ref('1h');
const name = ref('啊啊啊');
const avatar = ref('https://img2.imgtp.com/2024/04/11/it1yVDsC.jpg');
const coverURL = ref('https://img2.imgtp.com/2024/04/11/Qer8kHaD.jpg');
const date = ref(new Date(2024, 4, 20, 12, 0, 0, 0));
const appointed = ref(true);
const isMyself = ref(false);
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
      <div class="back-icon">
        <LeftOutlined style="color: white" />
      </div>
    </div>
    <div class="real-page">
      <div
        ref="realPageTopRef"
        style="margin-top: 10rem; box-shadow: 0 -5px 20px 10px rgba(0, 0, 0, 0.23)"
      ></div>
      <UserInfo
        :is-myself="isMyself"
        :avatar="userStore.userInfo.avatarUrl || avatar"
        v-model:fans="fans"
        v-model:likes="likes"
        v-model:time="time"
        :name="userStore.userInfo.name || name"
        :desc="userStore.userInfo.description || '啊哦，这个直播间还没有介绍 TAT'"
        :followed="false"
      />
      <div class="white-area">
        <div class="living">
          <Appointment
            v-if="appointed"
            :is-myself="isMyself"
            :title="name"
            :date="date"
            :num="111"
            v-model:appointed="appointed"
          />
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
    top: 2rem;
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
