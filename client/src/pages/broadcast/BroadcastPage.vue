<script setup lang="ts">
import { useDebounceFn, useDevicesList } from '@vueuse/core';
import { Clipboard, FlipCamera, Power, Voice, VoiceOff } from '@icon-park/vue-next';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/useUserStore';
import { useClientBackPressed } from '@/commands/useClientBackPressed';
import { AndroidUtil } from '@/utils/android.util';
import { createRequest } from '@/api/base';
import { DialogManager } from '@/components/cus-ui/dialog';
import variables from '@/assets/variables.module.scss';
import { getDurationString } from '@/utils/time.util';

import adapter from 'webrtc-adapter';

definePage({
  name: '直播中',
  path: '/broadcast',
});

const userStore = useUserStore();

// 注意要使用 nginx 将 /srs/ 转发到 srs 的 1985 端口
const roomId = computed(
  () => `${(userStore.userInfo.id || 0) * 1000 + Math.floor(Math.random() * 100)}`
);
const whipUrl = computed(
  () => `/srs/rtc/v1/whip/?app=${roomId.value}&stream=livestream&eip=111.230.21.98:18000`
);

const { videoInputs: cameras, audioInputs: microphones } = useDevicesList({
  requestPermissions: true,
});
const currentCamera = ref<MediaDeviceInfo>();
const currentMicrophone = ref<MediaDeviceInfo>();

function refreshVideoPlayback() {
  const vid = document.getElementById('vid') as HTMLVideoElement;
  const vid2 = document.getElementById('vid2') as HTMLVideoElement;
  console.log(vid);
  if (!vid) return;
  if (stream) {
    vid.srcObject = stream;
    vid2.srcObject = stream;
  } else {
    vid.srcObject = null;
    vid2.srcObject = null;
  }
}

async function startVideo() {
  refreshVideoPlayback();
}

async function stopVideo() {
  stream.getVideoTracks().forEach((v) => v.stop());
  refreshVideoPlayback();
}

async function handleFlipCamera() {
  let newCamera: MediaDeviceInfo | undefined = undefined;
  if (currentCamera.value?.label.includes('front')) {
    // 若当前为前置摄像头，尝试寻找后置镜头
    newCamera = cameras.value.find((v) => {
      console.log(v.deviceId, v.kind, v.label);
      return v.label.includes('back');
    });
    if (newCamera) {
      currentCamera.value = newCamera;
    }
  } else if (currentCamera.value?.label.includes('back')) {
    // 若当前为后置摄像头，尝试寻找前置镜头
    newCamera = cameras.value.find((v) => {
      return v.label.includes('front');
    });
    if (newCamera) {
      currentCamera.value = newCamera;
    }
  } else {
    // 未知情况，随便切一一个摄像头
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
    AndroidUtil.showToast('已切换摄像头');
  } else {
    AndroidUtil.showToast('没有能切换的摄像头');
  }
}

function handleGoLive() {
  const url = new URL(window.location.href);
  url.pathname = '/audience';
  url.searchParams.set('rid', roomId.value);
  window.navigator.clipboard.writeText(url.href);
  AndroidUtil.showToast('已复制直播间链接');
}

const debounceFlipCamera = useDebounceFn(() => handleFlipCamera(), 500);

const router = useRouter();

async function handleStop(force: boolean = false) {
  if (!force) {
    const res = await DialogManager.commonDialog({
      title: '提示',
      content: '确定要退出直播吗？',
      confirmButtonProps: {
        color: variables.colorPrimary,
      },
      showCancel: true,
    });
    if (!res) return;
  }
  // 计算 hh:mm:ss
  const timeStr = getDurationString(startTime);
  await clearEffects();
  await router.replace({
    name: '直播结束',
    query: {
      title: `${userStore.userInfo.name}的直播`,
      duration: timeStr,
      subtitle: tolerance <= 0 ? '违规自动终止' : '直播已结束',
    },
  });
}

let tolerance = 2;
function reportImage(blob: Blob) {
  // 上报到图像识别
  const formData = new FormData();
  formData.append('file', new File([blob], `${roomId.value}.jpg`));
  fetch('/det/det', {
    method: 'POST',
    body: formData,
  })
    .then((res) => res.json())
    .then((res: any[]) => {
      // 有识别结果，发出警告
      if (res.length > 0) {
        if (tolerance <= 0) {
          clearEffects(); // 直接中断直播信号
          DialogManager.commonDialog({
            title: '警告',
            content: `警告次数超出限制，请立即停止直播！`,
            confirmButtonProps: {
              color: variables.colorDanger,
              text: '好吧',
            },
            showCancel: false,
          }).then(() => {
            AndroidUtil.showToast('触犯天条，直播终止！', 'long');
            handleStop(true);
          });
        } else {
          DialogManager.commonDialog({
            title: '警告',
            content: `检测到违规内容，${tolerance} 次警告后终止直播！`,
            confirmButtonProps: {
              color: variables.colorDanger,
              text: '知道了',
            },
            showCancel: false,
          });
          AndroidUtil.showToast(`检测到违规内容！${tolerance} 次警告后终止直播！`, 'long');
        }
        tolerance -= 1;
      }
    })
    .catch((e) => {
      console.error('Error in reportImage:', e);
    });
}

function handleRtcConnected() {
  reporter = window.setInterval(() => {
    console.debug('report');
    const canvas = document.createElement('canvas');
    const player = document.getElementById('vid') as HTMLVideoElement;
    canvas.width = player.videoWidth;
    canvas.height = player.videoHeight;
    canvas.getContext('2d')?.drawImage(document.getElementById('vid') as HTMLVideoElement, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        reportImage(blob); // 调用图像识别
      },
      'image/jpeg',
      0.5
    );
  }, 20000);
}

