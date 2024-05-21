<script setup lang="ts">
import { Back } from '@icon-park/vue-next';
import { useUrlSearchParams } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { isAndroid } from '@/utils/browser.util';
import { useClientBackPressed } from '@/commands/useClientBackPressed';

definePage({
  name: '观众',
  path: '/audience',
});

const params = useUrlSearchParams('history', {
  initialValue: {
    rid: 'app',
    forceRid: '',
  },
});
const realRoomId = ref('');
const whepUrl = computed(
  () => `/srs/rtc/v1/whep/?app=${realRoomId.value}&stream=livestream&eip=111.230.21.98:18000`
);

async function getAvailableStreams() {
  if (params.forceRid) {
    realRoomId.value = params.forceRid;
    return;
  }
  const res = await fetch('/srs/api/v1/streams/');
  const data = await res.json();
  const streams = data.streams;
  streams.reverse();
  for (const stream of streams) {
    if (stream.app.startsWith(`room_${params.rid}`)) {
      console.log(stream.app);
      realRoomId.value = stream.app;
      break;
    }
  }
}

onMounted(async () => {
  await getAvailableStreams();
  await initStreaming();
});

function refreshVideoPlayback() {
  const vid = document.getElementById('vid') as HTMLVideoElement;
  if (!vid) return;
  console.log('stream:', stream);
  vid.srcObject = stream;
}

async function stopVideo() {
  stream.getVideoTracks().forEach((v) => v.stop());
  refreshVideoPlayback();
}

// 关闭所有 effect
async function clearEffects() {
  pc && pc.close();
  await stopVideo();
}

const router = useRouter();
async function handleQuit() {
  await clearEffects();
  if (isAndroid()) {
    window.AndroidInterface.quit?.();
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
// pc.ontrack = (event) => {
//   stream.addTrack(event.track);
//   refreshVideoPlayback();
// };
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
      pc.getReceivers().forEach((receiver) => {
        console.log('receiver:', receiver);
        stream.addTrack(receiver.track);
      });
      console.log(stream.getTracks());
      refreshVideoPlayback();
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
    pc.addTransceiver('audio', { direction: 'recvonly' });
    pc.addTransceiver('video', { direction: 'recvonly' });

    const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
    await pc.setLocalDescription(offer);

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

    const answerSDP = await response.text();
    const answer = new RTCSessionDescription({
      type: 'answer',
      sdp: answerSDP,
    });

    await pc.setRemoteDescription(answer);
    console.log('Streaming started');
  } catch (error) {
    console.error('Error starting streaming:', error);
    window.AndroidInterface.showToast?.('直播失败！', 'short');
    pc.close();
  }
}

onBeforeUnmount(() => {
  clearEffects();
});
</script>

<template>
  <div class="audience">
    <video class="video" controls autoplay id="vid" />
    <div class="layer">
      <div class="right-top">
        <div class="state"></div>
        <span>观看 {{ pcState.toUpperCase() }}</span>
      </div>
      <div class="icon left-top" @click="handleQuit">
        <Back />
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
