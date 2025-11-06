'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminProvider } from '@/context/AdminContext';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminDashboard from '@/components/admin/AdminDashboard';
import UsersPage from '@/pages/admin/UsersPage';
import DoctorsPage from '@/pages/admin/DoctorsPage';
import SpecialistsPage from '@/pages/admin/SpecialistsPage';
import PlansPage from '@/pages/admin/PlansPage';
import AppointmentsPage from '@/pages/admin/AppointmentsPage';
import OrdersPage from '@/pages/admin/OrdersPage';
import NewsPage from '@/pages/admin/NewsPage';
import ImagesPage from '@/pages/admin/ImagesPage';
import AuditLogsPage from '@/pages/admin/AuditLogsPage';

export default function AdminApp() {
  const pathname = usePathname();
  
  // Determine which component to render based on the pathname
  const renderContent = () => {
    if (pathname === '/admin/login') {
      return <AdminLoginPage />;
    }

    // All other admin routes need authentication
    return (
      <AdminProtectedRoute>
        <AdminLayout>
          {(() => {
            switch (pathname) {
              case '/admin':
              case '/admin/dashboard':
                return <AdminDashboard />;
              case '/admin/users':
                return <UsersPage />;
              case '/admin/doctors':
                return <AdminProtectedRoute requiredPermission="doctors.write">
                  <DoctorsPage />
                </AdminProtectedRoute>;
              case '/admin/specialists':
                return <AdminProtectedRoute requiredPermission="doctors.write">
                  <SpecialistsPage />
                </AdminProtectedRoute>;
              case '/admin/plans':
                return <AdminProtectedRoute requiredPermission="doctors.write">
                  <PlansPage />
                </AdminProtectedRoute>;
              case '/admin/orders':
                return <AdminProtectedRoute requiredPermission="orders.write">
                  <OrdersPage />
                </AdminProtectedRoute>;
              case '/admin/appointments':
                return <AdminProtectedRoute requiredPermission="appointments.write">
                  <AppointmentsPage />
                </AdminProtectedRoute>;
              case '/admin/news':
                return <AdminProtectedRoute requiredPermission="news.write">
                  <NewsPage />
                </AdminProtectedRoute>;
              case '/admin/images':
                return <AdminProtectedRoute requiredPermission="news.write">
                  <ImagesPage />
                </AdminProtectedRoute>;
              case '/admin/audit-logs':
                return <AdminProtectedRoute requiredPermission="audit.read" requiredRole="admin">
                  <AuditLogsPage />
                </AdminProtectedRoute>;
              case '/admin/test-roles':
                return (
                  <div className="text-center py-12">
                    <p className="text-gray-600">Truy cập /admin/test-roles để kiểm tra hệ thống role</p>
                  </div>
                );
              default:
                return (
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">404 - Không tìm thấy trang</h1>
                    <p className="text-gray-600">Trang bạn đang tìm kiếm không tồn tại.</p>
                  </div>
                );
            }
          })()}
        </AdminLayout>
      </AdminProtectedRoute>
    );
  };

  return (
    <AdminProvider>
      {renderContent()}
    </AdminProvider>
  );
}
