import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const username = ref('Makka');

  return {
    username,
  };
});