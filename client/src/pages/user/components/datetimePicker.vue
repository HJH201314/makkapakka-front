<template>
  <div>
    <div class="layer" @click="emitClose"></div>
    <div class="outer">
      <div class="header">
        <button class="cancel" @click="emitClose">取消</button>
        <span class="title">选择开播时间</span>
      </div>
      <div class="main">
        <div class="cover"></div>
        <div class="col month" ref="monthRef" @scroll="monthScroll">
          <ul>
            <li class="extra-space-top"></li>
            <li v-for="i in months" :key="i">{{ i }}月</li>
            <li class="extra-space-bottom"></li>
          </ul>
        </div>
        <div class="col day" ref="dayRef" @scroll="dayScroll">
          <ul>
            <li class="extra-space-top"></li>
            <li v-for="i in days" :key="i">{{ i }}日</li>
            <li class="extra-space-bottom"></li>
          </ul>
        </div>
        <div class="hour col" ref="hourRef" @scroll="hourScroll">
          <ul>
            <li class="extra-space-top"></li>
            <li v-for="i in hours" :key="i">
              {{ i }}
            </li>
            <li class="extra-space-bottom"></li>
          </ul>
        </div>
        <div class="minute col" ref="minuteRef" @scroll="minuteScroll">
          <ul>
            <li class="extra-space-top"></li>
            <li v-for="i in minutes" :key="i">
              {{ i }}
            </li>
            <li class="extra-space-bottom"></li>
          </ul>
        </div>
      </div>
      <div class="footer">
        <button class="confirm" @click="confirm">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  isOpen?: boolean;
}>();
const emit = defineEmits(['selectedTime', 'close-picker']);
const emitClose = () => {
  emit('close-picker');
};
// 发送时间到父组件
const confirm = () => {
  selectedTime.value = {
    month: selectedMonth.value,
    day: selectedDay.value,
    hour: selectedHour.value,
    minute: selectedMinute.value,
  };
  console.log(selectedTime.value);
  emit('selectedTime', selectedTime);
  emitClose();
};
const monthRef = ref(null);
const dayRef = ref(null);
const hourRef = ref(null);
const minuteRef = ref(null);

const curYear = ref(new Date().getFullYear());
const curMonth = ref(new Date().getMonth() + 1);
const curDay = ref(new Date().getDate());
const curHour = ref(new Date().getHours());
const curMinute = ref(new Date().getMinutes());
const selectedMonth = ref(curMonth.value);
const selectedDay = ref(curDay.value);
const selectedHour = ref(curHour.value);
const selectedMinute = ref(curMinute.value);
const selectedTime = ref({
  month: curMonth.value,
  day: curDay.value,
  hour: curHour.value,
  minute: curMinute.value,
});
let intervalId = null;

