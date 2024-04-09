import type { CusInputProps } from '../input/CusInput';

export type CusSelectValue = any;

export type CusSelectOption = {
  label: string;
  value: CusSelectValue;
};

export type CusSelectProps = {
  options?: CusSelectOption[];
  value?: any;
  modelValue?: any;
  /**
   * 多选
   */
  multiple?: boolean;
  /**
   * 限制个数（仅多选）
   */
  limit?: number;
} & Pick<CusInputProps, 'placeholder' | 'size'>; // input props
