import { isAndroid } from '@/utils/browser.util';
import ToastManager from '@/components/cus-ui/toast/ToastManager';

export class AndroidUtil {
  static isAndroid() {
    return isAndroid();
  }

  static showToast(msg: string, length: 'short' | 'long' = 'short') {
    if (window.AndroidInterface) {
      window.AndroidInterface.showToast?.(msg, length);
    } else {
      ToastManager.info(msg);
    }
  }

  static quit() {
    if (window.AndroidInterface) {
      window.AndroidInterface.quit?.();
    } else {
      window.close();
    }
  }

  static backOrQuit() {
    if (history.length === 1) {
      if (window.AndroidInterface) {
        window.AndroidInterface.quit?.();
      } else {
        window.close();
      }
    } else {
      history.back();
    }
  }
}
