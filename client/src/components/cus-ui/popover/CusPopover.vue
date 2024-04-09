<script setup lang="ts">
/* Popover 悬浮显示组件 */
import { useMouseInElement } from '@vueuse/core';
import { nextTick, ref, watch } from 'vue';
import type { CusPopoverFunc } from './CusPopover';

type PopoverProps = {
  alwaysShow?: boolean; // 调试时使用，让popover一直显示
  /**
   * 受控，展示与否，受控模式下将不会在hover时展示
   */
  show?: boolean;
  mode?: 'hover' | 'click';
  position?: 'top' | 'bottom' | 'left' | 'right';
  size?: 'fit-content' | 'fit-body';
  enabled?: boolean;
};
const props = withDefaults(defineProps<PopoverProps>(), {
  alwaysShow: false,
  mode: 'hover',
  text: '',
  position: 'right',
  size: 'fit-content',
  enabled: true,
});

const emit = defineEmits<{
  (e: 'update:show', v: boolean): void;
}>();

const refTrigger = ref<HTMLDivElement>();
const refContainer = ref<HTMLDivElement>();
const refPopover = ref<HTMLDivElement>();

const showPopover = ref(props.show ?? false);

watch(
  () => props.show,
  (newVal) => {
    if (newVal != undefined) {
      if (newVal) doShow();
      else doHide();
    }
  }
);

function doShow(force?: boolean) {
  if (!force) {
    if (!props.enabled) return;
    if (props.show != undefined && !props.show) return;
  }
  // 先切换show再设置位置，否则由于popover元素大小不存在，导致位置计算错误
  showPopover.value = true;
  nextTick(() => {
    const trigger = refTrigger.value;
    const popover = refPopover.value;
    if (!trigger || !popover) return;
    // console.debug(refTrigger.value?.offsetLeft, refTrigger.value?.offsetWidth);
    let positionLeft = 0;
    let positionTop = 0;
    switch (props.position) {
      case 'top':
        positionLeft = trigger.offsetWidth / 2 - popover.offsetWidth / 2;
        positionTop = trigger.offsetTop - popover.offsetHeight - 2;
        break;
      case 'left':
        positionLeft = -popover.offsetWidth - 2;
        positionTop = trigger.offsetTop + trigger.offsetHeight / 2 - popover.offsetHeight / 2;
        break;
      case 'right':
        positionLeft = trigger.offsetWidth + 2;
        positionTop = trigger.offsetTop + trigger.offsetHeight / 2 - popover.offsetHeight / 2;
        break;
      case 'bottom':
        positionLeft = trigger.offsetWidth / 2 - popover.offsetWidth / 2;
        positionTop = trigger.offsetTop + trigger.offsetHeight + 2;
        break;
    }
    refPopover.value!.style.top = `${positionTop}px`;
    refPopover.value!.style.left = `${positionLeft}px`;
  });
  // 设置定时，如果超出时间，则尝试关闭popover
  clearInterval(closeInterval.value);
  closeInterval.value = window.setInterval(doHide, 500);
}

const closeInterval = ref<number>();
const mouseInBase = useMouseInElement(refContainer);
const mouseInPopover = useMouseInElement(refPopover);

function doHide(e?: MouseEvent, force?: boolean) {
  if (props.show) return;
  if (!force && !props.enabled) showPopover.value = false;
  // console.debug({
  //   mouseX: mouseInBase.elementX.value,
  //   mouseY: mouseInBase.elementY.value,
  //   eventMouseX: e?.offsetX,
  //   eventMouseY: e?.offsetY,
  //   elementX: mouseInBase.elementWidth.value,
  //   elementY: mouseInBase.elementHeight.value,
  // });
  // useMouseInElement的结果有延迟，一个nextTick似乎避免不了
  // 因此如果有事件传进来，以事件中offsetX/offsetY的为准
  // 下方判断加等号是因为，事件传递过来的offset有可能等于宽度或高度
  const isOutsideByEvent = !e
    ? false
    : (e.offsetX <= 0 ||
        e.offsetX >= mouseInBase.elementWidth.value ||
        e.offsetY <= 0 ||
        e.offsetY >= mouseInBase.elementHeight.value) &&
      (e.offsetX <= 0 ||
        e.offsetX >= mouseInPopover.elementWidth.value ||
        e.offsetY <= 0 ||
        e.offsetY >= mouseInPopover.elementHeight.value);
  if (isOutsideByEvent || (mouseInBase.isOutside.value && mouseInPopover.isOutside.value)) {
    showPopover.value = false;
    clearInterval(closeInterval.value);
  }
}

defineExpose<CusPopoverFunc>({
  forceShow: () => doShow(true),
  forceHide: () => doHide(undefined, true),
  show: () => doShow(),
  hide: () => doHide(),
});
</script>

<template>
  <div class="popover" @mouseenter="() => doShow(false)" @mouseleave="doHide" ref="refContainer">
    <div class="popover-wrapper" ref="refTrigger">
      <slot name="body" />
    </div>
    <Transition>
      <div
        v-show="showPopover || props.alwaysShow"
        class="popover-slot"
        :class="{ 'fit-body': props.size == 'fit-body' }"
        ref="refPopover"
        role="tooltip"
        @mouseleave="doHide"
      >
        <slot name="popover" />
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/variables.module';
.popover {
  position: relative;
  &-slot {
    position: absolute;
    border-radius: 0.5rem;
    background-color: transparent;
    z-index: 999;
    box-sizing: border-box;
    &.fit-body {
      width: 100%;
    }
  }
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s $ease-out-circ;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
