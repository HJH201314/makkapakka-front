<script setup lang="ts">
import { Back, Play, SendOne, SlyFaceWhitSmile } from '@icon-park/vue-next';
import { useUrlSearchParams } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { isAndroid } from '@/utils/browser.util';
import { useClientBackPressed } from '@/commands/useClientBackPressed';
import { AndroidUtil } from '@/utils/android.util';

import adapter from 'webrtc-adapter';

definePage({
  name: '观众',
  path: '/audience',
});

// query 参数
// rid: 房间号, uid: 用户 id, 传 uid 会从直播列表里面搜索对应的 rid
const params = useUrlSearchParams('history', {
  initialValue: {
    rid: '',
    uid: '',
  },
});
const realRoomId = ref('');
const whepUrl = computed(
  () => `/srs/rtc/v1/whep/?app=${realRoomId.value}&stream=livestream&eip=111.230.21.98:18000`
);

async function getAvailableStreams() {
  if (params.rid) {
    realRoomId.value = params.rid;
    return;
  }
  const res = await fetch('/srs/api/v1/streams/');
  const data = await res.json();
  const streams = data.streams;
  streams.reverse();
  for (const stream of streams) {
    const temp = Number(stream.app) / 1000;
    if (temp >= 0 && temp < 100) {
      console.log('realRoomId', stream.app);
      realRoomId.value = stream.app;
      break;
    }
  }
}

onMounted(async () => {
  console.log('adapter', adapter.browserDetails.browser, adapter.browserDetails.version);
  await getAvailableStreams();
  await initStreaming();
});

const showScreenShot = ref(false);

function taskScreenshot() {
  const vid = document.getElementById('vid') as HTMLVideoElement;
  const canvas1 = document.getElementById('canvas1') as HTMLCanvasElement;
  const canvas2 = document.getElementById('canvas2') as HTMLCanvasElement;
  const ctx = canvas1.getContext('2d');
  const ctx2 = canvas2.getContext('2d');
  if (!ctx || !ctx2) return;
  canvas1.width = vid.videoWidth;
  canvas1.height = vid.videoHeight;
  canvas2.width = vid.videoWidth;
  canvas2.height = vid.videoHeight;
  canvas1.style.height = `${vid.offsetHeight}px`;
  ctx.drawImage(vid, 0, 0, canvas1.width, canvas1.height);
  ctx2.drawImage(vid, 0, 0, canvas2.width, canvas2.height);
  showScreenShot.value = true;
}

const showPlayButton = ref(true);

async function refreshVideoPlayback() {
  const vid = document.getElementById('vid') as HTMLVideoElement;
  const vid2 = document.getElementById('vid2') as HTMLVideoElement;
  if (!vid) return;
  console.log('video stream:', stream);
  console.log('video stream tracks:', stream.getVideoTracks());
  vid.srcObject = stream;
  vid2.srcObject = stream;
  if (stream.getVideoTracks().every((v) => v.enabled)) {
    try {
      // 当用户没有交互时，无法自动开启视频
      await vid.play();
      await vid2.play();
      showPlayButton.value = false;
    } catch (e) {
      console.error('播放视频失败:', e);
      showPlayButton.value = true;
    }
  } else {
    vid.pause();
    vid2.pause();
    showPlayButton.value = true;
  }
  // 更新播放暂停浮层位置
  const stopAndPlay = document.getElementById('stop-and-play');
  if (stopAndPlay) {
    stopAndPlay.style.height = `${(vid.videoHeight * vid.clientWidth) / vid.videoWidth}px`;
  }
}

async function stopVideo() {
  stream.getTracks().forEach((v) => v.stop());
  await refreshVideoPlayback();
}

async function pauseVideo() {
  stream.getTracks().forEach((v) => (v.enabled = false));
  await refreshVideoPlayback();
}

function handleTogglePlay() {
  if (!showPlayButton.value && stream.getVideoTracks().every((v) => v.enabled)) {
    // 暂停视频
    taskScreenshot();
    pauseVideo();
    showPlayButton.value = true;
  } else {
    // 播放视频
    stream.getVideoTracks().forEach((v) => (v.enabled = true));
    refreshVideoPlayback();
    showPlayButton.value = false;
    showScreenShot.value = false;
  }
}

// 关闭所有 effect
async function clearEffects() {
  console.log('clear effects');
  pc && pc.close();
  await stopVideo();
}

const router = useRouter();
async function handleQuit() {
  await clearEffects();
  if (isAndroid()) {
    window.AndroidInterface?.quit?.();
  } else {
    router.back();
  }
}

useClientBackPressed(() => {
  handleQuit();
});

