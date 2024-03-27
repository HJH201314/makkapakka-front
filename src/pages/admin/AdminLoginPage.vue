<script setup lang="ts">
import AlignCenterLayout from '@/layouts/AlignCenterLayout.vue';
import CusInput from '@/components/cus-ui/input/CusInput.vue';
import CusToggle from '@/components/cus-ui/toggle/CusToggle.vue';
import CusButton from '@/components/cus-ui/button/CusButton.vue';
import CusSpace from '@/components/cus-ui/space/CusSpace.vue';
import CusCard from '@/components/cus-ui/card/CusCard.vue';
import { DialogManager } from '@/components/cus-ui/dialog';
import ToastManager from '@/components/cus-ui/toast/ToastManager';

definePage({
  path: '/admin/login',
  name: '管理后台 - 登录',
});

interface FormState {
  email: string;
  password: string;
  remember: boolean;
}
const formState = reactive<FormState>({
  email: '',
  password: '',
  remember: false,
});

function handleSubmit() {
  DialogManager.commonDialog({
    title: '1'
  });
  ToastManager.normal('hello');
}
</script>

<template>
  <align-center-layout class="admin-login-page">
    <div class="logo-text">MakkaPakka</div>
    <cus-card class="card">
      <h1>登录</h1>
      <cus-space direction="vertical">
        <cus-input placeholder="邮箱" />
        <cus-input placeholder="密码" type="password" />
        <cus-toggle label="记住我" />
        <cus-button @click="handleSubmit" :button-style="{ width: '100%' }" type="primary" text="登录" />
      </cus-space>
    </cus-card>
  </align-center-layout>
</template>

<style scoped lang="scss">
@import "@/assets/main";
.admin-login-page {
  background: linear-gradient(to right bottom, $color-makka-300, $color-makka-100);
  //background-color: $color-primary-lighter;
}
.card {
  width: 375px;
  max-width: 100%;
  margin-inline: 2rem;
  animation: {
    name: show-right;
    duration: 1s;
    fill-mode: both;
  };
  @keyframes show-right {
    0% { transform: translateX(100%); }
    40% { transform: translateX(-10%); }
    100% { transform: translateX(0); }
  }
}
.logo-text {
  color: white;
  font: {
    size: 54px;
    weight: bold;
    family: Tahoma;
  }
  text-align: center;
  margin-bottom: 16px;
  animation: show-left 1s;
  text-shadow: 5px 5px 15px $color-primary-darker;
  @keyframes show-left {
    0% { transform: translateX(-100%); }
    40% { transform: translateX(10%); }
    100% { transform: translateX(0); }
  }
}
</style>