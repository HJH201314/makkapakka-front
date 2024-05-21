import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import VueDevTools from 'vite-plugin-vue-devtools';
import { viteMockServe } from 'vite-plugin-mock';
import VueRouter from 'unplugin-vue-router/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VueRouterAutoImports } from 'unplugin-vue-router';
import sassDts from 'vite-plugin-sass-dts';
import path from 'path';

// https://vitejs.dev/config/
export default () => {
  const env = loadEnv('development', './');
  const mock: boolean = env['VITE_MOCK'] == 'true';
  console.log('mock', mock);
  return defineConfig({
    server: {
      https: true,
      port: 5173,
      proxy: {
        '/srs': {
          target: 'http://swzx.fcraft.cn:11985',
          rewrite(path) {
            return path.replace(/^\/srs/, '');
          },
          changeOrigin: true,
        },
      },
    },
    plugins: [
      VueRouter({
        routesFolder: [
          {
            src: 'src/pages',
          },
        ],
        exclude: ['**/components/*', '**/layouts/*'],
      }),
      viteMockServe({
        mockPath: 'mock',
        enable: mock,
      }),
      vue(),
      vueJsx(),
      sassDts({
        enabledMode: ['development', 'production'],
        global: {
          generate: true,
          outputFilePath: path.resolve(__dirname, './src/style.d.ts'),
        },
        sourceDir: path.resolve(__dirname, './src'),
        outputDir: path.resolve(__dirname, './dist'),
      }),
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
          },
        ],
        resolvers: [],
      }),
      Components({
        resolvers: [],
      }),
      basicSsl(),
    ],
    css: {
      modules: {
        localsConvention: 'camelCase', // 修改生成的配置对象的key的展示形式(小驼峰)
        scopeBehaviour: 'local', // 配置当前的模块化行为是模块化还是全局化
        generateScopedName: '[name]_[local]_[hash:5]', // 配置生成的类名的格式
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  });
};
