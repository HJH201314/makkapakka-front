<script setup lang="ts">
import { ref } from 'vue';

const responseText = ref('');

onMounted(() => {
  fetch('/api/test')
    .then((res) => res.text())
    .then((text) => {
      responseText.value = text;
    });
});
</script>

<template>
  <div>{{ responseText }}</div>
</template>

<style scoped></style>
