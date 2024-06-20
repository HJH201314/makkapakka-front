<script setup lang="ts">
import UserInfo from '@/pages/user/components/UserInfo.vue';
import { LeftOutlined } from '@ant-design/icons-vue';
import { useUserStore } from '@/stores/useUserStore';
import { useIntersectionObserver } from '@vueuse/core';
import Appointment from '@/pages/user/components/appointment.vue';
import { useClientBackPressed } from '@/commands/useClientBackPressed';
import { createRequest10006, createRequest8088 } from '@/api/base';

definePage({
  path: '/user/home',
  name: '用户 - 直播页',
});

onMounted(() => {
  // todo 发送room请求，创建直播间
  // uid
  // number
  // name
  // desc
  createRoom();
});

async function createRoom() {
  try {
    const roomInfo = await createRequest10006('/room', {
      method: 'POST',
      data: JSON.stringify({
        uid: userInfo.id,
        name: userInfo.name,
        number: 0,
        detail: '',
      }),
    });
  } catch (e) {
    console.error(e);
  }
}

// 观测页面顶部是否移出
const realPageTopRef = ref();
useIntersectionObserver(realPageTopRef, ([{ isIntersecting }]) => {
  if (!isIntersecting) {
    // ignore
  }
});

const userInfo = useUserStore().userInfo;
const fans = ref(userInfo.fans || 0);
const likes = ref(userInfo.likes || 0);
const time = ref(userInfo.streamTime || 0);
const name = ref(userInfo.name || '未命名用户');
const avatarUrl = ref(userInfo.avatarUrl || 'https://img2.imgtp.com/2024/04/11/Qer8kHaD.jpg');
const coverURL = ref(userInfo.coverUrl || 'https://img2.imgtp.com/2024/04/11/Qer8kHaD.jpg');

// todo 获取预约信息
const date = ref('');
const appointed = ref(false);

async function getAppointment() {
  try {
    const appointment = await createRequest8088(`/subscribe/${userInfo.id}`, {
      method: 'GET',
      params: {
        uid: userInfo.id,
      },
    });
    if (appointment) {
      appointed.value = true;
      date.value = '2021-10-10 10:10:10';
      //appointment.data.date;
    }
  } catch (e) {
    console.error(e);
  }
}

// 当前页面uid
const params = useUrlSearchParams('history', {
  initialValue: {
    uid: 0,
  },
});
const isMyself = ref(userInfo.id === params.uid);

useClientBackPressed(() => {
  window.AndroidInterface?.quit?.();
});

// 返回
function goBack() {
  window.AndroidInterface?.quit?.();
}
</script>

<template>
  <div class="user-page">
    <!--    用户信息，包含：头像、粉丝数据、关注按钮、用户名、简介-->
    <img
      style="position: absolute; width: 100vw; z-index: -1"
      src="https://img2.imgtp.com/2024/04/11/nmd5j2r5.jpg"
      class="test"
      alt=""
    />
    <div class="toolbar">
      <!-- 返回按钮 -->
      <div class="back-icon">
        <LeftOutlined style="color: white" @click="goBack" />
      </div>
    </div>
    <div class="real-page">
      <div
        ref="realPageTopRef"
        style="margin-top: 10rem; box-shadow: 0 -5px 20px 10px rgba(0, 0, 0, 0.23)"
      ></div>
      <UserInfo
        :is-myself="isMyself"
        :avatar="userInfo.avatarUrl || avatarUrl"
        :appointed="appointed"
        v-model:fans="fans"
        v-model:likes="likes"
        v-model:time="time"
        :name="userInfo.name || name"
        :desc="userInfo.description || '啊哦，这个直播间还没有介绍 TAT'"
        :followed="false"
      />
      <div class="white-area">
        <div>
          <Appointment
            v-if="appointed"
            :is-myself="isMyself"
            :title="name"
            :date="date"
            v-model:appointed="appointed"
          />
        </div>
        <!--        todo 历史记录-->
        <!--        <div class="living">-->
        <!--          <LiveCard-->
        <!--            :avatar="userInfo.avatarUrl || avatarUrl"-->
        <!--            :name="userInfo.name || name"-->
        <!--            :coverURL="coverURL"-->
        <!--            title="嘿嘿嘿"-->
        <!--          />-->
        <!--        </div>-->
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/main';

.user-page {
  display: flex;
  flex: 1;
  height: 100vh;
  width: 100vw;
  position: relative;
  flex-direction: column;

  .toolbar {
    z-index: 10;
    position: fixed;
    top: 1rem;
    left: 0;
    right: 0;
    padding: 1rem;
    display: flex;

    .back-icon {
      height: 2rem;
      width: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.23);
    }
  }

  .real-page {
    overflow: auto;

    .white-area {
      background: white;
      display: flex;
      flex-direction: column;
      column-gap: 1rem;

      .living {
        display: flex;
        flex-direction: column;
        //row-gap: 1rem;
      }
    }
  }
}
</style>
