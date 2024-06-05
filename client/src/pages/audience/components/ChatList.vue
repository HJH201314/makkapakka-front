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
import { ref, onMounted } from 'vue';

interface ChatItem {
  id: number;
  name: string;
  message: string;
}

const items = ref<ChatItem[]>([]);
const scroller = ref<HTMLElement | null>(null);



onMounted(() => {
    //mock 对接时删除
  for (let i = 0; i < 1000; i++) {
    items.value.push({
      id: i,
      name: `User ${i}`,
      message: `Message ${i}`,
    });
  }
  //template
  const ws = new WebSocket('slot');
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    items.value.push(data);
  };
  //滚动到底部 失败！ 研究一下这个main.ts里的scroller.css样式表，可能有发现 组件名：vue-virtual-scroller，找找看有没有方法直接到底部
  nextTick(() => {
    if (scroller.value) {
      scroller.value.scrollTop = scroller.value.scrollHeight;
    }
  });
});


</script>

<style scoped>
.chat-container {
  position: relative;
  height: 50vh; /* 占据页面的下半部分 */
  width: 100%;
  overflow: hidden;
}

.scroller {
  height: 100%;
}

.chat-item {
  padding: 5px 0;
  display: flex;
  justify-content: flex-start;
  padding-left: 10px;
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
