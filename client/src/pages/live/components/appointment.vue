<template>
  <div class = "outer">
    <div class = "left">
      <div class = "title">直播预约：{{ title }}</div>
      <div class = "time">{{ dateString }} 进行直播</div>
      <div class = "num">{{ num }} 人预约</div>
    </div>
    <div class = "right">
      <CusButton
        id = "appoint"
        class = "button"
        @click = "onAppoint()"
        :color = "buttonColor"
        :type = "'primary'"
        :primary = "!appointed"
        :secondary = "appointed"
      >
        {{ appointed ? '已预约' : '预约' }}
      </CusButton>
    </div>
  </div>
</template>

<script setup lang = "ts">
import {computed, defineProps, ref} from 'vue';
import colors from '@/assets/variables.module.scss';

const props = defineProps({
  title: String,
  date: Date,
  num: Number,
  appointed: Boolean,
});
let date = ref(new Date(props.date));
let dateString = ref('');
let appointed = ref(props.appointed);
let buttonColor = computed(() => (appointed.value ? colors.colorSecondary : colors.colorPrimary));
/* 预约直播 */
const onAppoint = () => {
  appointed.value = !appointed.value;
  if (!appointed.value) {
    console.log('取消预约');
  } else {
    console.log('预约成功');
  }
};

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

dateString.value = formatAppointmentTime(date.value)
</script>

<style scoped lang = "scss">
.outer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem;
  background-color: #f2f3f5;
  border-radius: 0.5rem;

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
      color: white;
      font-size: 0.6rem;
    }
  }
}
</style>
