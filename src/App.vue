<script setup lang="ts">
import { RouterView } from 'vue-router';
import variables from '@/assets/variables.module.scss';
</script>

<template>
  <a-config-provider :theme="{
    token: {
      colorPrimary: variables.colorPrimary
    }
  }">
    <router-view v-slot="{ Component }">
      <transition>
        <component :is="Component"></component>
      </transition>
    </router-view>
  </a-config-provider>
</template>

<style lang="scss">
@import "@/assets/main";
#app {
  position: relative;
  height: 100dvh;
  width: 100dvw;
}
</style>