// 视频 + 音频 多轨 流
let stream: MediaStream = new MediaStream();
// rtc 连接
const pc = new RTCPeerConnection();
pc.oniceconnectionstatechange = () => {
  console.log('oniceconnectionstatechange', pc.iceConnectionState);
};
// @ts-ignore
window.pc = pc; // 将 pc 放到 window 中方便调试
// pc.ontrack = (event) => {
//   stream.addTrack(event.track);
//   refreshVideoPlayback();
// };
const pcState = ref(pc.connectionState);
const stateText = computed(() => {
  switch (pcState.value) {
    case 'connecting':
      return '连接中';
    case 'connected':
      return '直播中';
    default:
      return '';
  }
});
// 监听 connectionstatechange 事件
pc.onconnectionstatechange = async () => {
  // 获取当前连接状态
  const connectionState = pc.connectionState;
  pcState.value = connectionState;
  (await pc.getStats()).forEach((report) => {
    console.log('getStats', report);
  });

  // 根据连接状态进行相应的处理
  switch (connectionState) {
    case 'new':
      console.log('连接状态：new');
      break;
    case 'connecting':
      console.log('连接状态：connecting');
      break;
    case 'connected':
      console.log('连接状态：connected');
      setTimeout(() => {
        pc.getReceivers().forEach((receiver) => {
          console.log('add receiver:', receiver);
          stream.addTrack(receiver.track);
        });
        console.log('streamTracks', stream.getTracks());
        console.log('pcReceivers', pc.getReceivers());
        refreshVideoPlayback();
      }, 0);
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

async function initStreaming() {
  // 开始连接
  try {
    // 创建 offer 用于描述本地流信息
    const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
    await pc.setLocalDescription(offer);

    // 通过 HTTP 请求 WHEP 服务器获取 answer
    const response = await fetch(whepUrl.value, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: offer.sdp,
    });

    if (!response.ok) {
      throw new Error('Failed to send offer to WHEP server');
    }

    // 将 answer 设置为远端描述
    const answerSDP = await response.text();
    const answer = new RTCSessionDescription({
      type: 'answer',
      sdp: answerSDP,
    });

    await pc.setRemoteDescription(answer);
    console.log('Streaming started');
  } catch (error) {
    console.error('Error starting streaming:', error);
    AndroidUtil.showToast('直播失败！', 'short');
    pc.close();
  }
}

function handleInputFocus(type: 'focus' | 'blur') {
  const inputBar = document.getElementById('bottom-input-bar');
  // TODO 处理键盘弹出
}

onBeforeUnmount(() => {
  clearEffects();
});
</script>

<template>
  <div class="audience">
    <video id="vid" class="video" controls />
    <canvas v-show="showScreenShot" id="canvas1" class="video" />
    <video id="vid2" class="video2" controls />
    <canvas v-show="showScreenShot" id="canvas2" class="video2" />
    <div id="stop-and-play" @click="handleTogglePlay">
      <!-- 叠在视频上方用于切换播放状态 -->
    </div>
    <div v-if="showPlayButton" class="play">
      <Play @click="handleTogglePlay" />
    </div>
    <div class="layer">
      <div class="right-top">
        <div class="state"></div>
        <span>{{ stateText }}</span>
      </div>
      <div class="icon left-top" @click="handleQuit">
        <Back />
      </div>
      <div id="bottom-input-bar" class="bottom">
        <SlyFaceWhitSmile />
        <input
          placeholder="说点什么吧"
          @blur="handleInputFocus('blur')"
          @focus="handleInputFocus('focus')"
        />
        <SendOne />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/main.scss';
.audience {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  .video {
    position: absolute;
    width: w(375px);
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    z-index: 10;
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

  .play {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: w(40px);
    width: w(40px);
    border-radius: w(40px);
    background: rgb(0 0 0 / 20%);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 11;

    span {
      color: #fff;
      font-size: w(28px);
    }
  }

  .layer {
    position: absolute;
    z-index: 12;
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

    .center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      height: w(40px);
      width: w(40px);
      border-radius: w(40px);
      background: rgb(0 0 0 / 20%);
      display: flex;
      justify-content: center;
      align-items: center;
      gap: w(10px);
    }

    .right-top {
      position: absolute;
      top: 1rem;
      right: 1rem;
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

    .bottom {
      position: absolute;
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);
      width: w(350px);
      height: w(40px);
      border-radius: w(40px);
      background: rgb(0 0 0 / 20%);
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      gap: w(5px);

      span {
        margin-left: w(8px);
        margin-right: w(8px);
        color: #fff;
        font-size: w(28px);
      }

      input {
        flex: 1;

        &::placeholder {
          color: white;
        }
      }
    }

    .left-bottom {
      position: absolute;
      bottom: 1rem;
      left: 1rem;
      padding-left: w(20px);
      padding-right: w(20px);
      height: w(40px);
      border-radius: w(40px);
      background: rgb(0 0 0 / 20%);
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      gap: w(5px);
    }

    .left-top {
      position: absolute;
      top: 1rem;
      left: 1rem;
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

#stop-and-play {
  position: fixed;
  left: 0;
  min-height: w(281.25px);
  width: w(375px);
  top: 50%;
  transform: translateY(-50%);
  z-index: 13;
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
