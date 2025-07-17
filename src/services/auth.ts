import { api } from './api';
import type { AxiosError } from 'axios';
import { JWT_CONFIG } from '../constants/config';

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  user?: {
    id: string;
    email: string;
    username?: string;
  };
}

// Auth Error Types
export type AuthError = Error | AxiosError;

// Auth API Service
export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse, LoginRequest>('/auth/login', credentials);
    return response.data;
  },

  // Signup user
  signup: async (userData: SignupRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse, SignupRequest>('/auth/signup', userData);
    return response.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Logout failed, but still clear local storage
    } finally {
      // Always clear local storage
      localStorage.removeItem('access_token');
    }
  },

  // Refresh token
  refreshToken: async (): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/refresh');
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<Record<string, unknown>> => {
    const response = await api.get<Record<string, unknown>>('/auth/profile');
    return response.data;
  },
};

// Token management utilities
export const tokenUtils = {
  // Get token from localStorage
  getToken: (): string | null => {
    return localStorage.getItem('access_token');
  },

  // Set token in localStorage
  setToken: (token: string): void => {
    localStorage.setItem('access_token', token);
  },

  // Remove token from localStorage
  removeToken: (): void => {
    localStorage.removeItem('access_token');
  },

  // Check if token exists
  hasToken: (): boolean => {
    return !!localStorage.getItem('access_token');
  },

  // Check if token is expired (basic check)
  isTokenExpired: (): boolean => {
    const token = localStorage.getItem('access_token');
    if (!token) return true;
    
    try {
      // Basic JWT expiration check (if token is JWT)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * JWT_CONFIG.MILLISECONDS_MULTIPLIER < Date.now();
    } catch {
      // If not a valid JWT, assume it's expired
      return true;
    }
  },
};

export default authService; 