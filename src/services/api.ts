import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG } from '../constants/config';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add CORS configuration
  withCredentials: false,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Generic API methods
export const api = {
  get: <T, P = Record<string, string | number | boolean | string[] | undefined>>(url: string, params?: P): Promise<AxiosResponse<T>> =>
    apiClient.get(url, { params }),
  
  post: <T, D = Record<string, unknown>>(url: string, data?: D): Promise<AxiosResponse<T>> =>
    apiClient.post(url, data),
  
  put: <T, D = Record<string, unknown>>(url: string, data?: D): Promise<AxiosResponse<T>> =>
    apiClient.put(url, data),
  
  delete: <T>(url: string): Promise<AxiosResponse<T>> =>
    apiClient.delete(url),
  
  patch: <T, D = Record<string, unknown>>(url: string, data?: D): Promise<AxiosResponse<T>> =>
    apiClient.patch(url, data),
};

export default apiClient;
