<script setup lang="ts">
import { ApplicationMenu } from '@icon-park/vue-next';
import CusButton from '@/components/cus-ui/button/CusButton.vue';
import CusSidebar from '@/components/cus-ui/sidebar/CusSidebar.vue';
import { useUserStore } from '@/stores/useUserStore';
import useGlobal from '@/commands/useGlobal';

const route = useRoute();
const router = useRouter();
const global = useGlobal();
const userStore = useUserStore();
const showSidebar = ref(false);

const adminPages = computed(() =>
  router.getRoutes().filter((v) => v.path.startsWith('/admin/') && v.meta.showInMenu)
);

onMounted(() => {
  console.log(router.getRoutes());
});

function doRouteJump(path: string) {
  router.push(path);
  showSidebar.value = false;
}

function toggleSidebar() {
  showSidebar.value = !showSidebar.value;
}

function handleLogout() {
  router.replace('/admin/login');
}
</script>

<template>
  <div class="layout">
    <div class="top">
      <application-menu
        v-if="global.isSmallScreen"
        theme="outline"
        size="24"
        fill="#333"
        @click="toggleSidebar"
      />
      <div class="logo" @click="() => doRouteJump('/admin/home')">
        <img src="@/assets/img/logo.png" alt="logo" />
      </div>
      <div class="menu" v-if="global.isLargeScreen">
        <cus-button
          v-for="page in adminPages"
          :key="page.path"
          shape="round"
          @click="() => doRouteJump(page.path)"
          :tertiary="route.path == page.path"
        >
          <template #icon>
            <component v-if="page.meta.menuIcon" :is="page.meta.menuIcon"></component>
          </template>
          <span>{{ page.meta.menuTitle || page.name }}</span>
        </cus-button>
      </div>
      <div class="dropdown">
        Hello {{ userStore.username }}
        <cus-button @click="handleLogout">退出</cus-button>
      </div>
    </div>
    <cus-sidebar :visible="showSidebar" style="width: 200px; padding: 8px">
      <div style="display: flex; flex-direction: column; gap: 8px">
        <cus-button
          v-for="page in adminPages"
          :key="page.path"
          @click="() => doRouteJump(page.path)"
          :tertiary="route.path == page.path"
        >
          <component v-if="page.meta.menuIcon" :is="page.meta.menuIcon"></component>
          <span>{{ page.meta.menuTitle || page.name }}</span>
        </cus-button>
      </div>
    </cus-sidebar>
    <div class="main">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/variables.module';

.layout {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.logo {
  cursor: pointer;

  img {
    height: 48px;
    width: 48px;
    object-fit: cover;
  }
}

.top {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
  padding: 0 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  //border-bottom: 1px solid $color-grey-200;
  box-shadow: $box-shadow;
  //background: linear-gradient(to right bottom, $color-makka-300, $color-makka-100);
}

.menu {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;

  span {
    transition: color 0.25s ease-in-out;
  }

  //&-icon__active {
  //  color: $color-primary-darker;
  //}
}

.dropdown {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  height: 100dvh;
  width: 0;
  background: white;
  padding-top: 8px;
  box-shadow: $box-shadow;
  box-sizing: border-box;
  transition: width 0.5s $ease-in-out-circ;

  &__show {
    width: 196px;
  }

  &-close {
    margin-left: 8px;
  }
}

.main {
  position: relative;
  flex: 1;
}
</style>
