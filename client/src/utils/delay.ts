export const sleep = async (millis: number) =>
  new Promise((resolve) => setTimeout(resolve, millis));
