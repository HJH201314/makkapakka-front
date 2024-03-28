<script setup lang="ts">
import AdminLayout from '@/layouts/AdminLayout.vue';

definePage({
  path: '/admin',
  alias: ['/admin/home'],
  name: '首页',
  meta: {
    showInMenu: true,
  }
});
</script>

<template>
  <admin-layout>

  </admin-layout>
</template>

<style scoped>

</style>