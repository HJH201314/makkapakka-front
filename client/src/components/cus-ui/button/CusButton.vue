<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { computed, ref } from 'vue';
import variables from '../assets/variables.module.scss';
import type { CusButtonEmits, CusButtonProps } from './CusButton';
import { CusColor } from '../utils/color.util';
import { useConfigProvider } from '../config-provider/CusConfigProvider';

const { theme } = useConfigProvider();

const props = withDefaults(defineProps<CusButtonProps>(), {
  text: '',
  type: 'default',
  primary: true,
  shadow: false,
});

const producedProps = computed(() => ({
  ...props,
  primary: props.primary && !props.secondary && !props.tertiary && !props.quaternary,
  secondary: props.secondary && !props.tertiary && !props.quaternary,
  tertiary: props.tertiary && !props.quaternary,
  quaternary: props.quaternary,
}));

const emit = defineEmits<CusButtonEmits>();

const buttonRef = ref<HTMLButtonElement>();

const buttonStyle = computed(() => {
  const calcStyle: CSSProperties = {
    'box-shadow': props.shadow ? variables.boxShadow : 'none',
    padding: props.text ? '8px 16px' : '8px',
    'border-radius': '8px',
    'font-weight': props.strong ? 'bold' : 'normal',
    ...props.buttonStyle,
  };
  // 背景颜色
  if (props.alwaysHover) {
    calcStyle.backgroundColor = hoverBackgroundColor.value;
    calcStyle.color = hoverFontColor.value;
  }
  if (props.alwaysActive) {
    calcStyle.backgroundColor = activeBackgroundColor.value;
    calcStyle.color = activeFontColor.value;
  }
  return calcStyle;
});

const color = computed(() => {
  if (props.color) return props.color;
  if (props.type == 'primary') return theme.primaryColor || variables.cusColorPrimary;
  if (props.type == 'info') return variables.cusColorInfo;
  if (props.type == 'success') return variables.cusColorSuccess;
  if (props.type == 'warning') return variables.cusColorWarning;
  if (props.type == 'error') return variables.cusColorError;
  return variables.cusColorWhite;
});

const fontColor = computed(() => {
  // 如果有自定义字体颜色，直接返回
  if (props.fontColor) return props.fontColor;
  if (props.type != 'default') {
    // 主要按钮
    if (producedProps.value.primary) return variables.cusColorWhite;
    // 次/次次/次次次要按钮
    if (!producedProps.value.primary) return color.value;
  }
  return variables.cusColorText;
});
const hoverFontColor = computed(() => {
  if (producedProps.value.primary) {
    const fontColorUtil = new CusColor(fontColor.value);
    if (fontColorUtil.isDark()) return theme.primaryColor || variables.cusColorPrimary;
    return variables.cusColorWhite;
  }
  return fontColor.value;
});
const activeFontColor = computed(() => hoverFontColor.value);

const backgroundColor = computed(() => {
  if (props.backgroundColor) return props.backgroundColor;
  const cusColor = new CusColor(color.value);
  if (producedProps.value.quaternary) return variables.cusColorWhite;
  if (producedProps.value.tertiary) return variables.cusColorBackground;
  if (producedProps.value.secondary) return cusColor.subColor(CusColor.white, 10, 7).hexColor;
  if (producedProps.value.primary) return color.value;
  return variables.cusColorWhite;
});
const hoverBackgroundColor = computed(() => {
  const hoverColorUtil = new CusColor(backgroundColor.value);
  if (hoverColorUtil.isDark()) return hoverColorUtil.lighten(0.1).hexColor;
  return hoverColorUtil.darken(0.1).hexColor;
});
const activeBackgroundColor = computed(() => {
  const hoverColorUtil = new CusColor(backgroundColor.value);
  if (hoverColorUtil.isDark()) return hoverColorUtil.lighten(0.2).hexColor;
  return hoverColorUtil.darken(0.2).hexColor;
});

function handleClick() {
  if (props.disabled) return; // 如果禁用了，直接拦截click事件
  emit('click');
}
</script>

<template>
  <button
    class="cus-button"
    ref="buttonRef"
    :style="buttonStyle"
    @click="handleClick"
    :class="{ disabled: props.disabled }"
  >
    <!-- 图标专用插槽 -->
    <slot name="icon"></slot>
    <!-- 按钮内容插槽 -->
    <slot v-if="!text"></slot>
    <span v-else>{{ text }}</span>
  </button>
</template>

<style scoped lang="scss">
.cus-button {
  position: relative;
  outline: none;
  transition:
    background-color 0.25s ease-in-out,
    color 0.25s ease-in-out;
  background-color: v-bind(backgroundColor);
  border: 1px solid v-bind(backgroundColor);
  color: v-bind(fontColor);
  overflow: hidden;
  white-space: pre;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  &.disabled {
    //background-color: $color-grey-200;
    //color: $color-grey-500;
    filter: grayscale(0.5) opacity(0.5);
    cursor: not-allowed;
  }

  &:not(&.disabled):hover {
    cursor: pointer;
    background-color: v-bind(hoverBackgroundColor);
    color: v-bind(hoverFontColor);
    //border: 1px solid v-bind(hoverBackgroundColor);
  }

  &:not(&.disabled):active {
    background-color: v-bind(activeBackgroundColor);
    color: v-bind(activeFontColor);
    //border: 1px solid v-bind(activeBackgroundColor);
  }
}
</style>
