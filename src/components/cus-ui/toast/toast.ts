import type { CusToastProps } from "./CusToast";
import type { App } from "vue";
import { createApp, h } from "vue";
import CusToast from "./CusToast.vue";

let toastDiv: HTMLDivElement | null = null;
let app: App | null = null;

function showToast(props: CusToastProps) {
  if (!toastDiv) {
    toastDiv = document.createElement('div');
    document.querySelector('#app')?.appendChild(toastDiv);
  } else {
    app?.unmount(); // 卸载之前的应用实例
  }
  app = createApp({
    render() {
      return h(CusToast, props);
    }
  });
  app.mount(toastDiv);
}

export function quickToast(text: string) {
  showToast({text, position: 'top'});
}

export default showToast;
