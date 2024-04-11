<template>
  <header class="login-header">
    <span class="logo-container">
          <img class="makka-logo" src="@/assets/logo.png" />
          <span class="makka-title">&nbsp;MakkaPakka Admin</span>
        </span>
    <div class="operations-container">
      <t-button theme="default" shape="square" variant="text" @click="navToGitHub">
        <t-icon name="logo-github" class="icon" />
      </t-button>
      <t-button theme="default" shape="square" variant="text" @click="navToHelper">
        <t-icon name="help-circle" class="icon" />
      </t-button>
      <t-button theme="default" shape="square" variant="text" @click="toggleSettingPanel">
        <t-icon name="setting" class="icon" />
      </t-button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useSettingStore } from '@/store';

const settingStore = useSettingStore();
const toggleSettingPanel = () => {
  settingStore.updateConfig({
    showSettingPanel: true,
  });
};

const navToGitHub = () => {
  window.open('https://github.com/HJH201314/makkapakka-front');
};

const navToHelper = () => {
  window.open('https://github.com/HJH201314/makkapakka-front');
};
</script>

<style lang="less" scoped>
.login-header {
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(5px);
  color: var(--td-text-color-primary);

  .logo-container {
    height: 48px;
    display: flex;
    align-items: center;

    .makka-logo {
      height: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      &:hover {
        cursor: pointer;
      }
    }

    .makka-title {
      text-wrap: nowrap;
      font-size: medium;
      font-weight: bold;
      font-style: italic;
    }

    &:hover {
      cursor: pointer;
    }
  }

  .operations-container {
    display: flex;
    align-items: center;
    .t-button {
      margin-left: 16px;
    }

    .icon {
      height: 20px;
      width: 20px;
      padding: 6px;
      box-sizing: content-box;

      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
