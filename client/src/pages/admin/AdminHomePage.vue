<script setup lang="ts">
import AlignCenterLayout from '@/layouts/AlignCenterLayout.vue';

definePage({
  path: '/admin/home',
  alias: ['/admin'],
  name: '管理 - 仪表盘',
  meta: {
    menuTitle: '仪表盘',
    menuIcon: 'ip-home',
    showInMenu: true,
  },
});
</script>

<template>
  <align-center-layout>MakkaPakka管理后台首页</align-center-layout>
</template>

<style scoped></style>
