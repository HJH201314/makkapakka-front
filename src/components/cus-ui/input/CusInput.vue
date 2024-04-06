<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { CusInputProps } from './CusInput';

const props = withDefaults(defineProps<CusInputProps>(), {
  value: '',
  inputAttrs: () => ({
    autocomplete: 'off',
  }),
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
  // 非受控模式
  (event: 'change', value: string): void;
}>();

const v = ref(props.modelValue || props.value);

watch(
  () => props.modelValue || props.value,
  (newValue, oldValue) => {
    if (newValue != undefined && newValue !== oldValue) {
      v.value = newValue;
    }
  }
);

const inputWidth = computed(() => {
  switch (props.size) {
    case 'sm':
      return '10rem';
    case 'md':
      return '20rem';
    case 'lg':
      return '30rem';
    default:
      return props.size ?? '100%';
  }
});

function handleInput(e: any) {
  emit('update:modelValue', e.target.value as string);
  emit('change', e.target.value as string);
}
</script>

<template>
  <input
    class="cus-input"
    :value="v"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    @input="handleInput"
    v-bind="props.inputAttrs"
  />
</template>

<style scoped lang="scss">
@import '../assets/variables.module';
.cus-input {
  outline: none;
  resize: none;
  border: none;
  width: v-bind(inputWidth);
  min-width: 3rem;
  max-width: 100vw;
  box-sizing: border-box;
  border-radius: 0.5rem;
  padding: 0.5rem 0.5rem;
  transition: background-color 0.2s ease-in-out;
  background-color: $cus-color-grey-100;
  &:focus {
    background-color: $cus-color-grey-300;
  }
}
</style>
