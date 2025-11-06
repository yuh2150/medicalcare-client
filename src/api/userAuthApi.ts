import { apiClient } from './config';
import { TokenManager } from './config';
import { User } from '../types/auth';

// User Authentication Response Types
export interface UserAuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserRegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
}

export const userAuthApi = {
  async login(credentials: UserLoginRequest): Promise<UserAuthResponse> {
    try {
      const response = await apiClient.post('/medicalcare/auth/login', credentials);
      const authResponse = response.data;
      
      // Store tokens if provided
      if (authResponse.accessToken && authResponse.refreshToken) {
        TokenManager.setTokens(authResponse.accessToken, authResponse.refreshToken);
      }
      
      return authResponse;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  },

  async register(userData: UserRegisterRequest): Promise<UserAuthResponse> {
    try {
      const response = await apiClient.post('/medicalcare/auth/register', userData);
      const authResponse = response.data;
      
      // Store tokens if provided
      if (authResponse.accessToken && authResponse.refreshToken) {
        TokenManager.setTokens(authResponse.accessToken, authResponse.refreshToken);
      }
      
      return authResponse;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/medicalcare/auth/logout');
    } catch (error) {
      // Continue logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      TokenManager.clearTokens();
    }
  },

  async refreshToken(refreshToken: string): Promise<UserAuthResponse> {
    try {
      const response = await apiClient.post('/medicalcare/auth/refresh', { refreshToken });
      const authResponse = response.data;
      
      if (authResponse.accessToken && authResponse.refreshToken) {
        TokenManager.setTokens(authResponse.accessToken, authResponse.refreshToken);
      }
      
      return authResponse;
    } catch (error: any) {
      TokenManager.clearTokens();
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  },

  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get('/medicalcare/auth/profile');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể lấy thông tin profile');
    }
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put('/medicalcare/auth/profile', userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể cập nhật profile');
    }
  }
};
