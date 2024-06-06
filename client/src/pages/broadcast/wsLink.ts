import { useWebSocket } from '@vueuse/core';

const rid = 1;
// const uid = useUserStore().userInfo.id;
const uid = 1;
const host = `ws://172.29.19.242:10006/websocket/${rid}/${uid}`;
export const createWsLink = () => {
  const { data } = useWebSocket(host, {
    autoReconnect: {
      retries: 3,
      delay: 1000,
    },
    onMessage(ws, event) {
      const content = JSON.parse(event.data);
    },
  });
};
