<script setup lang="ts">
// 定义组件的属性
const props = defineProps({
  coverUrl: String,
  videoUrl: String,
  title: String,
  isLive: {
    type: Boolean,
    default: true,
  },
});

function handleClick() {
  if (props.videoUrl) {
    window.open(props.videoUrl);
  }
}
</script>

<template>
  <div class="card" @click="handleClick">
    <div v-if="isLive" class="live-indicator">
      <div class="live-text">
        <span style="--i: 1">直</span>
        <span style="--i: 2">播</span>
        <span style="--i: 3">中</span>
        <span style="--i: 4">~</span>
      </div>
    </div>
    <div v-else class="live-indicator">
      <div class="end-text">已结束</div>
    </div>
    <h3>{{ title }}</h3>
    <img :src="coverUrl" alt="直播间封面" />
  </div>
</template>

<style scoped lang="scss">
.card {
  width: 94%;
  height: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  position: relative;
}

.live-indicator {
  position: absolute;
  top: 0;
  right: 0;
  background-color: red;
  padding: 0.5em;
  border-radius: 0 0 0 4px;
  color: white;
  font-size: 0.8rem;
}

.live-text {
  color: white;
  text-align: center;
  width: 4rem;

  span {
    display: inline-block;
    animation: float 1s ease-in-out infinite;
    animation-delay: calc(0.1s * var(--i));
  }
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  20% {
    transform: translateY(-5px);
  }
  40%,
  100% {
    transform: translateY(0);
  }
}

.end-text {
  color: white;
  width: 4rem;
  text-align: center;
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
