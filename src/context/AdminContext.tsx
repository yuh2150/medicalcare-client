'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AdminUser, AdminLoginRequest, Permission, UserRole } from '../types/admin';
import { adminApi, AdminTokenManager } from '../api/adminApi';
import { useAuth } from './AuthContext';

// Admin State
interface AdminState {
  user: AdminUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: Permission[];
}

// Admin Context Type
interface AdminContextType extends AdminState {
  login: (credentials: AdminLoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole) => boolean;
  canAccessAdmin: () => boolean;
}

// Actions
type AdminAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: { user: AdminUser; accessToken: string; refreshToken: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: AdminUser };

// Initial state
const initialState: AdminState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  permissions: []
};

// Role permissions mapping
const rolePermissions: Record<string, Permission[]> = {
  admin: [
    'users.read', 'users.write', 'users.delete',
    'doctors.read', 'doctors.write', 'doctors.delete',
    'appointments.read', 'appointments.write', 'appointments.delete',
    'orders.read', 'orders.write', 'orders.delete',
    'news.read', 'news.write', 'news.delete',
    'audit.read',
    'admin.read', 'admin.write'
  ],
  doctor: [
    'users.read',
    'doctors.read', 'doctors.write',
    'appointments.read', 'appointments.write',
    'orders.read',
    'news.read', 'news.write'
  ]
};

// Reducer
const adminReducer = (state: AdminState, action: AdminAction): AdminState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'LOGIN_SUCCESS':
      const permissions = rolePermissions[action.payload.user.role] || [];
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        permissions
      };
    
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload
      };
    
    default:
      return state;
  }
};

// Create context
const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Admin Provider
export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);
  const { user: authUser, isAuthenticated: authIsAuthenticated, accessToken: authAccessToken, refreshToken: authRefreshToken } = useAuth();

  // Auto-sync from AuthContext if user has admin/doctor role
  useEffect(() => {
    if (authIsAuthenticated && authUser && ['admin', 'doctor'].includes(authUser.role as string) && !state.isAuthenticated) {
      // Convert AuthUser to AdminUser and sync
      const adminUser = {
        ...authUser,
        role: authUser.role as UserRole,
        status: 'active' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (authAccessToken && authRefreshToken) {
        AdminTokenManager.setTokens(authAccessToken, authRefreshToken);
        localStorage.setItem('admin_user', JSON.stringify(adminUser));
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { 
            user: adminUser, 
            accessToken: authAccessToken, 
            refreshToken: authRefreshToken 
          }
        });
      }
    }
  }, [authIsAuthenticated, authUser, authAccessToken, authRefreshToken, state.isAuthenticated]);

  // Initialize auth state
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const initializeAuth = async () => {
      try {
        const accessToken = AdminTokenManager.getAccessToken();
        const refreshToken = AdminTokenManager.getRefreshToken();

        if (accessToken && refreshToken) {
          // Validate token by checking user data (in real app, call API)
          const userData = localStorage.getItem('admin_user');
          if (userData) {
            const user = JSON.parse(userData);
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: { user, accessToken, refreshToken }
            });
          } else {
            AdminTokenManager.clearTokens();
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Error initializing admin auth:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials: AdminLoginRequest): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await adminApi.login(credentials);
      const { user, accessToken, refreshToken } = response;

      // Save tokens and user data
      AdminTokenManager.setTokens(accessToken, refreshToken);
      localStorage.setItem('admin_user', JSON.stringify(user));

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, accessToken, refreshToken }
      });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await adminApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      AdminTokenManager.clearTokens();
      localStorage.removeItem('admin_user');
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Check permission
  const hasPermission = (permission: Permission): boolean => {
    return state.permissions.includes(permission);
  };

  // Check role
  const hasRole = (role: UserRole): boolean => {
    return state.user?.role === role;
  };

  // Check if user can access admin panel (admin or doctor)
  const canAccessAdmin = (): boolean => {
    return state.user?.role === 'admin' || state.user?.role === 'doctor';
  };

  const contextValue: AdminContextType = {
    ...state,
    login,
    logout,
    hasPermission,
    hasRole,
    canAccessAdmin
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};

// Custom hook
export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    // For SSR compatibility
    if (typeof window === 'undefined') {
      return {
        ...initialState,
        login: async () => {},
        logout: async () => {},
        hasPermission: () => false,
        hasRole: () => false,
        canAccessAdmin: () => false,
      };
    }
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export default AdminContext;
