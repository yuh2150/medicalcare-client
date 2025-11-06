'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, AuthContextType, LoginRequest, RegisterRequest, User } from '../types/auth';
import { userAuthApi } from '../api/userAuthApi';
import { TokenManager } from '../api/config';

// Action types for reducer
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; accessToken: string; refreshToken: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_TOKENS'; payload: { accessToken: string; refreshToken: string } };

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
};

// Auth reducer
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

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Khởi tạo auth state từ localStorage khi app load
  useEffect(() => {
    // Skip initialization on server side
    if (typeof window === 'undefined') {
      return;
    }

    const initializeAuth = async () => {
      try {
        const accessToken = TokenManager.getAccessToken();
        const refreshToken = TokenManager.getRefreshToken();

        if (accessToken && refreshToken) {
          // Có token, cố gắng lấy thông tin user
          try {
            const user = await userAuthApi.getProfile();
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: { user, accessToken, refreshToken },
            });
          } catch (error) {
            // Token không hợp lệ, clear tokens
            TokenManager.clearTokens();
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Login function
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

  // Register function
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

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      // Gọi API logout để invalidate token trên server
      await userAuthApi.logout();
    } catch (error) {
      // Nếu API logout thất bại, vẫn logout ở client
      console.error('Logout API error:', error);
    } finally {
      // Clear tokens và reset state
      TokenManager.clearTokens();
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Refresh tokens function
  const refreshTokens = async (): Promise<void> => {
    try {
      const currentRefreshToken = TokenManager.getRefreshToken();
      if (!currentRefreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await userAuthApi.refreshToken(currentRefreshToken);
      const { accessToken, refreshToken } = response;

      TokenManager.setTokens(accessToken, refreshToken);
      dispatch({
        type: 'SET_TOKENS',
        payload: { accessToken, refreshToken },
      });
    } catch (error) {
      // Refresh token hết hạn, logout user
      await logout();
      throw error;
    }
  };

  // Update profile function
  const updateProfile = async (): Promise<void> => {
    try {
      const user = await userAuthApi.getProfile();
      dispatch({ type: 'UPDATE_USER', payload: user });
    } catch (error) {
      console.error('Error updating profile:', error);
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
    // For SSR, return a default state instead of throwing error
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
