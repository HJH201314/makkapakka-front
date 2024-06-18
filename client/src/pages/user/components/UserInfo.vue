<template>
  <!--    用户信息，包含：头像、粉丝数据、关注按钮、用户名、简介-->
  <div class="info">
    <div class="top">
      <div class="left">
        <!--todo        点击预览和保存-->
        <a-avatar class="avatar" :size="100" icon="user" :src="avatar" />
      </div>
      <div class="right">
        <div class="data">
          <div class="fans">
            <span class="title">粉丝</span>
            <span class="data">{{ fans }}</span>
          </div>
          <div class="time">
            <span class="title">直播时长</span>
            <span class="data">{{ time }}</span>
          </div>
        </div>
        <CusButton
          v-if="!isMyself"
          id="follow"
          class="button"
          @click="onFollow()"
          :style="{ backgroundColor: followColor }"
          >{{ followed ? '已关注' : '关注' }}
        </CusButton>
        <CusButton v-else type="primary" id="appointment" class="button" @click="onPost">
          发布预约
        </CusButton>
      </div>
    </div>
    <div class="detail">
      <div class="name">{{ name }}</div>
      <div class="desc">{{ desc }}</div>
    </div>
    <transition name="slide">
      <PostAppointment v-show="isOnPost" :appointed="appointed" @closePost="closePost" />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import colors from '@/assets/variables.module.scss';
import { Avatar as AAvatar } from 'ant-design-vue';
import PostAppointment from '@/pages/user/components/postAppointment.vue';
import { confirm_layer } from '@/commands/confirm_layer';

const props = defineProps<{
  // 是否是自己
  isMyself: boolean;
  avatar: string;
  fans: number;
  time: string;
  name: string;
  desc: string;
  followed: boolean;
  appointed: boolean;
}>();

let followColor = ref(props.followed ? colors.colorSecondary : colors.colorPrimary);
let followed = ref(props.followed);
let fans = ref(props.fans);
let time = ref(props.time);

// 点击关注
const emit = defineEmits(['update:fans']);
let onFollow = (): void => {
  followed.value = !followed.value;
  followColor.value = followed.value ? colors.colorSecondary : colors.colorPrimary;
  if (followed.value) {
    fans.value++;
  } else {
    fans.value--;
  }
  emit('update:fans', fans.value);
};

// 关闭预约框
const closePost = () => {
  isOnPost.value = false;
  console.log(isOnPost.value);
};

// 发布预约
let isOnPost = ref(false);
let onPost = () => {
  console.log('发布预约');
  const div = confirm_layer();
  isOnPost.value = true;
  div.addEventListener('click', () => {
    isOnPost.value = false;
  });
};
</script>

<style scoped lang="scss">
@import '@/assets/main';

.info {
  display: flex;
  flex-direction: column;
  width: w(375px);
  height: auto;
  background-color: #fff;
  border-bottom: rgba(0, 0, 0, 0.1) 1px solid;
  box-sizing: border-box;
  //filter: drop-shadow(0 0 0.2rem white);

  .top {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 0 0 0.6rem;

    .left {
      height: auto;
      display: flex;
      flex: 2;
      justify-content: center;
      align-items: center;

      .avatar {
        top: -1.5rem;
        position: relative;
      }
    }

    .right {
      height: auto;
      display: flex;
      flex: 3;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: -1.5rem 1rem 0 1rem;

      .data {
        width: 100%;
        display: flex;
        flex: 1;
        flex-direction: row;
        justify-content: space-around;
        margin-bottom: 0.2rem;

        .fans {
          width: 33.3%;
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        .time {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 1rem;
        }

        .follow {
          width: 33.3%;
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        .likes {
          width: 33.3%;
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        .title {
          font-size: 0.6rem;
          margin-bottom: 0.1rem;
        }

        .data {
          font-size: 1rem;
          color: $color-primary;
        }
      }

      .button {
        width: 100%;
        position: relative;
        color: white;
        letter-spacing: 0.4rem;
      }
    }
  }

  .detail {
    display: flex;
    flex-direction: column;
    text-align: left;
    margin: 0 1rem 0.8rem 1rem;

    .name {
      font-size: 1.3rem;
      font-weight: normal;
      color: $color-primary;
      margin-bottom: 0.6rem;
    }

    .desc {
      font-size: 0.8rem;
    }
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(100%);
}
</style>
