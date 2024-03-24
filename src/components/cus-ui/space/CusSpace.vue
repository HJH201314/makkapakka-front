<script setup lang="ts">

</script>

<template>
  <div class="cus-space">
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