import type { CSSProperties } from 'vue';

export interface CusButtonProps {
  text?: string;
  icon?: string;
  type?: 'normal' | 'primary' | 'secondary' | 'tertiary';
  backgroundColor?: string;
  fontColor?: string;
  shadow?: boolean;
  disabled?: boolean;

  // 自定义样式
  buttonStyle?: CSSProperties;
}

export interface CusButtonEmits {
  (event: 'click'): void;
}
