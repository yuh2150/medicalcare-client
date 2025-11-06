import { apiClient } from './config';
import { TokenManager } from './config';
import { AdminAuthResponse, AdminLoginRequest } from '../types/admin';

export const authApi = {
  async login(credentials: AdminLoginRequest): Promise<AdminAuthResponse> {
    try {
      const response = await apiClient.post('/medicalcare/auth/login', credentials);
      const authResponse = response.data;
      
      // Check if user has admin or doctor role
      if (!authResponse.user || !['admin', 'doctor'].includes(authResponse.user.role)) {
        throw new Error('Bạn không có quyền truy cập trang quản trị');
      }
      
      // Store tokens if provided
      if (authResponse.accessToken && authResponse.refreshToken) {
        TokenManager.setTokens(authResponse.accessToken, authResponse.refreshToken);
      }
      
      return authResponse;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
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

  async refreshToken(): Promise<AdminAuthResponse> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
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
  }
};
