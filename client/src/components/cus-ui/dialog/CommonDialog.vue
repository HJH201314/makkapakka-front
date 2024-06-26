<!-- 基于Modal的基础对话框组件 -->
<script setup lang="ts">
import { ref } from 'vue';
import CommonModal from '../modal/CommonModal.vue';
import type { CommonModalFunc } from '../modal/CommonModal';
import CusButton from '../button/CusButton.vue';
import type { CommonDialogEmits, CommonDialogExpose, CommonDialogProps } from './CommonDialog';
import { DialogManager } from './index';

const props = withDefaults(defineProps<CommonDialogProps>(), {
  title: '',
});

const emits = defineEmits<CommonDialogEmits>();

const modalRef = ref<CommonModalFunc>();

function show() {
  modalRef.value?.open();
}

function close() {
  modalRef.value?.close();
  if (props._id) {
    // 如果有props.id，需要在manager中销毁自身
    DialogManager.destroy(props._id);
  }
}

function handleConfirm() {
  if (props.onConfirm) {
    props.onConfirm(close);
    emits('onConfirm', close); // 传递关闭回调函数
  } else {
    close(); // 不存在回调函数时默认自动关闭
  }
}

function handleCancel() {
  if (props.onCancel) {
    props.onCancel(close);
    emits('onCancel', close); // 传递关闭回调函数
  } else {
    close(); // 不存在回调函数时默认自动关闭
  }
}

defineExpose<CommonDialogExpose>({
  show,
  close,
});
</script>

<template>
  <CommonModal
    :modal-style="{ 'background-color': 'white', ...props.modalStyle }"
    ref="modalRef"
    :show-close="false"
  >
    <div class="dialog">
      <header>
        <div class="dialog-title">{{ title }}</div>
      </header>
      <main>
        <div v-html="props.content"></div>
        <slot></slot>
      </main>
      <footer>
        <cus-button
          v-if="showCancel"
          class="btn"
          text="取消"
          tertiary
          type="default"
          @click="handleCancel"
          v-bind="props.cancelButtonProps"
        />
        <cus-button
          class="btn"
          text="确认"
          type="primary"
          @click="handleConfirm"
          v-bind="props.confirmButtonProps"
        />
      </footer>
    </div>
  </CommonModal>
</template>

<style scoped lang="scss">
.dialog {
  width: 100%;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  > header {
    font-size: 1.5rem;
    text-align: center;
  }
  > main {
    padding: 1rem 0.5rem;
    font-size: 1.1rem;
  }
  > footer {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;

    > .btn {
      flex: 1;
    }
  }
  &-title {
    font-weight: bold;
    font-size: 1.25rem;
  }
}
</style>
