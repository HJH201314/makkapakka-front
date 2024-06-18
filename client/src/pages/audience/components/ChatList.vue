<template>
  <div class="chat-container">
    <DynamicScroller :items="items" min-item-size="54" class="scroller" ref="scroller">
      <template v-slot="{ item, index, active }">
        <DynamicScrollerItem
          :item="item"
          :active="active"
          :size-dependencies="[item.name, item.message]"
          :data-index="index"
        >
          <div class="chat-item">
            <div class="chat-item__content">
              <div class="chat-item__name">{{ item.name }}</div>
              <div class="chat-item__message">{{ item.message }}</div>
            </div>
          </div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface ChatItem {
  id: number;
  name: string;
  message: string;
}

const items = ref<ChatItem[]>([]);
const scroller = ref<HTMLElement | null>(null);

const props = defineProps({
  rid: String,
  uid: Number,
});

let wsLaunched = false;
watchEffect(() => {
  if (!props.rid || wsLaunched) return;
  wsLaunched = true;
  // ws
  const host = `ws/websocket/${props.rid}/15`;
  const { status, data } = useWebSocket(host, {
    autoReconnect: true,
    // 发送心跳
    heartbeat: {
      message: 'ping',
      interval: 1000 * 5,
      pongTimeout: 1000 * 4,
    },
    onError(ws, event) {
      console.log('连接失败：' + event);
    },
    onMessage(ws, event) {
      const data = JSON.parse(event.data);
      // 心跳
      if (data.content === 'pong' && data.userId === -1 && data.rid === -1) {
        return;
      }
      items.value.push({
        id: data.sendTime,
        name: data.username,
        message: data.content,
      });
      // todo 推送消息并滚动到底部
      // 滚动到底部 失败！ 研究一下这个main.ts里的scroller.css样式表，可能有发现
      // 组件名：vue-virtual-scroller，找找看有没有方法直接到底部
      nextTick(() => {
        if (scroller.value) {
          scroller.value.scrollTop = scroller.value.scrollHeight;
        }
      });
    },
  });
});
</script>
<style lang="scss" scoped>
@import '@/assets/main.scss';

.chat-container {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.scroller {
  height: 100%;
}

.chat-item {
  display: flex;
  justify-content: flex-start;
  padding: 5px 0 5px 10px;
}

.chat-item__content {
  padding: 5px;
  border-radius: 10px;
  background: rgb(0 0 0 / 20%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: auto;
  display: flex;

  .chat-item__name {
    font-weight: bold;
    color: $color-primary;
  }

  .chat-item__message {
    color: white;
    margin-left: 10px;
    word-break: break-all;
  }
}
</style>
