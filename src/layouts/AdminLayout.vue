<script setup lang="ts">
import CusButton from '@/components/cus-ui/button/CusButton.vue';

const router = useRouter();

const adminPages = computed(() => {
  return router.getRoutes().filter(v => v.path.startsWith('/admin/') && v.meta.showInMenu);
});

onMounted(() => {
  console.log(router.getRoutes());
});

function doRouteJump(path: string) {
  router.push(path);
}
</script>

<template>
  <div class="top">
    <div class="logo">
      MakkaPakka
    </div>
    <div class="menu">
      <CusButton v-for="page in adminPages" :key="page.path" shape="round" @click="() => doRouteJump(page.path)">{{ page.name }}</CusButton>
    </div>
    <div class="dropdown">

    </div>
  </div>
  <div class="main">
    <div class="left">

    </div>
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.module";
.logo {
  color: $color-primary-darker;
  font: {
    size: 27px;
    weight: bold;
    family: Tahoma;
  }
  text-align: center;
  margin: 8px;
  text-shadow: 2px 2px 5px $color-primary-darker;
}
.top {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 16px;
  //border-bottom: 1px solid $color-grey-200;
  box-shadow: $box-shadow;
}

.menu {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
}

.dropdown {
  justify-self: flex-end;
}
</style>