<script setup lang="ts">
import UserInfo from '@/pages/user/components/UserInfo.vue';

definePage({
  path: '/user/home',
  name: '用户 - 直播页',
});

let fans = ref(111);
</script>

<template>
  <div class="user-page">
    <!--    用户信息，包含：头像、粉丝数据、关注按钮、用户名、简介-->
    <img src="@/assets/img/cat.jpeg" class="test" alt="" />
    <UserInfo
      avatar="aaa"
      v-model:fans="fans"
      :follow="123"
      :likes="321"
      name="啊啊啊"
      desc="我个人认为这个意大利面就应该拌42号混凝土。"
      :followed="false"
    />
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
</style>