onMounted(() => {
  monthScroll({ target: monthRef.value });
  dayScroll({ target: dayRef.value });
  hourScroll({ target: hourRef.value });
  minuteScroll({ target: minuteRef.value });

  intervalId = setInterval(() => {
    curMinute.value = new Date().getMinutes();
  }, 60000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

// 月份, 从当前月开始
const months = Array.from({ length: 12 }, (_, i) => i + 1).filter((item) => item >= curMonth.value);
let monthTimer = null; // 月份滚动定时器
const monthScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  const lis = target.getElementsByTagName('li');
  const cover = document.querySelector('.cover') as HTMLElement;
  const coverMiddle = cover.offsetTop + cover.offsetHeight / 2;
  let closestLis = null;
  let cnt = 0;
  for (let i = 1; i < lis.length - 1; i++) {
    if (
      lis[i].offsetTop - target.scrollTop <= coverMiddle &&
      lis[i].offsetTop - target.scrollTop + lis[i].offsetHeight > coverMiddle
    ) {
      lis[i].classList.add('selected');
      selectedMonth.value = months[i - 1];
      closestLis = lis[i];
      cnt = i - 1;
    } else {
      lis[i].classList.remove('selected');
    }
  }
  if (monthTimer) {
    clearTimeout(monthTimer);
  }
  monthTimer = setTimeout(() => {
    if (closestLis) {
      target.scrollTo({
        top: closestLis.offsetHeight * cnt,
        behavior: 'smooth',
      });
    }
  }, 1000);
};

// 判断是否为闰年
const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

const day = ref(31);
// 计算所选月份的天数
const days = computed(() => {
  if (selectedMonth.value === 2) {
    if (isLeapYear(curYear.value)) {
      day.value = 29;
    } else {
      day.value = 28;
    }
  } else {
    if ([1, 3, 5, 7, 8, 10, 12].includes(selectedMonth.value)) {
      day.value = 31;
    } else {
      day.value = 30;
    }
  }
  // 如果是本月, 则减去过去的天数
  if (selectedMonth.value === curMonth.value) {
    return Array.from({ length: day.value }, (_, i) => i + 1).filter(
      (item) => item >= curDay.value
    );
  } else {
    return Array.from({ length: day.value }, (_, i) => i + 1);
  }
});

let dayTimer = null;
const dayScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  const lis = target.getElementsByTagName('li');
  const cover = document.querySelector('.cover') as HTMLElement;
  const coverMiddle = cover.offsetTop + cover.offsetHeight / 2;
  let closestLis = null;
  let cnt = 0;
  for (let i = 1; i < lis.length - 1; i++) {
    if (
      lis[i].offsetTop - target.scrollTop <= coverMiddle &&
      lis[i].offsetTop - target.scrollTop + lis[i].offsetHeight > coverMiddle
    ) {
      lis[i].classList.add('selected');
      selectedDay.value = days.value[i - 1];
      closestLis = lis[i];
      cnt = i - 1;
    } else {
      lis[i].classList.remove('selected');
    }
  }
  if (dayTimer) {
    clearTimeout(dayTimer);
  }

  dayTimer = setTimeout(() => {
    if (closestLis) {
      target.scrollTo({
        top: closestLis.offsetHeight * cnt,
        behavior: 'smooth',
      });
    }
  }, 1000);
};

const hours = computed(() =>
  selectedMonth.value === curMonth.value && selectedDay.value === curDay.value
    ? Array.from({ length: 24 }, (_, i) => i).filter(
        (item) => item > curHour.value || (item === curHour.value && curMinute.value < 55)
      )
    : Array.from({ length: 24 }, (_, i) => i)
);
let hourTimer = null;
const hourScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  const lis = target.getElementsByTagName('li');
  const cover = document.querySelector('.cover') as HTMLElement;
  const coverMiddle = cover.offsetTop + cover.offsetHeight / 2;
  let closestLis = null;
  let cnt = 0;
  for (let i = 1; i < lis.length - 1; i++) {
    if (
      lis[i].offsetTop - target.scrollTop <= coverMiddle &&
      lis[i].offsetTop - target.scrollTop + lis[i].offsetHeight > coverMiddle
    ) {
      lis[i].classList.add('selected');
      selectedHour.value = hours.value[i - 1];
      closestLis = lis[i];
      cnt = i - 1;
    } else {
      lis[i].classList.remove('selected');
    }
  }

  if (hourTimer) {
    clearTimeout(hourTimer);
  }
  hourTimer = setTimeout(() => {
    if (closestLis) {
      target.scrollTo({
        top: closestLis.offsetHeight * cnt,
        behavior: 'smooth',
      });
    }
  }, 1000);
};

