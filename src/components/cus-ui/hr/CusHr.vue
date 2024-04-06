<script setup lang="ts">
import type { CusHrProps } from './CusHr';

const props = withDefaults(defineProps<CusHrProps>(), {});
</script>

<template>
  <div class="cus-hr">
    <div></div>
    <span v-if="title">{{ title }}</span>
    <div></div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/variables.module';
.cus-hr {
  height: 1rem;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 4px;

  div {
    flex: 1;
    height: 1px;
    background-color: $color-grey-300;
  }

  span {
    color: $color-grey-500;
    margin-inline: 1rem;
  }
}
</style>
