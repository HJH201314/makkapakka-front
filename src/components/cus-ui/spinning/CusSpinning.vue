<script setup lang="ts">
import type { CusSpinningProps } from './CusSpinning';

const props = withDefaults(defineProps<CusSpinningProps>(), {
  show: true,
  size: '1rem',
  thickness: '2px',
  color: '#fff',
});
</script>

<template>
  <div class="damping-circle" v-show="show"></div>
</template>

<style scoped lang="scss">
@import '@/assets/variables.module';
@keyframes spinning-rotate {
  to {
    transform: rotate(360deg);
  }
}

@keyframes spinning-scale {
  0%, 100% {
    scale: 1;
  }
  50% {
    scale: 0.9;
  }
}

.damping-circle {
  position: relative;
  width: v-bind(size);
  height: v-bind(size);
  border: v-bind(thickness) solid v-bind(color);
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spinning-rotate 1.5s linear infinite, spinning-scale 1.5s $ease-out-circ infinite;
}

</style>