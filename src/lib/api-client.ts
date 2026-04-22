import axios, { AxiosInstance, AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';

// API URLs from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'http://localhost:3004';
const LEDGER_URL = import.meta.env.VITE_LEDGER_URL || 'http://localhost:3002';

// Create Axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Admin API client
export const adminClient: AxiosInstance = axios.create({
  baseURL: ADMIN_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ledger API client
export const ledgerClient: AxiosInstance = axios.create({
  baseURL: LEDGER_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach auth token
const addAuthInterceptor = (client: AxiosInstance) => {
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('tokenspark_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

addAuthInterceptor(apiClient);
addAuthInterceptor(adminClient);
addAuthInterceptor(ledgerClient);

// Response interceptor - handle errors
const addErrorInterceptor = (client: AxiosInstance) => {
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiResponse>) => {
      if (error.response) {
        const { status } = error.response;
        if (status === 401) {
          localStorage.removeItem('tokenspark_token');
          localStorage.removeItem('tokenspark_user');
          window.location.href = '/login';
        }
        if (status === 403) {
          return Promise.reject(new Error('Access denied'));
        }
        if (status >= 500) {
          return Promise.reject(new Error('Server error, please try again later'));
        }
      }
      if (error.code === 'ECONNABORTED') {
        return Promise.reject(new Error('Request timeout'));
      }
      return Promise.reject(error.response?.data?.error || error.message);
    }
  );
};

addErrorInterceptor(apiClient);
addErrorInterceptor(adminClient);
addErrorInterceptor(ledgerClient);

// Helper: get auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('tokenspark_token');
};

// Helper: set auth token
export const setAuthToken = (token: string): void => {
  localStorage.setItem('tokenspark_token', token);
};

// Helper: remove auth token
export const removeAuthToken = (): void => {
  localStorage.removeItem('tokenspark_token');
  localStorage.removeItem('tokenspark_user');
};

// Helper: get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('tokenspark_user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

// Helper: set current user
export const setCurrentUser = (user: any): void => {
  localStorage.setItem('tokenspark_user', JSON.stringify(user));
};

export default apiClient;
