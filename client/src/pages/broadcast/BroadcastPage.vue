<script setup lang="ts">
import { useDebounceFn, useDevicesList } from '@vueuse/core';
import { isAndroid } from '@/utils/browser.util';
import { FlipCamera, Power } from '@icon-park/vue-next';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/useUserStore';
import { generateRandomString } from '@/utils/string';
import { useClientBackPressed } from '@/commands/useClientBackPressed';

definePage({
  name: '直播中',
  path: '/broadcast',
});

const userStore = useUserStore();

// 注意要使用 nginx 将 /srs/ 转发到 srs 的 1985 端口
const tempId = generateRandomString(1);
let whipUrl = computed(
  () => `/srs/rtc/v1/whip/?app=room_${userStore.userInfo.id || 0}_${tempId}&stream=livestream`
);

const { videoInputs: cameras, audioInputs: microphones } = useDevicesList({
  requestPermissions: true,
});
const currentCamera = ref<MediaDeviceInfo>();
const currentMicrophone = ref<MediaDeviceInfo>();

function refreshVideoPlayback() {
  const vid = document.getElementById('vid') as HTMLVideoElement;
  console.log(vid);
  if (!vid) return;
  if (stream) {
    vid.srcObject = stream;
  } else {
    vid.srcObject = null;
  }
}

async function startVideo() {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  refreshVideoPlayback();
}

async function stopVideo() {
  stream?.getVideoTracks().forEach((v) => v.stop());
  stream = undefined;
  refreshVideoPlayback();
}

async function handleFlipCamera() {
  let newCamera: MediaDeviceInfo | undefined = undefined;
  if (currentCamera.value?.label.includes('front')) {
    // 改用后置镜头
    newCamera = cameras.value.find((v) => {
      console.log(v.deviceId, v.kind, v.label);
      return v.label.includes('back');
    });
    if (newCamera) {
      currentCamera.value = newCamera;
    }
  } else if (currentCamera.value?.label.includes('back')) {
    // 改用后置镜头
    newCamera = cameras.value.find((v) => {
      return v.label.includes('front');
    });
    if (newCamera) {
      currentCamera.value = newCamera;
    }
  } else {
    // 未知情况，往后切一一个摄像头
    newCamera = cameras.value.find((v) => {
      return v.kind === 'videoinput' && v.deviceId != currentCamera.value?.deviceId;
    });
  }

  if (newCamera) {
    // 取新的视频流
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: {
          exact: newCamera.deviceId,
        },
      },
      audio: true,
    });

    // 切换
    await videoSender.replaceTrack(newStream.getVideoTracks()[0]);
    stream = newStream;
    refreshVideoPlayback();
    window.AndroidInterface.showToast?.('已切换摄像头');
  } else {
    window.AndroidInterface.showToast?.('切换摄像头失败');
  }
}
const debounceFlipCamera = useDebounceFn(() => handleFlipCamera(), 500);

const router = useRouter();
async function handleQuit() {
  await clearEffects();
  if (isAndroid()) {
    window.AndroidInterface.quit?.();
  } else {
    router.back();
  }
}

// 关闭所有 effect
async function clearEffects() {
  // stopStreamEffect();
  pc.close();
  await stopVideo();
}

// const ffmpeg = new FFmpeg();
// let stopStreamEffect: WatchStopHandle;

// 视频 + 音频 多轨 流
let stream: MediaStream | undefined = undefined;
// rtc 连接
const pc = new RTCPeerConnection();
let videoSender: RTCRtpSender;

const liveState = ref(0);

async function initStreaming() {
  await startVideo();
  if (!stream) return;
  // 开始连接
  try {
    stream.getVideoTracks().forEach((track) => {
      const s = pc.addTrack(track);
      videoSender = s;
    });
    stream.getAudioTracks().forEach((track) => {
      const s = pc.addTrack(track);
    });

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const response = await fetch(whipUrl.value, {
      method: 'POST',
      headers: {
        // 'Content-Type': 'application/sdp',
        'Content-Type': 'application/json',
      },
      body: offer.sdp,
    });

    if (!response.ok) {
      throw new Error('Failed to send offer to WHIP server');
    }

    const answerSDP = await response.text();
    const answer = new RTCSessionDescription({
      type: 'answer',
      sdp: answerSDP,
    });

    await pc.setRemoteDescription(answer);
    console.log('Streaming started');
    window.AndroidInterface.showToast?.(`直播开始！${tempId}`, 'short');

    currentCamera.value = cameras.value[0];
    currentMicrophone.value = microphones.value[0];
  } catch (error) {
    console.error('Error starting streaming:', error);
    window.AndroidInterface.showToast?.('直播失败！', 'short');
    pc.close();
  }
}

useClientBackPressed(() => {
  clearEffects();
  window.AndroidInterface.quit?.();
  window.AndroidInterface.showToast?.('hello');
});

onMounted(async () => {
  // 初始化视频和音频输入
  if (!cameras.value.length) {
    // 无视频源
  }
  if (!microphones.value.length) {
    // 无音频源
  }
  await startVideo();
  await initStreaming();
});

onBeforeUnmount(async () => {
  await clearEffects();
});
</script>

<template>
  <div class="broadcast">
    <video class="video" controls autoplay muted id="vid" />
    <div class="layer">
      <div class="left-top">
        <div class="state"></div>
        <span>直播中</span>
      </div>
      <div class="icon right-top" @click="handleQuit">
        <Power />
      </div>
      <div class="icon right-bottom" @click="debounceFlipCamera">
        <FlipCamera />
      </div>
      {{ cameras }}
      ///
      {{ currentCamera }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/main';
.broadcast {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  .video {
    width: 100%;
    height: 100%;
    background: $color-primary;
  }
  .layer {
    position: absolute;
    z-index: 1;
    inset: 0;

    .icon {
      span {
        color: #fff;
        font-size: w(28px);
      }
    }

    .left-top {
      position: absolute;
      top: 1rem;
      left: 1rem;
      width: w(80px);
      height: w(40px);
      border-radius: w(40px);
      background: rgb(0 0 0 / 20%);
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      gap: w(5px);

      .state {
        width: w(10px);
        height: w(10px);
        border-radius: w(10px);
        background: $color-success;
      }
    }

    .right-top {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: w(40px);
      height: w(40px);
      border-radius: w(40px);
      background: rgb(0 0 0 / 20%);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .right-bottom {
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      width: w(40px);
      height: w(40px);
      border-radius: w(40px);
      background: rgb(0 0 0 / 20%);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

// ========== 隐藏 video 控件 ==========
/* 全屏按钮 */
video::-webkit-media-controls-fullscreen-button {
  display: none;
}
/* 播放按钮 */
video::-webkit-media-controls-play-button {
  display: none;
}
/* 进度条 */
video::-webkit-media-controls-timeline {
  display: none;
}
/* 观看的当前时间 */
video::-webkit-media-controls-current-time-display {
  display: none;
}
/* 剩余时间 */
video::-webkit-media-controls-time-remaining-display {
  display: none;
}
/* 音量按钮 */
video::-webkit-media-controls-mute-button {
  display: none;
}
video::-webkit-media-controls-toggle-closed-captions-button {
  display: none;
}
/* 音量的控制条 */
video::-webkit-media-controls-volume-slider {
  display: none;
}
/* 所有控件 */
video::-webkit-media-controls-enclosure {
  display: none;
}
</style>
