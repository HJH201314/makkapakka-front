declare global {
  interface Window {
    // 从 Android 端传来的数据
    readonly AndroidInterface: {
      getToken: () => string;
      // UserInfo 的 JSON 形式
      getUser: () => string;
    };
  }
}

export {}