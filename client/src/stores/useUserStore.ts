import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const token = ref('');
  const username = ref('Makka');

  onMounted(() => {
    setTimeout(() => {
      // @ts-ignore
      const _token = AndroidInterface.getToken();
      console.log(_token);
      if (_token) {
        token.value = _token;
        localStorage.setItem('token', token.value);
      }
    }, 1000);
  });

  return {
    token,
    username,
  };
});
