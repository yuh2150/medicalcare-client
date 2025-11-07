import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// API base URL with validation
export const API_BASE_URL = (() => {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return url.endsWith('/') ? url.slice(0, -1) : url;
})();

// Enhanced Token Management with better error handling
export class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'admin_accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'admin_refreshToken';
  private static readonly USER_KEY = 'admin_user';

  static getAccessToken(): string | null {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
      }
      return null;
    } catch {
      return null;
    }
  }

  static getRefreshToken(): string | null {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
      }
      return null;
    } catch {
      return null;
    }
  }

  static setTokens(accessToken: string, refreshToken: string): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      }
    } catch (error) {
      console.error('Failed to save tokens:', error);
    }
  }

  static clearTokens(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
      }
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }
}

// Enhanced API client with better error handling and performance
export const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Enhanced request interceptor
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = TokenManager.getAccessToken();
      if (token && config.headers) {
        // Check if token is expired before making request
        if (TokenManager.isTokenExpired(token)) {
          TokenManager.clearTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/admin/login';
          }
          return Promise.reject(new Error('Token expired'));
        }
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // Enhanced response interceptor with better error handling
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      
      if (error.response?.status === 401 && !originalRequest?._retry) {
        originalRequest._retry = true;
        
        const refreshToken = TokenManager.getRefreshToken();
        if (refreshToken && !TokenManager.isTokenExpired(refreshToken)) {
          try {
            const response = await axios.post(`${API_BASE_URL}/medicalcare/auth/refresh`, {
              refreshToken
            });
            
            const { accessToken, refreshToken: newRefreshToken } = response.data;
            TokenManager.setTokens(accessToken, newRefreshToken || refreshToken);
            
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }
            return client(originalRequest);
          } catch (refreshError) {
            TokenManager.clearTokens();
            redirectToLogin();
            return Promise.reject(refreshError);
          }
        } else {
          TokenManager.clearTokens();
          redirectToLogin();
        }
      }
      
      return Promise.reject(error);
    }
  );

  return client;
};

// Helper function to handle redirect
const redirectToLogin = (): void => {
  if (typeof window !== 'undefined') {
    window.location.href = '/admin/login';
  }
};

// Optimized API clients with singleton pattern
export const apiClient = createApiClient(API_BASE_URL);
export const adminApiClient = createApiClient(`${API_BASE_URL}/medicalcare/api`);
