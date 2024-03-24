<script setup lang="ts">
import { Form } from 'ant-design-vue';
import AlignCenterLayout from '@/layouts/AlignCenterLayout.vue';
import CusSpinning from '@/components/cus-ui/spinning/CusSpinning.vue';
import variables from '@/assets/variables.module.scss';
import CusInput from '@/components/cus-ui/input/CusInput.vue';
import CusToggle from '@/components/cus-ui/toggle/CusToggle.vue';
import CusButton from '@/components/cus-ui/button/CusButton.vue';
import CusSpace from '@/components/cus-ui/space/CusSpace.vue';

definePage({
  path: '/admin/login',
  name: '管理后台 - 登录',
});

const useForm = Form.useForm;
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
const form = useForm(formState);

function handleFormFinish(values: any) {
  console.log(form.validateInfos);
}
</script>

<template>
  <align-center-layout class="admin-login-page">
    <a-card class="card">
      <h1>登录</h1>
      <cus-space>
        <cus-input placeholder="邮箱" />
        <cus-input placeholder="密码" type="password" />
        <cus-toggle label="记住我" />
        <cus-button :button-style="{ width: '100%' }" type="primary" text="登录" />
      </cus-space>
    </a-card>
  </align-center-layout>
</template>

<style scoped lang="scss">
@import "@/assets/main";
.admin-login-page {
  background-color: lighten($color-primary, 20%);
}
.card {
  width: 375px;
  max-width: 100%;
  margin-inline: 2rem;
}
</style>