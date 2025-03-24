import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Configuration interface for the API client
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// API client class for handling HTTP requests
class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(config: ApiClientConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    // Add request interceptor for authentication, logging, etc.
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add any custom logic here (e.g., adding auth tokens)
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for handling common errors, data transformation, etc.
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Process successful responses
        return response;
      },
      (error) => {
        // Handle errors or retry logic
        return Promise.reject(error);
      }
    );
  }

  // Generic methods for HTTP requests

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(url, config);
    return response.data;
  }

  // Method to update the base configuration
  updateConfig(config: Partial<ApiClientConfig>): void {
    if (config.baseURL) {
      this.axiosInstance.defaults.baseURL = config.baseURL;
    }

    if (config.timeout) {
      this.axiosInstance.defaults.timeout = config.timeout;
    }

    if (config.headers) {
      Object.entries(config.headers).forEach(([key, value]) => {
        this.axiosInstance.defaults.headers.common[key] = value;
      });
    }
  }

  // Method to add an authorization token
  setAuthToken(token: string): void {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Method to remove the authorization token
  removeAuthToken(): void {
    delete this.axiosInstance.defaults.headers.common['Authorization'];
  }
}

// Create and export a default instance with environment-specific configuration
const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 15000,
});

export default apiClient;
