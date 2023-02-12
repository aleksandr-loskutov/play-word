import axios from 'axios'
import { ApiResponse } from '../types/api'
import CONSTS from '../utils/consts'
import { UserEntity } from '../types/user'

type RequestOptions<T> = {
  method: string
  url: string
  data?: T
  headers?: Record<string, string>
}

const axiosInstance = axios.create({
  baseURL: CONSTS.APP_URL,
})

axiosInstance.interceptors.response.use(
  config => {
    return config
  },
  async error => {
    const originalRequest = error.config

    if (
      error.response.status == 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true
      try {
        await axios.get<UserEntity>(
          `${CONSTS.APP_URL}${CONSTS.API_PATH}/auth/refresh`,
          { withCredentials: true }
        )
        return axiosInstance.request(originalRequest)
      } catch {}
    }
    throw error
  }
)

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
  })

class HttpService {
  constructor(private endPoint: string) {}

  get = <T>(url: string, headers?: Record<string, string>): ApiResponse<T> =>
    createRequest<T>({
      method: 'GET',
      url: `${this.endPoint}${url}`,
      headers,
    })
      .then(response => ({ data: response.data, status: response.status }))
      .catch(error => ({
        error: `${error.response?.data?.message} ${error.message}`,
        status: error.response?.status || 500,
      }))

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
      .then(response => ({ data: response.data, status: response.status }))
      .catch(error => ({
        error: `${error.response?.data?.message} ${error.message}`,
        status: error.response?.status || 500,
      }))

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
      .then(response => ({ data: response.data, status: response.status }))
      .catch(error => ({
        error: `${error.response?.data?.message} ${error.message}`,
        status: error.response?.status || 500,
      }))

  delete = <T, R>(
    url: string,
    headers?: Record<string, string>
  ): ApiResponse<R> =>
    createRequest<T>({
      method: 'DELETE',
      url: `${this.endPoint}${url}`,
      headers,
    })
      .then(response => ({ data: response.data, status: response.status }))
      .catch(error => ({
        error: `${error.response?.data?.message} ${error.message}`,
        status: error.response?.status || 500,
      }))
}

export default HttpService
