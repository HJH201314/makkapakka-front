import { isAndroid } from '@/utils/browser.util';
import ToastManager from '@/components/cus-ui/toast/ToastManager';
import variables from '@/assets/variables.module.scss';

export class AndroidUtil {
  static isAndroid() {
    return isAndroid();
  }

  static showToast(msg: string, length: 'short' | 'long' = 'short') {
    if (window.AndroidInterface) {
      window.AndroidInterface.showToast?.(msg, length);
    } else {
      ToastManager.info(msg, {
        color: variables.colorPrimary,
      });
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
