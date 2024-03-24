import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import VueDevTools from 'vite-plugin-vue-devtools';
import VueRouter from 'unplugin-vue-router/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { VueRouterAutoImports } from 'unplugin-vue-router';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({
      routesFolder: [{
        src: 'src/pages',
      }],
      exclude: ['**/components/*'],
    }),
    vue(),
    vueJsx(),
    VueDevTools(),
    AutoImport({
      eslintrc: {
        enabled: true,
      },
      imports: [
        'vue',
        '@vueuse/core',
        'pinia',
        VueRouterAutoImports,
        {
          'vue-router/auto': ['useLink'],
        }
      ]
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
