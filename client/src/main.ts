import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import 'ant-design-vue/dist/reset.css';
import '@icon-park/vue-next/styles/index.css';
import '@/assets/main.scss';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
