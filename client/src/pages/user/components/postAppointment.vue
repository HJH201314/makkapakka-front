<template>
  <div class="outer">
    <div class="header">
      <span>发布直播预约</span>
    </div>
    <div class="main">
      <div class="time">
        <div class="left">
          <span>时间</span>
        </div>
        <div class="right">
          <!--          todo 日期、时间选择器-->
          <div class="time" @click="openPicker"></div>
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
      <button class="button" @click="sendPost" :disabled="!time || !title">发布预约</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { createRequest } from '@/api/base';
import { useUserStore } from '@/stores/useUserStore';

const props = defineProps<{
  appointed: boolean;
}>();

const userInfo = useUserStore().userInfo;
const rid = ref(''); // 直播间id
const uid = userInfo.id; // 用户id
const time = ref(''); // 预约时间 "2023-5-10 10:10"
const title = ref(''); // 预约标题

// 发送预约请求
const sendPost = async () => {
  if (props.appointed) {
    window.AndroidInterface?.showToast?.('已超过预约上线');
    return;
  }
  console.log(title.value);
  // 设置时间格式
  time.value = time.value.replace('T', ' ');
  time.value = time.value.replace('-', ' ');
  console.log(time.value);

  // todo 发送请求并处理
  try {
    const response = await createRequest('/subscribe', {
      method: 'POST',
      data: {
        rid: rid.value,
        uid: uid.value,
        time: time.value,
        title: title.value,
      },
    });
    if (response.data.code === 200) {
      window.AndroidInterface?.showToast?.('发布成功');
    } else {
      window.AndroidInterface?.showToast?.('发布失败');
    }
  } catch (e) {
    window.AndroidInterface?.showToast?.('发布失败');
  }
};

// todo 打开日期、时间选择器
function openPicker() {
  console.log('打开日期、时间选择器');
}
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
    background-color: #ffffff;
    text-align: center;
    border-bottom: 1px solid #f2f3f5;
    font-size: 1.1rem;
    padding: 0.8rem;
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