// 5分钟一个间隔
const minutes = computed(() =>
  selectedMonth.value === curMonth.value &&
  selectedDay.value === curDay.value &&
  selectedHour.value === curHour.value
    ? Array.from({ length: 60 }, (_, i) => i)
        .filter((item) => item >= curMinute.value + 5)
        .map((item) => String(item).padStart(2, '0'))
    : Array.from({ length: 60 }, (_, i) => i)
        .filter((item) => item + 1)
        .map((item) => String(item).padStart(2, '0'))
);
let minuteTimer = null;
const minuteScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  const lis = target.getElementsByTagName('li');
  const cover = document.querySelector('.cover') as HTMLElement;
  const coverMiddle = cover.offsetTop + cover.offsetHeight / 2;
  let closestLis = null;
  let cnt = 0;
  for (let i = 1; i < lis.length - 1; i++) {
    if (
      lis[i].offsetTop - target.scrollTop <= coverMiddle &&
      lis[i].offsetTop - target.scrollTop + lis[i].offsetHeight > coverMiddle
    ) {
      lis[i].classList.add('selected');
      selectedMinute.value = Number(minutes.value[i - 1]);
      closestLis = lis[i];
      cnt = i - 1;
    } else {
      lis[i].classList.remove('selected');
    }
  }

  if (minuteTimer) {
    clearTimeout(minuteTimer);
  }
  minuteTimer = setTimeout(() => {
    if (closestLis) {
      target.scrollTo({
        top: closestLis.offsetHeight * cnt,
        behavior: 'smooth',
      });
    }
  }, 1000);
};

watch(selectedMonth, () => {
  dayScroll({ target: dayRef.value });
});

watch(selectedDay, () => {
  hourScroll({ target: hourRef.value });
});

watch(selectedHour, () => {
  minuteScroll({ target: minuteRef.value });
});
</script>

<style scoped lang="scss">
@import '@/assets/main';

* {
  box-sizing: border-box;
}

.layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99;
}

.outer {
  width: w(375px);
  position: fixed;
  bottom: 0;
  z-index: 100;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 1rem 1rem 0 0;

  .header {
    width: 100%;
    border-radius: 1rem 1rem 0 0;
    background-color: #ffffff;
    text-align: center;
    border-bottom: 1px solid #f2f3f5;
    font-size: 1.1rem;
    padding: 0.8rem 0 0.8rem 0;
    display: flex;
    justify-content: space-between;
    position: relative;

    .cancel {
      z-index: 2;
      display: flex;
      justify-content: center;
      padding: 0 1rem;
      font-size: 0.8rem;
      background-color: #fff;
      border: none;
      color: $color-primary;
    }

    .title {
      position: absolute;
      width: 100%;
      padding: 0;
      margin: 0;
    }
  }

  .main {
    background-color: #fff;
    display: flex;
    bottom: 0;
    height: 10rem;
    width: 100%;
    padding: 0 1rem 0 1rem;
    position: relative;
    justify-content: center;
    color: rgba(0, 0, 0, 0.5);
    letter-spacing: 0.1rem;

    .cover {
      margin-top: 4rem;
      width: 95%;
      background-color: $color-grey-300;
      height: 1.5rem;
      position: absolute;
      z-index: 1;
      border-radius: 0.2rem;
    }

    .col {
      position: relative;
      z-index: 2;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      overflow-y: scroll;
      touch-action: pan-y;
      -webkit-overflow-scrolling: touch;
    }

    .month {
    }

    .day {
    }

    .hour {
    }

    .minute {
    }

    ul {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      width: 100%;
      padding: 0;
      margin: 0;

      li {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        line-height: 1.5rem;
        list-style: none;
      }
    }

    /* 隐藏滚动条 */
    .month::-webkit-scrollbar,
    .day::-webkit-scrollbar,
    .hour::-webkit-scrollbar,
    .minute::-webkit-scrollbar {
      display: none;
    }

    .selected {
      color: black;
      font-weight: 400;
      opacity: 1 !important;
    }
  }

  .footer {
    background-color: #fff;
    display: flex;
    justify-content: center;
    height: 5rem;

    .confirm {
      margin-top: 1rem;
      width: 90%;
      height: 2.5rem;
      background-color: $color-primary;
      color: #fff;
      font-size: 1rem;
      border: none;
      border-radius: 0.4rem;
    }
  }

  .extra-space {
    &-top {
      height: 4rem;
    }

    &-bottom {
      height: 4.5rem;
    }
  }
}
</style>
