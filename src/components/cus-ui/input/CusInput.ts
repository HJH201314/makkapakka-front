import type { InputHTMLAttributes } from 'vue';

/**
 * 输入框组件的属性
 * 可直接透传input的属性
 */
export type CusInputProps = {
  modelValue?: string;
  /**
   * 受控模式下的默认值
   */
  value?: string;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg' | InputHTMLAttributes['width'];
  disabled?: boolean;

  /**
   * input标签的属性
   */
  inputAttrs?: InputHTMLAttributes;
};
