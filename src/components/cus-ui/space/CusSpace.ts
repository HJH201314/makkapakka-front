import type { CSSProperties } from 'vue';

export type CusSpaceProps = {
  direction?: 'vertical' | 'horizontal' | 'column' | 'row';
  gap?: CSSProperties['gap'];
}