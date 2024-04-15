<script setup lang="ts">
import UserInfo from '@/pages/user/components/UserInfo.vue';
import Living from '@/pages/live/components/living.vue';
import img from '@/assets/img/cat.jpeg';

definePage({
  path: '/user/home',
  name: '用户 - 直播页',
});

let fans = ref(111);
</script>

<template>
  <div class="user-page">
    <!--    用户信息，包含：头像、粉丝数据、关注按钮、用户名、简介-->
    <img src="https://img2.imgtp.com/2024/04/11/nmd5j2r5.jpg" class="test" alt="" />
    <UserInfo
      avatar="https://img2.imgtp.com/2024/04/11/it1yVDsC.jpg"
      v-model:fans="fans"
      :follow="123"
      :likes="321"
      name="啊啊啊"
      desc="我个人认为这个意大利面就应该拌42号混凝土。"
      :followed="false"
    />
    <div class="living">
      <Living
        cover-url="https://img2.imgtp.com/2024/04/11/ELHC6vk4.jpg"
        video-url="https://www.bilibili.com/video/BV1cm42177xT/?spm_id_from=333.1007.tianma.1-3-3.click"
      />
    </div>
    <div class="living">
      <Living cover-url="https://img2.imgtp.com/2024/04/11/Qer8kHaD.jpg" :is-live="false" />
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
}

.living {
  margin-top: 1rem;
}
</style>
