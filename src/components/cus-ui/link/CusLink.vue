<script setup lang="ts">
const props = defineProps({});
</script>

<template>
  <a class="cus-link" v-bind="props">
    <slot></slot>
  </a>
</template>

<style scoped lang="scss">
@import "@/assets/variables.module";
.cus-link {
  text-decoration: none;
  display: inline-block;
  color: $color-primary;
  transition: all 0.2s $ease-out-circ;
  background: linear-gradient(to right, $color-primary, $color-primary) no-repeat left bottom;
  background-size: 0 1px;
  cursor: pointer;
  box-sizing: border-box;
  &:hover {
    color: $color-primary-darker;
    background-position: left bottom;
    background-size: 100% 1px;
  }
}
</style>