import type { CSSProperties, Ref } from 'vue';

export type CusSidebarFunc = {
  open: () => void;
  close: () => void;
  isVisible: Ref<boolean>;
}

export type CusSidebarProps = {
  showClose?: boolean;
  visible?: boolean; // 默认不展示
  modalStyle?: CSSProperties;
  // position?: 'left' | 'right';
}