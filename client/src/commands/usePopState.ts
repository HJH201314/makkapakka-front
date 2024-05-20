import { onBeforeUnmount, onMounted } from 'vue';

const defaultCallback = () => {};

export function usePopState(callback?: (ev: WindowEventMap['popstate']) => void) {
  window.addEventListener('popstate', callback ?? defaultCallback);
  onMounted(() => {
    window.addEventListener('popstate', callback ?? defaultCallback);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('popstate', callback ?? defaultCallback);
  });
}
