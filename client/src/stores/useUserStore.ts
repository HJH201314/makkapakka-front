import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  let syncInfoTimer: number;
  const token = ref('');
  const userInfo = ref<API.UserInfo>({});

  onMounted(() => {
    syncInfoTimer = window.setTimeout(() => {
      const _token = window.AndroidInterface.getToken();
      const _user = window.AndroidInterface.getUser();
      console.log(_token);
      if (_token) {
        token.value = _token;
        localStorage.setItem('token', token.value);
      }
      if (_user) {
        userInfo.value = JSON.parse(_user);
        localStorage.setItem('user', _user);
      }
    }, 1000);
  });

  onBeforeUnmount(() => {
    window.clearTimeout(syncInfoTimer);
  });

  return {
    token,
    userInfo,
  };
});
