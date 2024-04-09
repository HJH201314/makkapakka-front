<script setup lang="ts">
import type { CSSProperties } from 'vue';
import type { CusSpaceProps } from './CusSpace';

const props = withDefaults(defineProps<CusSpaceProps>(), {
  direction: 'row',
  gap: '1rem',
});

const styles = computed(
  () =>
    ({
      flexDirection:
        props.direction == 'vertical' || props.direction == 'column' ? 'column' : 'row',
      gap: props.gap,
    }) as CSSProperties
);
</script>

<template>
  <div class="cus-space" :style="styles">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.cus-space {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
