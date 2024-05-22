export const isAndroid = () => {
  console.log(window.navigator.userAgent);
  return window.navigator.userAgent.match(/.*Android.*/);
};

export default {
  isAndroid,
};
