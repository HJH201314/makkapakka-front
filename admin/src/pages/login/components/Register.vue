<template>
  <t-form
    ref="form"
    :class="['item-container', `register-${type}`]"
    :data="formData"
    :rules="FORM_RULES"
    label-width="0"
    @submit="onSubmit"
  >
    <t-form-item name="email">
      <t-input v-model="formData.email" type="text" size="large" placeholder="请输入您的邮箱">
        <template #prefix-icon>
          <t-icon name="mail" />
        </template>
      </t-input>
    </t-form-item>

    <t-form-item name="password">
      <t-input
        v-model="formData.password"
        size="large"
        :type="showPsw ? 'text' : 'password'"
        clearable
        placeholder="请输入登录密码"
      >
        <template #prefix-icon>
          <t-icon name="lock-on" />
        </template>
        <template #suffix-icon>
          <t-icon :name="showPsw ? 'browse' : 'browse-off'" @click="showPsw = !showPsw" />
        </template>
      </t-input>
    </t-form-item>

    <template>
      <t-form-item class="verification-code" name="verifyCode">
        <t-input v-model="formData.verifyCode" size="large" placeholder="请输入验证码" />
        <t-button variant="outline" :disabled="countDown > 0" @click="handleCounter">
          {{ countDown == 0 ? '发送验证码' : `${countDown}秒后可重发` }}
        </t-button>
      </t-form-item>
    </template>

    <t-form-item class="check-container" name="checked">
      <t-checkbox v-model="formData.checked">我已阅读并同意 </t-checkbox> <span>Makka 服务协议</span> 和
      <span>Pakka 隐私声明</span>
    </t-form-item>

    <t-form-item>
      <t-button block size="large" type="submit"> 注册 </t-button>
    </t-form-item>

  </t-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MessagePlugin, FormRule } from 'tdesign-vue-next';
import { useCounter } from '@/hooks';

const INITIAL_DATA = {
  email: '',
  password: '',
  verifyCode: '',
  checked: false,
};

const FORM_RULES: Record<string, FormRule[]> = {
  email: [
    { required: true, message: '邮箱必填', type: 'error' },
    { email: true, message: '请输入正确的邮箱', type: 'warning' },
  ],
  password: [{ required: true, message: '密码必填', type: 'error' }],
  verifyCode: [{ required: true, message: '验证码必填', type: 'error' }],
};

const type = ref('phone');

const form = ref();
const formData = ref({ ...INITIAL_DATA });

const showPsw = ref(false);

const [countDown, handleCounter] = useCounter();

const emit = defineEmits(['registerSuccess']);

const onSubmit = ({ validateResult }) => {
  if (validateResult === true) {
    if (!formData.value.checked) {
      MessagePlugin.error('请同意 MakkaPakka 服务协议和 MakkaPakka 隐私声明');
      return;
    }
    MessagePlugin.success('注册成功');
    emit('registerSuccess');
  }
};

const switchType = (val) => {
  form.value.reset();
  type.value = val;
};
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>
