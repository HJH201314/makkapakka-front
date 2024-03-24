<script setup lang="ts">

</script>

<template>
  <div class="align-center-layout">
    <div class="align-center-layout-slot">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.align-center-layout {
  position: relative;
  width: 100%;
  height: 100%;

  &-slot {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>