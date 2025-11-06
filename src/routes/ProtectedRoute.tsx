'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { User } from '../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

// Loading component
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}></div>
    </div>
  );
};

// Unauthorized access component
const UnauthorizedAccess: React.FC<{ message?: string }> = ({ 
  message = "Bạn không có quyền truy cập trang này." 
}) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-red-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Truy cập bị từ chối
        </h2>
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Quay lại
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to check if user has required permissions
const hasRequiredPermissions = (user: User | null, requireAdmin: boolean): boolean => {
  if (!user) return false;
  if (requireAdmin && user.role !== 'admin') return false;
  return true;
};

// Main ProtectedRoute component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  redirectTo = '/login'
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    // Save current path to redirect back after login
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname + window.location.search;
      sessionStorage.setItem('redirectAfterLogin', currentPath);
    }
    
    router.push(redirectTo);
    return <LoadingSpinner size="lg" />;
  }

  // Check if user has required permissions
  if (!hasRequiredPermissions(user, requireAdmin)) {
    const message = requireAdmin 
      ? "Chỉ quản trị viên mới có thể truy cập trang này."
      : "Bạn không có quyền truy cập trang này.";
    
    return <UnauthorizedAccess message={message} />;
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
};

// Higher-order component wrapper
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  options?: { requireAdmin?: boolean; redirectTo?: string }
) => {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };

  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  
  return AuthenticatedComponent;
};

// Admin route wrapper
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute requireAdmin={true}>
      {children}
    </ProtectedRoute>
  );
};

export default ProtectedRoute;
