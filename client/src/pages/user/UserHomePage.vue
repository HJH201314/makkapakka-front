<script setup lang="ts">
import UserInfo from '@/pages/user/components/UserInfo.vue';
import LiveCard from '@/pages/live/components/LiveCard.vue';

definePage({
  path: '/user/home',
  name: '用户 - 直播页',
});

let fans = ref(111);
let follow = ref(222);
let likes = ref(333);
let name = ref('啊啊啊');
let avatar = ref('https://img2.imgtp.com/2024/04/11/it1yVDsC.jpg');
let coverURL = ref('https://img2.imgtp.com/2024/04/11/Qer8kHaD.jpg');
</script>

<template>
  <div class="user-page">
    <!--    用户信息，包含：头像、粉丝数据、关注按钮、用户名、简介-->
    <!--    todo: 头图高度适应，改成组件-->
    <img src="https://img2.imgtp.com/2024/04/11/nmd5j2r5.jpg" class="test" alt="" />
    <UserInfo
      :avatar="avatar"
      v-model:fans="fans"
      v-model:follow="follow"
      v-model:likes="likes"
      :name="name"
      desc="我个人认为这个意大利面就应该拌42号混凝土。"
      :followed="false"
    />
    <div class="living">
      <LiveCard :avatar="avatar" :name="name" :coverURL="coverURL" title="嘿嘿嘿" />
    </div>
    <div class="living">
      <LiveCard :avatar="avatar" :name="name" :coverURL="coverURL" title="嘿嘿嘿" />
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
