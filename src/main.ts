import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import Antd from 'ant-design-vue';
import { install } from '@icon-park/vue-next/es/all';
import 'ant-design-vue/dist/reset.css';
import '@icon-park/vue-next/styles/index.css';
import '@/assets/main.scss';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(Antd);

install(app, 'ip'); //IconPark

app.mount('#app');
