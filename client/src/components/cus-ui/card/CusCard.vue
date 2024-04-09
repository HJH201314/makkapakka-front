<script setup lang="ts">
import type { CSSProperties } from 'vue';
import variables from '@/assets/variables.module.scss';
import type { CusCardProps } from './CusCard';
import CusHr from '../hr/CusHr.vue';

const props = withDefaults(defineProps<CusCardProps>(), {
  shadow: false,
});

const styles = computed(
  () =>
    ({
      'box-shadow': variables.boxShadow2,
    }) as CSSProperties
);
</script>

<template>
  <div class="cus-card" :style="styles">
    <div v-if="title" class="title">{{ title }}</div>
    <!--    <cus-hr v-if="title && $slots.default"  />-->
    <slot name="default"></slot>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/variables.module';
.cus-card {
  background-color: white;
  box-sizing: border-box;
  padding: 1rem;
  border-radius: 0.5rem;

  .title {
    margin-bottom: 8px;
  }
}
</style>
