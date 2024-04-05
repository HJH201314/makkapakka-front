<script setup lang="ts">

import { ref, watch } from 'vue';
import type { CusToggleProps } from './CusToggle';
import cusVariables from '../assets/variables.module.scss';
import { useConfigProvider } from '../config-provider/CusConfigProvider';
import { CusColor } from '@/components/cus-ui/utils/color.util';

const props = withDefaults(defineProps<CusToggleProps>(), {});

const { theme } = useConfigProvider();

const backgroundColor = computed(() => {
  // 未激活时
  if (!active.value) return cusVariables.cusColorGrey400;
  // 激活时
  if (props.color) return props.color;
  else return theme.primaryColor || cusVariables.cusColorPrimary;
});

const hoverBackgroundColor = computed(() => {
  const color = new CusColor(backgroundColor.value);
  return color.isDark() ? new CusColor(backgroundColor.value).lighten(0.1).hexColor : new CusColor(backgroundColor.value).darken(0.1).hexColor;
});

const foregroundColor = computed(() => {
  return new CusColor(backgroundColor.value).subColor(CusColor.white, 10, 7).hexColor;
});

const emit = defineEmits<{
  // 受控模式
  (event: 'update:modelValue', active: boolean): void;
  // 非受控模式
  (event: 'change', active: boolean): void;
}>();

const active = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
  active.value = newVal;
});

function toggle() {
  active.value = !active.value;
  emit('update:modelValue', active.value);
  emit('change', active.value);
}

</script>

<template>
  <div class="toggle">
    <input v-show="false" type="checkbox" :value="active" />
    <slot name="before"></slot>
    <div class="toggle-container" @click="toggle">
      <div class="toggle-front" :class="{'active': active}" />
    </div>
    <label class="toggle-label" v-if="label">{{ label }}</label>
    <slot name="after"></slot>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.module";

.toggle {
  display: flex;
  flex-wrap: nowrap;
  gap: .5rem;
  align-items: center;

  &-container {
    cursor: pointer;
    width: 40px;
    height: 24px;
    border-radius: 8px;
    position: relative;
    transition: background-color .2s ease-in-out;
    background-color: v-bind(backgroundColor);

    &:hover {
      background-color: v-bind(hoverBackgroundColor);
    }
  }

  &-front {
    position: absolute;
    width: 16px;
    left: 4px;
    top: 4px;
    bottom: 4px;
    border-radius: 4px;
    background-color: $color-grey-200;
    transition: background-color .2s ease-in-out, transform .2s ease-in-out;

    &.active {
      transform: translateX(100%);
      background-color: v-bind(foregroundColor);
    }
  }

  &-label {
  }
}
</style>