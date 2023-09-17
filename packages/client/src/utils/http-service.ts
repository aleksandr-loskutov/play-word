/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import { ApiResponse, ResponseFormat } from '../types/api';
import CONSTS from './consts';
import { User } from '../types/user';

type RequestOptions<T> = {
  method: string;
  url: string;
  data?: T;
  headers?: Record<string, string>;
};

const axiosInstance = axios.create({
  baseURL: CONSTS.APP_URL,
});

axiosInstance.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config;

    if (
      Number(error.response.status) === 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      await axios.get<User>(
        `${CONSTS.APP_URL}${CONSTS.API_PATH}/auth/refresh`,
        { withCredentials: true }
      );
      return axiosInstance.request(originalRequest);
    }

    throw error;
  }
);

const handleApiError = (error: any): ResponseFormat<any> => ({
  // ${error.message} is still there but we dont show it
  error: `${error.response?.data?.message}`,
  status: error.response?.status || 500,
});

const createRequest = <T>(options: RequestOptions<T>) =>
  axiosInstance({
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    method: options.method,
    url: options.url,
    data: options.data,
    withCredentials: true,
  });

class HttpService {
  constructor(private endPoint: string) {}

  get = <T>(url: string, headers?: Record<string, string>): ApiResponse<T> =>
    createRequest<T>({
      method: 'GET',
      url: `${this.endPoint}${url}`,
      headers,
    })
      .then((response) => ({ data: response.data, status: response.status }))
      .catch((error) => handleApiError(error));

  post = <T, R>(
    url: string,
    data?: T,
    headers?: Record<string, string>
  ): ApiResponse<R> =>
    createRequest<T>({
      method: 'POST',
      url: `${this.endPoint}${url}`,
      data,
      headers,
    })
      .then((response) => ({ data: response.data, status: response.status }))
      .catch((error) => handleApiError(error));

  put = <T, R>(
    url: string,
    data?: T,
    headers?: Record<string, string>
  ): ApiResponse<R> =>
    createRequest<T>({
      method: 'PUT',
      url: `${this.endPoint}${url}`,
      data,
      headers,
    })
      .then((response) => ({ data: response.data, status: response.status }))
      .catch((error) => handleApiError(error));

  patch = <T, R>(
    url: string,
    data?: T,
    headers?: Record<string, string>
  ): ApiResponse<R> =>
    createRequest<T>({
      method: 'PATCH',
      url: `${this.endPoint}${url}`,
      data,
      headers,
    })
      .then((response) => ({ data: response.data, status: response.status }))
      .catch((error) => handleApiError(error));

  delete = <T, R>(
    url: string,
    headers?: Record<string, string>
  ): ApiResponse<R> =>
    createRequest<T>({
      method: 'DELETE',
      url: `${this.endPoint}${url}`,
      headers,
    })
      .then((response) => ({ data: response.data, status: response.status }))
      .catch((error) => handleApiError(error));
}

export default HttpService;
