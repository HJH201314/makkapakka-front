<script setup lang="ts">
definePage({
  name: '视频测试',
  path: '/broadcast',
});

import { useDevicesList, useUserMedia } from '@vueuse/core';

const { videoInputs: cameras, audioInputs: microphones } = useDevicesList({
  requestPermissions: true,
});
const currentCamera = computed(() => cameras.value[0]?.deviceId);
const currentMicrophone = computed(() => microphones.value[0]?.deviceId);

const { stream, start, stop } = useUserMedia({
  constraints: {
    video: { deviceId: currentCamera.value },
    audio: { deviceId: currentMicrophone.value },
  },
});

async function startVideo() {
  await start();
  const vid = document.getElementById('vid') as HTMLVideoElement;
  console.log(vid);
  if (vid && stream.value) {
    vid.srcObject = stream.value;
  }
}

async function stopVideo() {
  stop();
  const vid = document.getElementById('vid') as HTMLVideoElement;
  if (vid) {
    vid.srcObject = null;
  }
}
</script>

<template>
  <div>
    <CusButton @click="startVideo"> 开启视频流 </CusButton>
    <CusButton @click="stopVideo"> 关闭视频流 </CusButton>
    <video controls autoplay id="vid" />
  </div>
</template>

<style scoped lang="less"></style>
