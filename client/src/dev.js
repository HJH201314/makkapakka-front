// init vConsole
if (localStorage.getItem('APP_DEBUG') === 'true') {
  if (useMediaQuery('(max-width: 768px)').value) {
    const script1 = document.createElement('script');
    script1.src = 'https://unpkg.zhimg.com/vconsole@latest/dist/vconsole.min.js';
    document.head.appendChild(script1);
    const script2 = document.createElement('script');
    script2.src = 'https://unpkg.zhimg.com/vue-vconsole-devtools@latest/dist/vue_plugin.js';
    document.head.appendChild(script2);
    let vConsole;
    script1.onload = () => {
      vConsole = new window.VConsole();

      let tip = document.createElement('div');
      tip.id = 'debug-tip';
      tip.style.position = 'fixed';
      tip.style.opacity = '0.1';
      tip.style.bottom = '0';
      tip.style.left = '0';
      tip.style.zIndex = '999999999998';
      tip.style.width = '100%';
      tip.style.height = '40px';
      tip.style.lineHeight = '40px';
      tip.style.background = 'blue';
      tip.style.color = 'white';
      tip.style.fontSize = '16px';
      tip.style.fontWeight = 'bold';
      tip.innerHTML = '&nbsp;&nbsp;当前处于调试模式（点击隐藏）';
      tip.onclick = () => {
        document.getElementById('debug-tip').remove();
        document.getElementById('quit-debug').remove();
      };
      document.body.appendChild(tip);

      let quitDebug = document.createElement('div');
      quitDebug.id = 'quit-debug';
      quitDebug.style.position = 'fixed';
      quitDebug.style.opacity = '0.1';
      quitDebug.style.bottom = '0';
      quitDebug.style.right = '0';
      quitDebug.style.zIndex = '999999999999';
      quitDebug.style.width = '6rem';
      quitDebug.style.height = '40px';
      quitDebug.style.lineHeight = '40px';
      quitDebug.style.textAlign = 'center';
      quitDebug.style.background = 'red';
      quitDebug.style.color = 'white';
      quitDebug.style.fontSize = '16px';
      quitDebug.style.fontWeight = 'bold';
      quitDebug.innerHTML = '退出调试';
      quitDebug.onclick = () => {
        localStorage.setItem('APP_DEBUG', 'false');
        window.location.reload();
      };
      document.body.appendChild(quitDebug);
    };
    script2.onload = () => {
      const Devtools = window.vueVconsoleDevtools;
      Devtools.initPlugin(vConsole);
    };
  }
} else {
  localStorage.setItem(
    'NO_DEBUG_CNT',
    `${
      localStorage.getItem('NO_DEBUG_CNT') ? parseInt(localStorage.getItem('NO_DEBUG_CNT')) + 1 : 1
    }`
  );
  if (parseInt(localStorage.getItem('NO_DEBUG_CNT')) === 5) {
    localStorage.setItem('APP_DEBUG', 'true');
    window.location.reload();
  }
}
