<script setup lang="ts">
import { ref } from 'vue';

// 定义组件的属性
const props = defineProps({
  coverUrl: String,
  videoUrl: String,
  title: String,
  isLive: {
    type:Boolean,
    default: true
  }
});

function handleClick() {
  if(props.videoUrl) {
    window.open(props.videoUrl);
  }
}

</script>

<template>
  <div class="card" @click="handleClick" >
    <div v-if="isLive" class="live-indicator">
      <div class="live-text">直播中~</div>
    </div>
    <h3>{{ title }}</h3>
    <img :src="coverUrl" alt="直播间封面">
  </div>
</template>

<style scoped lang="scss">
.card {
  width: 75%;
  height: 8em;
  border: 1px solid #ccc;
  border-radius: 4px;
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
  //animation: blink 1s infinite alternate;
}

.live-text {
  color: white;
  animation: float 2s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes blink {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
