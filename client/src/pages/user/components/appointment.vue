<template>
  <div>
    <div v-if="show" class="layer" @click="closeNotification"></div>
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
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import colors from '@/assets/variables.module.scss';
import { Button, notification } from 'ant-design-vue';

const props = defineProps<{
  isMyself: boolean;
  title: String;
  date: Date;
  appointed: boolean;
}>();
let date = ref(new Date(props.date || new Date()));
let appointed = ref(props.appointed);
let buttonWords = ref(appointed.value ? '已预约' : '预约');
let buttonColor = ref(appointed.value ? colors.colorSecondary : colors.colorPrimary);

// 显示蒙层
const show = ref(false);

const notificationKey = 'key';
const openNotification = (isWithdraw: boolean) => {
  let msg = '';
  if (isWithdraw) {
    msg = '撤销预约?';
  } else {
    msg = '取消预约?';
  }
  notification.open({
    key: notificationKey,
    message: msg,
    description: isWithdraw ? '撤销后，将通知已预约的用户。' : '确定要取消预约吗?',
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
            if (isWithdraw) {
              appointed.value = !appointed.value;
            } else {
              buttonWords.value = '预约';
            }
            buttonColor.value = colors.colorPrimary;
            // 关闭通知
            notification.close(notificationKey);
            show.value = false;
          },
        },
        { default: () => '确定' }
      ),
    onClose: () => {
      show.value = false;
    },
  });
};
/* 预约直播 - 用户 */
const onAppoint = () => {
  if (appointed.value) {
    // 取消预约
    show.value = true;
    openNotification(false);
    console.log('取消预约');
  } else {
    window.AndroidInterface?.subscribeNextBroadcast?.(new Date().getTime(), '预约的直播');
    appointed.value = !appointed.value;
    buttonWords.value = '已预约';
    console.log('预约成功');
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
  show.value = true; // 显示蒙层
  openNotification(true);
};

const closeNotification = () => {
  show.value = false;
  notification.close(notificationKey);
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
.layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 98;
}

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
