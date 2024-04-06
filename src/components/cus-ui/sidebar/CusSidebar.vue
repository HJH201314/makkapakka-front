<script setup lang="ts">
/**
 * CusSidebar - 侧边栏
 * 属性会被透传到侧边栏的主体上
 * @author HJH201314
 *
 * */
import { nextTick, ref, toRef, watch } from 'vue';
import type { CusSidebarFunc, CusSidebarProps } from './CusSidebar';

const props = withDefaults(defineProps<CusSidebarProps>(), {
  showClose: true,
  visible: false,
  // position: 'left'
});

const emit = defineEmits<{
  (event: 'onOpen'): void;
  (event: 'onClose'): void;
  (event: 'update:visible', v: boolean): void;
}>();

const showModal = ref(false);

/* 观测visibility，可以通过切换visibility切换展示状态 */
watch(
  () => props.visible,
  (v) => {
    // nextTick才真正改变可视，能够让props.visible从一开始就为true时也展示动画
    nextTick(() => {
      showModal.value = v;
    });
  },
  { immediate: true }
);

/* 展示模态框（暴露的方法，配合ref使用） */
function open() {
  showModal.value = true;
}

/* 关闭模态框（暴露的方法，配合ref使用） */
function close() {
  showModal.value = false;
}

watch(
  () => showModal.value,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      emit('update:visible', newVal);
    }
  }
);

function handleMaskClick() {
  handleClose();
}

function handleClose() {
  close();
  emit('onClose');
}

/* 阻止透传到根节点 */
defineOptions({
  inheritAttrs: false,
});

/* 暴露接口 */
defineExpose<CusSidebarFunc>({
  open,
  close,
  isVisible: toRef(showModal),
});
</script>

<template>
  <teleport to="body">
    <transition name="show">
      <div v-show="showModal" class="modal">
        <div class="modal-mask" @click="handleMaskClick"></div>
        <transition :name="'slide-in-left'">
          <div v-if="showModal" class="modal-body" :style="props.modalStyle" v-bind="$attrs">
            <!--            <cus-button class="modal-body-close">-->
            <!--              <Close v-if="showClose" size="20" fill="#333" @click="handleClose" />-->
            <!--            </cus-button>-->
            <div class="modal-body-content">
              <!-- 对default slot暴露关闭方法，可以从v-slot中获取来关闭 -->
              <slot :isShown="showModal" :close="close"></slot>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<style scoped lang="scss">
@import '@/assets/variables.module';

.modal {
  visibility: unset;

  &-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.5);
  }

  &-body {
    position: fixed;
    top: 0;
    bottom: 0;
    width: fit-content;
    max-width: calc(100% - 2rem);
    z-index: 1001;
    background-color: $color-white;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    //display: flex; // 由于&-content是由内容撑起来的，这里设置为flex，能够让子元素撑起并占满&-body
    //flex-direction: column;
    overflow: hidden;

    &-close {
      span {
        height: 20px;
      }

      margin: 8px 0 0 8px;
    }

    &-content {
      flex: 1;
      overflow: auto;
    }
  }
}

.show-enter-active,
.show-leave-active {
  z-index: 999;
  transition: opacity 0.2s $ease-out-circ;
}

.show-enter-from,
.show-leave-to {
  opacity: 0;
}

.slide-in-left-enter-active,
.slide-in-left-leave-active {
  transition: left 0.25s $ease-out-circ;
}

.slide-in-left-enter-to,
.slide-in-left-leave-from {
  left: 0;
}

.slide-in-left-enter-from,
.slide-in-left-leave-to {
  left: -100%;
}

//.slide-in-right-enter-active,
//.slide-in-right-leave-active {
//  transition: right 0.25s $ease-out-circ;
//}
//
//.slide-in-right-enter-to,
//.slide-in-right-leave-from {
//  right: 0;
//}
//
//.slide-in-right-enter-from,
//.slide-in-right-leave-to {
//  right: -100%;
//}
</style>
