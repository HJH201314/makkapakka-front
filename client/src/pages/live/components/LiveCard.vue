<template>
  <div class="outer">
    <div class="header">
      <div class="left">
        <a-avatar class="avatar" :size="44" icon="user" :src="avatar" />
      </div>
      <!--      昵称，日期等-->
      <div class="mid">
        <div class="name">{{ name }}</div>
        <div class="date">2021-10-01</div>
      </div>
      <!--      多功能按钮-->
      <div class="right">
        <MoreOutlined :style="{ fontSize: '1.3rem' }" />
      </div>
    </div>
    <div class="main">
      <div class="cover">
        <Living :cover-url="coverURL" :is-live="false" />
      </div>
      <div class="title">{{ title }}</div>
    </div>
    <div class="footer">
      <div class="left">
        <LikeOutlined :style="{ color: 'red' }" />
        <span>11</span>
      </div>
      <div class="mid">
        <CommentOutlined />
        <span>11</span>
      </div>
      <div class="right">
        <ShareAltOutlined />
        <span>11</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Living from '@/pages/live/components/living.vue';
import {
  CommentOutlined,
  LikeOutlined,
  MoreOutlined,
  ShareAltOutlined,
} from '@ant-design/icons-vue';

const props = defineProps({
  avatar: String,
  name: String,
  coverURL: String,
  title: String,
});
</script>

<style scoped lang="scss">
.outer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100vw;
  height: auto;
  border-radius: 0.5rem;
  background-color: white;
  box-sizing: border-box; // 内边距和边框不会增加元素的尺寸
  filter: drop-shadow(0 0 0.2rem rgba(0, 0, 0, 0.1));
  padding: 0.6rem;
}

.header {
  display: flex;
  align-items: center;
  margin: 0 0 0.6rem;

  .left {
    display: flex;
    flex: 1;
    justify-content: flex-start;
    align-items: center;
  }

  .mid {
    display: flex;
    flex: 6;
    flex-direction: column;
    margin-left: 0.8rem;

    .name {
      font-size: 1rem;
    }

    .date {
      font-size: 0.8rem;
      color: #999;
    }
  }

  .right {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    align-items: center;
  }
}

.main {
  margin-bottom: 0.6rem;

  .title {
    font-size: 1rem;
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;

  span {
    margin-left: 0.2rem;
  }

  .left {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
  }

  .mid {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
  }

  .right {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
  }
}
</style>
