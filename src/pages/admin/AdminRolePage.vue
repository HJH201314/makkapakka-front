<script setup lang="ts">
import CusCard from '@/components/cus-ui/card/CusCard.vue';
import CusSpace from '@/components/cus-ui/space/CusSpace.vue';

definePage({
  path: '/admin/role',
  name: '管理 - 角色管理',
  meta: {
    menuTitle: '角色管理',
    menuIcon: 'ip-permissions',
    showInMenu: true,
  },
});
</script>

<template>
  <cus-space direction="vertical" style="margin: 16px">
    <cus-card class="form" title="表单"> 表单 </cus-card>
    <cus-card class="table" title="表格"> 表格 </cus-card>
  </cus-space>
</template>

<style scoped lang="scss"></style>