// 关闭所有 effect
async function clearEffects() {
  // stopStreamEffect();
  pc.close();
  await stopVideo();
  requestStopLive().then();
  clearInterval(timer);
  clearInterval(reporter);
}

// const ffmpeg = new FFmpeg();
// let stopStreamEffect: WatchStopHandle;

// 视频 + 音频 多轨 流
let stream: MediaStream = new MediaStream();
// rtc 连接
const pc = new RTCPeerConnection();
const pcState = ref(pc.connectionState);
// 监听 connectionstatechange 事件
pc.onconnectionstatechange = () => {
  // 获取当前连接状态
  const connectionState = pc.connectionState;
  pcState.value = connectionState;

  // 根据连接状态进行相应的处理
  switch (connectionState) {
    case 'new':
      console.log('连接状态：new');
      break;
    case 'connected':
      console.log('连接状态：connected');
      handleRtcConnected();
      break;
    case 'disconnected':
      console.log('连接状态：disconnected');
      break;
    case 'failed':
      console.log('连接状态：failed');
      break;
    case 'closed':
      console.log('连接状态：closed');
      break;
    default:
      console.log('未知的连接状态：', connectionState);
      break;
  }
};
let videoSender: RTCRtpSender;
let audioSender: RTCRtpSender;

const liveState = ref(0);

async function requestStartLive() {
  try {
    const response = await createRequest(`/live/${userStore.userInfo.id}`, {
      method: 'POST',
      data: {
        live_url: `?rid=${roomId.value}`,
        cover_url: userStore.userInfo.avatarUrl,
        title: '直播间',
        name: `${userStore.userInfo.name}的直播`,
      },
    });
    liveState.value = 1;
  } catch (e) {
    /* empty */
  }
}

async function requestStopLive() {
  try {
    const response = await createRequest(`/live/${userStore.userInfo.id}`, {
      method: 'DELETE',
    });
    liveState.value = 0;
  } catch (e) {
    /* empty */
  }
}

let startTime: Date;
let timer: number = 0;
const duration = ref('');
// 定时上报
let reporter: number = 0;

async function initStreaming() {
  if (!stream) return;
  // 开始连接
  try {
    const s = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    // 使用第一个摄像头作为默认摄像头
    currentCamera.value = cameras.value[0];
    // 寻找标记为音频输入的设备作为默认麦克风
    currentMicrophone.value = microphones.value.find((v) => {
      return v.kind == 'audioinput' && v.label != '';
    });
    s.getVideoTracks().forEach((track) => {
      stream.addTrack(track);
      videoSender = pc.addTrack(track);
    });
    refreshVideoPlayback();
    s.getAudioTracks().forEach((track) => {
      stream.addTrack(track);
      audioSender = pc.addTrack(track);
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
    AndroidUtil.showToast(`直播开始！`, 'short');

    // 通知服务器开始直播
    requestStartLive().then();

    startTime = new Date();
    timer = window.setInterval(() => {
      duration.value = getDurationString(startTime);
    });
  } catch (error) {
    console.error('Error starting streaming:', error);
    AndroidUtil.showToast('直播失败！', 'short');
    pc.close();
  }
}

const isVoiceOff = ref(false);

function handleMute() {
  if (stream) {
    stream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      isVoiceOff.value = !track.enabled;
      AndroidUtil.showToast(track.enabled ? '已开启麦克风' : '已关闭麦克风');
    });
  }
}

useClientBackPressed(() => {
  handleStop();
});

onMounted(async () => {
  console.log('adapter', adapter.browserDetails.browser, adapter.browserDetails.version);
  // 初始化视频和音频输入
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
    <video id="vid2" autoplay class="video2" controls muted />
    <div class="layer">
      <div class="left-top">
        <div class="state"></div>
        <span>直播中 {{ duration }}</span>
      </div>
      <div class="icon right-top" @click="() => handleStop()">
        <Power />
      </div>
      <div :class="{ 'icon-active': !isVoiceOff }" class="icon right-bottom-2" @click="handleMute">
        <VoiceOff v-if="isVoiceOff" />
        <Voice v-else />
      </div>
      <div class="icon right-bottom" @click="debounceFlipCamera">
        <FlipCamera />
      </div>
      <div class="icon left-bottom" @click="handleGoLive">
        <Clipboard />
      </div>
      <div style="color: rgba(0 0 0 / 10%); z-index: -1">
        {{ microphones }}
        ///
        {{ currentMicrophone }}
      </div>
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
    position: absolute;
    width: 100%;
    height: 100%;
    background: transparent;
    z-index: 0;
    overflow: hidden;
  }

  .video2 {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 110vw;
    height: 105vh;
    object-fit: cover;
    background: $color-grey-500;
    z-index: -1;
    filter: blur(10px) brightness(0.5);
    overflow: hidden;
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

      &-active {
        span {
          color: $color-primary;
        }
      }
    }

    .left-top {
      position: absolute;
      top: 1rem;
      left: 1rem;
      padding-left: w(10px);
      padding-right: w(10px);
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

    .left-bottom {
      position: absolute;
      bottom: 1rem;
      left: 1rem;
      padding-left: w(20px);
      padding-right: w(20px);
      height: w(40px);
      width: w(40px);
      border-radius: w(40px);
      background: rgb(0 0 0 / 20%);
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      gap: w(5px);
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

    .right-bottom-2 {
      position: absolute;
      bottom: 1rem;
      right: w(56px);
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
