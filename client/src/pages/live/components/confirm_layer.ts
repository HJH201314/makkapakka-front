// 模糊浮层
import { notification } from 'ant-design-vue';

export const confirm_layer = (key?: string) => {
  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.top = '0';
  div.style.left = '0';
  div.style.width = '100vw';
  div.style.height = '100vh';
  div.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'; // 半透明
  div.style.zIndex = '9';
  div.onclick = () => {
    if (typeof key === 'string') {
      notification.close(key);
    }
    div.remove();
  };
  // 将新创建的div添加到文档中
  document.body.appendChild(div);
  return div;
};
