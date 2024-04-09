import type { CSSProperties } from 'vue';

export interface CusButtonProps {
  /**
   * @deprecated 请停止使用，该属性已失效
   */
  text?: string;
  /**
   * 按钮类型, 用于快速指定颜色
   * @default default
   */
  type?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error';
  /**
   * 主要按钮
   * @default true
   */
  primary?: boolean;
  /**
   * 次要按钮
   * @default false
   */
  secondary?: boolean;
  /**
   * 次次要按钮
   * @default false
   */
  tertiary?: boolean;
  /**
   * 次次次要按钮
   * @default false
   */
  quaternary?: boolean;
  /**
   * 按钮颜色
   */
  color?: string;
  /**
   * 自定义按钮背景色（覆盖按钮等级）
   */
  backgroundColor?: string;
  /**
   * 自定义按钮前景色（覆盖按钮等级）
   */
  fontColor?: string;
  strong?: boolean;
  shadow?: boolean;
  disabled?: boolean;

  alwaysHover?: boolean;
  alwaysActive?: boolean;

  // 自定义样式
  buttonStyle?: CSSProperties;
}

export interface CusButtonEmits {
  (event: 'click'): void;
}
