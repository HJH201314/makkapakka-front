import { defineStore } from 'pinia';
import browser from '@/utils/browser.util';

export const useUserStore = defineStore('user', () => {
  let syncInfoTimer: number;
  const token = ref('');
  const userInfo = ref<API.UserInfo>({
    id: 0,
    name: '未命名',
    avatarUrl: '/favicon.ico',
  });
  const coverUrl = ref<string>('');
  const title = ref<string>('');

  onMounted(() => {
    syncInfoTimer = window.setTimeout(() => {
      // 仅在安卓中同步用户数据
      if (!browser.isAndroid()) return;
      const _token = window.AndroidInterface?.getToken?.();
      const _user = window.AndroidInterface?.getUser?.();
      console.log(_token);
      if (_token) {
        token.value = _token;
        localStorage.setItem('token', token.value);
      }
      if (_user) {
        userInfo.value = JSON.parse(_user);
        localStorage.setItem('user', _user);
      }
    }, 0);
  });

  onBeforeUnmount(() => {
    window.clearTimeout(syncInfoTimer);
  });

  return {
    token,
    userInfo,
    coverUrl,
    title,
  };
});
