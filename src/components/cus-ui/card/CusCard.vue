<script setup lang="ts">
import type { CusCardProps } from './CusCard';
import type { CSSProperties } from 'vue';
import variables from '@/assets/variables.module.scss';
import CusHr from '../hr/CusHr.vue';

const props = withDefaults(defineProps<CusCardProps>(), {
  shadow: false,
});

const styles = computed(() => {
  return {
    'box-shadow': variables.boxShadow2
  } as CSSProperties;
});
</script>

<template>
  <div class="cus-card" :style="styles">
    <div v-if="title">{{ title }}</div>
    <cus-hr v-if="title && $slots.default"  />
    <slot name="default"></slot>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.module";
.cus-card {
  background-color: white;
  box-sizing: border-box;
  padding: 1rem;
  border-radius: .5rem;
}
</style>