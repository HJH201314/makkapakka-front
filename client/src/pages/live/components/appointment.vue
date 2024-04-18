<template>
  <div class="outer">
    <div class="container">
      <div class="left">
        <div class="title">直播预约：{{ title }}</div>
        <div class="time">{{ dateString }} 进行直播</div>
        <div class="num">{{ num }} 人预约</div>
      </div>
      <div class="right">
        <CusButton
          v-if="!isMyself"
          id="appoint"
          class="button"
          @click="onAppoint()"
          :color="buttonColor"
          :type="'primary'"
          :primary="!appointed"
          :secondary="appointed"
          >{{ appointed ? '已预约' : '预约' }}
        </CusButton>
        <CusButton v-else type="primary" id="withdraw" class="button" @click="onWithdraw()"
          >{{ '撤销' }}
        </CusButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref } from 'vue';
import colors from '@/assets/variables.module.scss';

const props = defineProps<{
  isMyself: boolean;
  title: String;
  date: Date;
  num: Number;
  appointed: boolean;
}>();
let num = ref(props.num ? props.num : 0);
let date = ref(new Date(props.date || new Date()));
let appointed = ref(props.appointed);
let buttonColor = computed(() => (appointed.value ? colors.colorSecondary : colors.colorPrimary));
/* 预约直播 */
const onAppoint = () => {
  appointed.value = !appointed.value;
  if (!appointed.value) {
    num.value = +num.value - 1;
    console.log('取消预约');
  } else {
    num.value = +num.value + 1;
    console.log('预约成功');
  }
};
/*撤销预约*/
const onWithdraw = () => {
  console.log('撤销预约');
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
        font-size: 0.6rem;
      }
    }
  }
}
</style>
