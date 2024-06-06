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
import { onMounted, ref } from 'vue';

interface ChatItem {
  id: number;
  name: string;
  message: string;
}

const items = ref<ChatItem[]>([]);
const scroller = ref<HTMLElement | null>(null);

const props = defineProps({
  rid: Number,
  uid: Number,
});

onMounted(() => {
  //mock 对接时删除
  for (let i = 0; i < 20; i++) {
    items.value.push({
      id: i,
      name: `User ${i}`,
      message: `Message ${i}`,
    });
  }
  nextTick(() => {
    if (scroller.value) {
      console.log('scroller.value.scrollTop ' + scroller.value.scrollTop);
      console.log('scroller.value.scrollHeight ' + scroller.value.scrollHeight);
      scroller.value.scrollTop = scroller.value.scrollHeight;
    }
  });
  // ws
  const { status, data } = useWebSocket(`/ws/websocket/${props.rid}/${props.uid}`, {
    autoReconnect: {
      retries: 3,
      delay: 1000,
    },
    heartbeat: {
      message: 'ws heartbeat',
      interval: 1000 * 10,
    },
    onMessage(ws, event) {
      const data = JSON.parse(event.data);
      console.log(data);
      items.value.push({
        id: data.userId,
        name: 'User ' + data.userId,
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
<style scoped>
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
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: auto;
  display: flex;

  .chat-item__name {
    font-weight: bold;
  }

  .chat-item__message {
    margin-left: 10px;
    word-break: break-all;
  }
}
</style>
