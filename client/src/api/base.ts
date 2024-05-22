import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { API_BASE_10006, API_BASE_51601, API_BASE_8088 } from '@/constants';

/* 创建axios实例 */
const axiosInstance = axios.create({
  baseURL: API_BASE_8088,
  timeout: 10000,
  withCredentials: false,
});
const axiosInstance10006 = axios.create({
  baseURL: API_BASE_10006,
  timeout: 10000,
  withCredentials: false,
});
const axiosInstance51601 = axios.create({
  baseURL: API_BASE_51601,
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

export const createRequest8088 = <TRes>(path: string, args: AxiosRequestConfig) => {
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

export const createRequest10006 = <TRes>(path: string, args: AxiosRequestConfig) => {
  const config: AxiosRequestConfig<any> = {
    url: path,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
    ...args,
  };
  if (!config.headers) config.headers = {};
  return axiosInstance10006.request<any, AxiosResponse<TRes>>(config);
};

export const createRequest51601 = <TRes>(path: string, args: AxiosRequestConfig) => {
  const config: AxiosRequestConfig<any> = {
    url: path,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
    ...args,
  };
  if (!config.headers) config.headers = {};
  return axiosInstance51601.request<any, AxiosResponse<TRes>>(config);
};
