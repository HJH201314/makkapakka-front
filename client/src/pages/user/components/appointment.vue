<template>
  <div class="outer">
    <div class="container">
      <div class="left">
        <div class="title">直播预约：{{ title }}</div>
        <div class="time">{{ dateString }} 进行直播</div>
      </div>
      <div class="right">
        <button
          v-if="isMyself"
          id="withdraw"
          class="button"
          :style="{ backgroundColor: colors.colorPrimary }"
          @click="openWithdrawNotification()"
        >
          {{ '撤销' }}
        </button>
        <button
          v-else
          id="appoint"
          class="button"
          @click="onAppoint()"
          :style="{ backgroundColor: buttonColor }"
        >
          {{ buttonWords }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import colors from '@/assets/variables.module.scss';
import { Button, notification } from 'ant-design-vue';
import { confirm_layer } from '@/commands/confirm_layer';

const props = defineProps<{
  isMyself: boolean;
  title: String;
  date: Date;
  appointed: boolean;
}>();
let date = ref(new Date(props.date || new Date()));
let appointed = ref(props.appointed);
let buttonWords = ref(appointed.value ? '已预约' : '预约');
let buttonColor = computed(() => (appointed.value ? colors.colorSecondary : colors.colorPrimary));

/* 预约直播 - 用户 */
const onAppoint = () => {
  if (appointed.value) {
    const key = 'appoint';
    const div = confirm_layer();
    notification.open({
      key,
      message: '取消预约',
      description: '是否取消预约？',
      placement: 'bottom',
      duration: null,
      btn: () =>
        h(
          Button,
          {
            type: 'primary',
            size: 'small',
            style: `background-color: ${colors.colorPrimary}; border-color: ${colors.colorPrimary};`,
            onClick: () => {
              // todo 取消预约
              notification.close(key);
              appointed.value = !appointed.value;
              buttonWords.value = '预约';
              div.remove();
            },
          },
          { default: () => '确定' }
        ),
      onClose: () => {
        div.remove();
      },
    });
    div.addEventListener('click', () => {
      notification.close(key);
    });
    console.log('取消预约');
  } else {
    appointed.value = !appointed.value;
    buttonWords.value = '已预约';
    console.log('预约成功');
    // todo 预约成功
    window.AndroidInterface.subscribeNextBroadcast?.(Date.now(), 'aaa');
  }
};

// notification 全局配置
notification.config({
  maxCount: 1,
});

/*撤销预约 - 主播 */
const emit = defineEmits(['update:appointed']);
const openWithdrawNotification = () => {
  console.log('撤销预约');
  const key = 'withdraw';
  const div = confirm_layer();
  notification.open({
    key,
    message: '撤销预约？',
    description: '撤销后，将通知已预约的用户。',
    placement: 'bottom',
    duration: null,
    btn: () =>
      h(
        Button,
        {
          type: 'primary',
          size: 'small',
          style: `background-color: ${colors.colorPrimary}; border-color: ${colors.colorPrimary};`,
          onClick: () => {
            // todo 撤销预约
            notification.close(key);
            div.remove();
            emit('update:appointed', false);
          },
        },
        { default: () => '确定' }
      ),
    onClose: () => {
      div.remove();
    },
  });
  div.addEventListener('click', () => {
    notification.close(key);
  });
};

/* 日期换算-今天、明天、、*/
function formatAppointmentTime(date: Date) {
  let today = new Date().getDate();
  let day = date.getDate();
  let month = date.getMonth();
  let hour = date.getHours();
  // 两位数字
  let minute = date.getMinutes().toString().padStart(2, '0');
  if (today === day) {
    return `今天 ${hour}:${minute}`;
  } else if (today + 1 === day) {
    return `明天 ${hour}:${minute}`;
  }
  return `${month}月${day}日 ${hour}:${minute}`;
}

let dateString = ref(formatAppointmentTime(date.value));
</script>

<style scoped lang="scss">
.outer {
  //display: flex;
  padding: 0.6rem;
  background-color: white;

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem;
    background-color: #f2f3f5;
    border-radius: 0.3rem;

    .left {
      display: flex;
      flex: 3;
      flex-direction: column;

      .title {
        font-size: 0.8rem;
        margin-bottom: 0.4rem;
      }

      .time {
        margin-bottom: 0.4rem;
      }

      .time,
      .num {
        font-size: 0.6rem;
        color: #999;
      }

      .detail {
        display: flex;
        justify-content: space-between;
        font-size: 0.6rem;
        color: #999;
      }
    }

    .right {
      display: flex;
      flex: 1;
      justify-content: center;

      .button {
        width: 60%;
        height: 1.5rem;
        color: white;
        font-size: 0.7rem;
        letter-spacing: 0.1rem;
        border: none;
        border-radius: 0.3rem;
      }
    }
  }
}
</style>
