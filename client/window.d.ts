declare global {
  interface Window {
    // 从 Android 端传来的数据, 注意并不是每个页面都有注入所有方法, 注意判空
    readonly AndroidInterface?: {
      // 获取 token
      getToken?: () => string;
      // 获取 UserInfo 的 JSON 形式
      getUser?: () => string;
      // 订阅下一场直播
      subscribeNextBroadcast?: (timeInMillis: number, name: string) => void;
      // 获取 roomId
      getRoomId?: () => string;
      // 关闭 webview
      quit?: () => void;
      // Toast 提示
      showToast?: (msg: string, length: 'short' | 'long' = 'short') => void;
    };
  }
}

export {};
