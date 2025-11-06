'use client';

import React from 'react';
import { AdminProvider } from '@/context/AdminContext';
import AdminLayout from '@/components/admin/AdminLayout';

export default function TestAdminLayout() {
  return (
    <AdminProvider>
      <AdminLayout>
        <div className="p-8">
          <h1 className="text-2xl font-bold">Test Admin Layout</h1>
          <p>Nếu bạn thấy text này cùng với sidebar bên trái, thì AdminLayout đang hoạt động tốt.</p>
        </div>
      </AdminLayout>
    </AdminProvider>
  );
}
