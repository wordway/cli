/* eslint-disable @typescript-eslint/no-explicit-any */
import 'isomorphic-fetch';
import axios, {
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import * as AxiosLogger from 'axios-logger';
import { getCredential, getConfig } from '../globals';

class ApiClient {
  private config;

  private credential;

  private sharedAxios: AxiosInstance;

  public constructor() {
    this.renew();
    this.sharedAxios.interceptors.request.use(async (config): Promise<AxiosRequestConfig> => {
      const nextConfig = Object.assign(
        {},
        config,
      );

      if (this.credential && this.credential.jwtToken) {
        const { accessToken = '' } = this.credential.jwtToken || {};
        nextConfig.headers.Authorization = `Bearer ${accessToken}`;
      }
      return nextConfig;
    });
    this.sharedAxios.interceptors.response.use((response): AxiosResponse => {
      const nextResponse = Object.assign(
        {},
        response,
      );
      return nextResponse;
    });
  }

  private renew(): void {
    this.config = getConfig();
    this.credential = getCredential();

    this.sharedAxios = axios.create({
      baseURL: this.config.apiURL,
    });

    if (this.config.env === 'local') {
      this.sharedAxios.interceptors.request.use(AxiosLogger.requestLogger);
    }
  }

  public get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this.sharedAxios.get(url, config);
  }

  public delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.sharedAxios.delete(url, config);
  }

  public head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.sharedAxios.head(url, config);
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this.sharedAxios.post(url, data, config);
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this.sharedAxios.put(url, data, config);
  }

  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this.sharedAxios.patch(url, data, config);
  }
}

export default ApiClient;
