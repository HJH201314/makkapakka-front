<template>
  <div>
    <div class="layer"></div>
    <div class="outer">
      <div class="header">
        <button class="cancel" @click="closePost">取消</button>
        <span class="title">发布直播预约</span>
      </div>
      <div class="main">
        <div class="time">
          <div class="left">
            <span>时间</span>
          </div>
          <div class="right">
            <!--          todo 日期、时间选择器-->
            <div class="time" @click="openDateTimePicker">
              <span>{{ finalTime }}</span>
            </div>
          </div>
        </div>
        <div class="title">
          <div class="left">
            <span>标题</span>
          </div>
          <div class="right">
            <input type="text" placeholder="请填写标题" v-model="title" />
          </div>
        </div>
      </div>
      <div class="footer">
        <button class="button" @click="sendPost" :disabled="!title">发布预约</button>
      </div>
      <datetime-picker
        v-if="isSelectingDateTime"
        @close-picker="closePicker"
        @selectedTime="getTime"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { createRequest } from '@/api/base';
import { useUserStore } from '@/stores/useUserStore';
import DatetimePicker from '@/pages/user/components/datetimePicker.vue';

const props = defineProps<{
  appointed: boolean;
}>();

const userInfo = useUserStore().userInfo;
const rid = ref(''); // 直播间id
const uid = userInfo.id; // 用户id
const title = ref(''); // 预约标题
const isSelectingDateTime = ref(false);
const selectedTime = ref({
  month: new Date().getMonth() + 1,
  day: new Date().getDate(),
  hour: 20,
  minute: 0,
});
const finalTime = ref('');
// 发送预约请求
const sendPost = async () => {
  if (props.appointed) {
    window.AndroidInterface?.showToast?.('已超过预约上限');
    // 清空数据
    title.value = '';

    // 关闭预约框
    close();
    return;
  }

  // todo 发送请求并处理
  try {
    const response = await createRequest('/subscribe', {
      method: 'POST',
      data: {
        rid: rid.value,
        uid: uid,
        time: finalTime.value,
        title: title.value,
      },
    });
    if (response.code === 200) {
      window.AndroidInterface?.showToast?.('发布成功');
    } else {
      window.AndroidInterface?.showToast?.('发布失败');
    }
  } catch (e) {
    window.AndroidInterface?.showToast?.('发布失败');
  }
};

// 日期、时间选择器
const openDateTimePicker = () => {
  isSelectingDateTime.value = true;
};
const closePicker = () => {
  isSelectingDateTime.value = false;
};
const getTime = (time) => {
  selectedTime.value = time.value;
};
watchEffect(() => {
  finalTime.value = `${selectedTime.value.month}月${
    selectedTime.value.day
  }日 ${selectedTime.value.hour.toString().padStart(2, '0')}:${selectedTime.value.minute
    .toString()
    .padStart(2, '0')}`;
});

// todo 关闭预约框
const emit = defineEmits(['closePost']);
const closePost = () => {
  emit('closePost');
  console.log('关闭预约框');
};
</script>

<style scoped lang="scss">
@import '@/assets/main';

.outer {
  width: w(375px);
  position: fixed;
  bottom: 0;
  z-index: 99;
  border-radius: 1rem 1rem 0 0;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    width: 100%;

    .time {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 3rem;
      border-bottom: 1px solid #f2f3f5;

      datetime-picker {
        position: relative;
        top: 0;
        left: 0;
        z-index: 100;
      }

      .left {
        font-size: 0.8rem;
        padding: 0 1.5rem;
      }

      .right {
        width: 75%;
        padding: 0 1.5rem 0 0;

        input {
          width: 100%;
          height: 1.5rem;
          border-radius: 0.4rem;
          border: none;
          padding: 0.2rem;
        }
      }
    }

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 3rem;

      .left {
        font-size: 0.8rem;
        padding: 0 1.5rem;
      }

      .right {
        width: 75%;
        padding: 0 1.5rem 0 0;

        input {
          width: 100%;
          height: 1.5rem;
          border-radius: 0.4rem;
          padding: 0.2rem;
          font-size: 0.8rem;
          border: none;
        }
      }
    }
  }

  .footer {
    justify-content: center;
    align-content: center;
    align-items: center;
    display: flex;
    width: 100%;
    height: 7.5rem;
    background-color: #f2f3f5;

    .button {
      width: 90%;
      margin-top: 1rem;
      height: 2.5rem;
      border-radius: 0.4rem;
      background-color: $color-primary;
      color: #ffffff;
      border: none;
    }

    .button:disabled {
      background-color: $color-secondary;
      color: #ffffff;
    }
  }
}
</style>
