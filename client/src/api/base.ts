import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { API_BASE } from '@/constants';

/* 创建axios实例 */
const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  withCredentials: false,
});

/* 创建请求 */
export const createRequest = <TRes>(path: string, args: AxiosRequestConfig) => {
  const config: AxiosRequestConfig<any> = {
    url: path,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
    ...args,
  };
  if (!config.headers) config.headers = {};
  // config.headers['token'] = localStorage.getItem('token') ?? '';
  // config.headers['Authorization'] = localStorage.getItem('token') ?? '';
  return axiosInstance.request<any, AxiosResponse<TRes>>(config);
};
