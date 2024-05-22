<script setup lang="ts">
import variables from '@/assets/variables.module.scss';
import CusConfigProvider from '@/components/cus-ui/config-provider/CusConfigProvider';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { RouterView } from 'vue-router';

const route = useRoute();

if (import.meta.env.DEV) {
  if (localStorage.getItem('APP_DEBUG') !== 'true') {
    localStorage.setItem('APP_DEBUG', 'true');
  }
}
</script>

<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: variables.colorPrimary,
      },
    }"
  >
    <cus-config-provider :theme="{ primaryColor: variables.colorPrimary }">
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
    </cus-config-provider>
  </a-config-provider>
</template>

<style lang="scss"></style>
