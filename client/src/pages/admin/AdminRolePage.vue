<script setup lang="ts">
import CusCard from '@/components/cus-ui/card/CusCard.vue';
import CusInput from '@/components/cus-ui/input/CusInput.vue';
import CusSelect from '@/components/cus-ui/select/CusSelect.vue';
import CusSpace from '@/components/cus-ui/space/CusSpace.vue';
import CusToggle from '@/components/cus-ui/toggle/CusToggle.vue';

definePage({
  path: '/admin/role',
  name: '管理 - 角色管理',
  meta: {
    menuTitle: '角色管理',
    menuIcon: 'ip-permissions',
    showInMenu: true,
  },
});

const testSelect = ref([]);
</script>

<template>
  <cus-space direction="vertical" style="margin: 16px">
    <cus-card class="form" title="表单">
      <cus-input size="md"></cus-input>
      <cus-select
        size="md"
        multiple
        :limit="3"
        v-model="testSelect"
        :options="[
          { label: '第一项', value: 1 },
          { label: '第二项', value: 2 },
          { label: '第三项', value: 3 },
          { label: '第四项', value: 4 },
          { label: '第四项', value: 5 },
          { label: '第四项', value: 6 },
          { label: '第四项', value: 7 },
          { label: '第四项', value: 8 },
          { label: '第四项', value: 9 },
          { label: '第四项', value: 10 },
          { label: '第四项', value: 11 },
          { label: '第四项', value: 12 },
          { label: '第四项', value: 13 },
          { label: '第四项', value: 14 },
        ]"
      ></cus-select>
      {{ testSelect }}
      <cus-toggle></cus-toggle>
    </cus-card>
    <cus-card class="table" title="表格"> 表格 </cus-card>
  </cus-space>
</template>

<style scoped lang="scss"></style>
