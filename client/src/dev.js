// init vConsole
if (localStorage.getItem('APP_DEBUG') === 'true') {
  const script1 = document.createElement('script');
  script1.src = 'https://unpkg.zhimg.com/vconsole@latest/dist/vconsole.min.js';
  document.head.appendChild(script1);
  const script2 = document.createElement('script');
  script2.src = 'https://unpkg.zhimg.com/vue-vconsole-devtools@latest/dist/vue_plugin.js';
  document.head.appendChild(script2);
  let vConsole;
  script1.onload = () => {
    vConsole = new window.VConsole();
  };
  script2.onload = () => {
    const Devtools = window.vueVconsoleDevtools;
    Devtools.initPlugin(vConsole);
  };
}
