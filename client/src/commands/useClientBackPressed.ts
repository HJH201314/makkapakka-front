import { onUnmounted } from 'vue';

const defaultCallback = () => {};

export function useClientBackPressed(callback?: (ev: any) => void) {
  const _callback = callback;

  window.addEventListener('onClientBackPressed', _callback ?? defaultCallback);

  onUnmounted(() => {
    window.removeEventListener('onClientBackPressed', _callback ?? defaultCallback);
  });
}
