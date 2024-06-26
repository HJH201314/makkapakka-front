import type { CSSProperties } from 'vue';

export interface CusToastProps {
  text?: string;
  position?:
    | 'top'
    | 'top-center'
    | 'top-left'
    | 'top-right'
    | 'bottom'
    | 'bottom-center'
    | 'bottom-left'
    | 'bottom-right';
  duration?: 'normal' | 'long' | 'short' | number;
  type?: 'normal' | 'success' | 'danger' | 'info' | 'warning';
  color?: CSSProperties['color'];
}
