<script setup lang="ts">
import { Check, Down } from '@icon-park/vue-next';
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useMouseInElement, useMousePressed } from '@vueuse/core';
import { useConfigProvider } from '../config-provider/CusConfigProvider';
import CusInput from '../input/CusInput.vue';
import CusPopover from '../popover/CusPopover.vue';
import { CusColor } from '../utils/color.util';
import type { CusSelectOption, CusSelectProps, CusSelectValue } from './CusSelect';
import type { CusInputFunc } from '@/components/cus-ui/input/CusInput';

const { theme } = useConfigProvider();
const selectedBackgroundColor = new CusColor(theme.primaryColor).subColor(
  CusColor.white,
  10,
  8
).hexColor;

const props = withDefaults(defineProps<CusSelectProps>(), {
  placeholder: '请选择...',
});

const emit = defineEmits<{
  /* 受控模式 */
  (e: 'update:modelValue', value: any): void;
  /* 非受控模式 */
  (e: 'change', value: any): void;
  /* 达到上限 */
  (e: 'limited'): void;
}>();

const cusInputRef = ref<CusInputFunc>();
const cusSelectRef = ref<HTMLDivElement>();
onClickOutside(cusSelectRef, () => {
  showPopover.value = false;
  cusInputRef.value?.blur();
});

const options = ref<CusSelectOption[]>([]);
let optionsMap = new Map<CusSelectValue, CusSelectOption>();
const selectedSet = reactive(new Set<CusSelectValue>());
const inputText = computed(() => {
  if (options.value.length <= 1000) {
    // 在数量较少时进行排序
    return options.value
      .filter((opt) => selectedSet.has(opt.value))
      .map((v) => v.label)
      .join(', ');
  } else {
    return Array.from(selectedSet.keys())
      .map((v) => optionsMap.get(v)!.label)
      .join(', ');
  }
});

watch(
  () => props.options,
  (newVal) => {
    options.value.splice(0, options.value.length);
    optionsMap.clear();
    for (const opt of newVal ?? []) {
      if (!optionsMap.has(opt.value)) {
        optionsMap.set(opt.value, opt);
        options.value.push(opt);
      }
    }
  },
  { immediate: true }
);
watch(
  () => props.modelValue || props.value,
  (newVal) => {
    if (newVal != null) {
      if (props.multiple && newVal instanceof Array) {
        selectedSet.clear();
        newVal.forEach((v) => {
          if (optionsMap.has(v)) selectedSet.add(v);
        });
      } else if (!props.multiple) {
        selectedSet.clear();
        if (optionsMap.has(newVal)) selectedSet.add(newVal);
      }
    }
  },
  { immediate: true }
);

const showPopover = ref(false);

function handleInputFocus() {
  showPopover.value = true;
}

function handleInputBlur() {
  if (showPopover.value) {
    cusInputRef.value?.focus();
  }
}

function handleItemClick(value: any) {
  if (props.multiple) {
    // 多选
    if (selectedSet.has(value)) selectedSet.delete(value);
    else if (selectedSet.size < (props.limit ?? Number.MAX_SAFE_INTEGER)) {
      selectedSet.add(value);
    } else {
      emit('limited');
    }
  } else {
    // 单选
    selectedSet.clear();
    selectedSet.add(value);
  }
  const valueList = Array.from(selectedSet.keys());
  if (props.multiple) {
    emit('update:modelValue', valueList);
    emit('change', valueList);
  } else {
    emit('update:modelValue', valueList.length > 0 ? valueList[0] : null);
    emit('change', valueList.length > 0 ? valueList[0] : null);
  }
}
</script>

<template>
  <div ref="cusSelectRef" class="cus-select">
    <cus-popover position="bottom" v-model:show="showPopover" size="fit-body" mode="click">
      <template #body>
        <cus-input
          ref="cusInputRef"
          readonly
          :placeholder="props.placeholder"
          :size="props.size"
          :value="inputText"
          @focus="handleInputFocus"
          @blur="handleInputBlur"
        ></cus-input>
        <div class="icon">
          <slot name="icon">
            <down></down>
          </slot>
        </div>
      </template>
      <template #popover>
        <ol class="popup">
          <li
            v-for="option in options"
            :key="option.value"
            :style="{
              'background-color': selectedSet.has(option.value) ? selectedBackgroundColor : '',
            }"
            @click="handleItemClick(option.value)"
          >
            {{ option.label }}
            <check
              v-if="selectedSet.has(option.value)"
              :stroke-width="8"
              :fill="theme?.primaryColor"
            ></check>
          </li>
        </ol>
      </template>
    </cus-popover>
  </div>
</template>

<style scoped lang="scss">
@import '../assets/main';
.cus-select {
  position: relative;
  width: min-content;
}

.icon {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 8px;
  display: flex;
  align-items: center;
  pointer-events: none;
}

.popup {
  @include cus-scrollbar;
  max-height: 160px;
  width: 100%;
  transform: translateY(-2px);
  padding: 0;
  margin: 0;
  list-style-type: none;
  border-radius: 8px;
  overflow-y: auto;
  background: white;
  box-shadow: $cus-box-shadow;
  cursor: pointer;

  li {
    display: flex;
    justify-content: space-between;
    padding: 8px;
    background-color: white;
    transition: background-color 0.2s ease-in-out;
    &:hover {
      background-color: $cus-color-grey-200;
    }
  }
}
</style>
