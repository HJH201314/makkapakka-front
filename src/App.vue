<script setup lang="ts">
import { RouterView } from 'vue-router';
import variables from '@/assets/variables.module.scss';
import AdminLayout from '@/layouts/AdminLayout.vue';

const route = useRoute();
</script>

<template>
  <a-config-provider :theme="{
    token: {
      colorPrimary: variables.colorPrimary
    }
  }">
    <router-view v-if="route.path.match(/^\/admin\/(?!login).*$/)" v-slot="{ Component }">
      <admin-layout>
        <transition>
          <component :is="Component"></component>
        </transition>
      </admin-layout>
    </router-view>
    <router-view v-else v-slot="{ Component }">
      <transition>
        <component :is="Component"></component>
      </transition>
    </router-view>
  </a-config-provider>
</template>

<style lang="scss">
</style>
