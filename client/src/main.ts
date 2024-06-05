import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import 'ant-design-vue/dist/reset.css';
import '@icon-park/vue-next/styles/index.css';
import '@/assets/main.scss';

// vue virtual scroller
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'; // 引入它的 css
// @ts-ignore
import VueVirtualScroller from 'vue-virtual-scroller'; // 引入它

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueVirtualScroller);

app.mount('#app');
