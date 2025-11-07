'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, AuthContextType, LoginRequest, RegisterRequest, User } from '../types/auth';
import { userAuthApi } from '../services/userAuthApi';
import { TokenManager } from '../services/config';

// Các loại hành động cho reducer
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; accessToken: string; refreshToken: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_TOKENS'; payload: { accessToken: string; refreshToken: string } };

// Trạng thái ban đầu
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
};

// Auth reducer - Bộ xử lý trạng thái xác thực
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_TOKENS':
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    default:
      return state;
  }
};

// Tạo context xác thực
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Component cung cấp xác thực
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Khởi tạo auth state từ localStorage khi app load
  useEffect(() => {
    // Bỏ qua khởi tạo ở phía server
    if (typeof window === 'undefined') {
      return;
    }

    const initializeAuth = async () => {
      try {
        const accessToken = TokenManager.getAccessToken();
        const refreshToken = TokenManager.getRefreshToken();

        if (accessToken && refreshToken) {
          // Có token, cố gắng lấy thông tin người dùng
          try {
            const user = await userAuthApi.getProfile();
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: { user, accessToken, refreshToken },
            });
          } catch (error) {
            // Token không hợp lệ, xóa tokens
            TokenManager.clearTokens();
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Lỗi khởi tạo xác thực:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Hàm đăng nhập
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await userAuthApi.login(credentials);
      const { user, accessToken, refreshToken } = response;

      // Lưu tokens vào localStorage
      TokenManager.setTokens(accessToken, refreshToken);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, accessToken, refreshToken },
      });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  // Hàm đăng ký
  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await userAuthApi.register(userData);
      const { user, accessToken, refreshToken } = response;

      // Lưu tokens vào localStorage
      TokenManager.setTokens(accessToken, refreshToken);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, accessToken, refreshToken },
      });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  // Hàm đăng xuất
  const logout = async (): Promise<void> => {
    try {
      // Gọi API đăng xuất để vô hiệu hóa token trên server
      await userAuthApi.logout();
    } catch (error) {
      // Nếu API đăng xuất thất bại, vẫn đăng xuất ở client
      console.error('Lỗi API đăng xuất:', error);
    } finally {
      // Xóa tokens và reset trạng thái
      TokenManager.clearTokens();
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Hàm làm mới tokens
  const refreshTokens = async (): Promise<void> => {
    try {
      const currentRefreshToken = TokenManager.getRefreshToken();
      if (!currentRefreshToken) {
        throw new Error('Không có refresh token khả dụng');
      }

      const response = await userAuthApi.refreshToken(currentRefreshToken);
      const { accessToken, refreshToken } = response;

      TokenManager.setTokens(accessToken, refreshToken);
      dispatch({
        type: 'SET_TOKENS',
        payload: { accessToken, refreshToken },
      });
    } catch (error) {
      // Refresh token hết hạn, đăng xuất người dùng
      await logout();
      throw error;
    }
  };

  // Hàm cập nhật hồ sơ
  const updateProfile = async (): Promise<void> => {
    try {
      const user = await userAuthApi.getProfile();
      dispatch({ type: 'UPDATE_USER', payload: user });
    } catch (error) {
      console.error('Lỗi cập nhật hồ sơ:', error);
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshTokens,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để sử dụng AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Đối với SSR, trả về trạng thái mặc định thay vì throw error
    if (typeof window === 'undefined') {
      return {
        ...initialState,
        login: async () => {},
        register: async () => {},
        logout: async () => {},
        refreshTokens: async () => {},
        updateProfile: async () => {},
      };
    }
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
};

export default AuthContext;
