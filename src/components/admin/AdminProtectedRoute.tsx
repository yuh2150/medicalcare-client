'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../../context/AdminContext';
import { Permission, UserRole } from '../../types/admin';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
  requiredRole?: UserRole;
  redirectTo?: string;
}

// Loading spinner
const AdminLoadingSpinner: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p className="mt-4 text-gray-600">Đang kiểm tra quyền truy cập...</p>
    </div>
  </div>
);

// Permission denied component
const AdminPermissionDenied: React.FC<{ message?: string }> = ({ 
  message = "Bạn không có quyền truy cập trang này." 
}) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Truy cập bị từ chối
        </h2>
        
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Quay lại
          </button>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Về Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Admin Protected Route component
const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredRole,
  redirectTo = '/admin/login'
}) => {
  const { user, isAuthenticated, isLoading, hasPermission, hasRole, canAccessAdmin } = useAdmin();
  const router = useRouter();

  // Show loading while checking authentication
  if (isLoading) {
    return <AdminLoadingSpinner />;
  }

  // Not authenticated - redirect to admin login
  if (!isAuthenticated || !user) {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname + window.location.search;
      sessionStorage.setItem('adminRedirectAfterLogin', currentPath);
    }
    
    router.push(redirectTo);
    return <AdminLoadingSpinner />;
  }

  // Check if user can access admin panel (admin or doctor only)
  if (!canAccessAdmin()) {
    const message = "Chỉ Admin và Bác sĩ mới có thể truy cập trang quản trị.";
    return <AdminPermissionDenied message={message} />;
  }

  // Check role requirement if specified
  if (requiredRole && !hasRole(requiredRole)) {
    const roleNames: Record<UserRole, string> = {
      admin: 'Admin',
      doctor: 'Bác sĩ', 
      customer: 'Khách hàng'
    };
    const message = `Chỉ ${roleNames[requiredRole]} mới có thể truy cập trang này.`;
    return <AdminPermissionDenied message={message} />;
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    const message = "Bạn không có quyền truy cập chức năng này.";
    return <AdminPermissionDenied message={message} />;
  }

  // User has required permissions
  return <>{children}</>;
};

// HOC wrapper for admin routes
export const withAdminAuth = <P extends object>(
  Component: React.ComponentType<P>,
  options?: { 
    requiredPermission?: Permission; 
    requiredRole?: UserRole;
    redirectTo?: string;
  }
) => {
  const AdminAuthenticatedComponent: React.FC<P> = (props) => {
    return (
      <AdminProtectedRoute {...options}>
        <Component {...props} />
      </AdminProtectedRoute>
    );
  };

  AdminAuthenticatedComponent.displayName = `withAdminAuth(${Component.displayName || Component.name})`;
  
  return AdminAuthenticatedComponent;
};

// Specific route wrappers
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AdminProtectedRoute requiredRole="admin">
      {children}
    </AdminProtectedRoute>
  );
};

export const DoctorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AdminProtectedRoute requiredRole="doctor">
      {children}
    </AdminProtectedRoute>
  );
};

// Permission-based wrapper
export const PermissionRoute: React.FC<{ 
  children: React.ReactNode; 
  permission: Permission 
}> = ({ children, permission }) => {
  return (
    <AdminProtectedRoute requiredPermission={permission}>
      {children}
    </AdminProtectedRoute>
  );
};

export default AdminProtectedRoute;
