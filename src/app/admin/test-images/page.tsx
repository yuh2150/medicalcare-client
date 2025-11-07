'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { ImagesPage } from '@/components/admin';

// Mock user cho testing
const mockUser = {
  id: '1',
  email: 'admin@test.com',
  name: 'Admin Test',
  role: 'admin' as const,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  status: 'active' as const
};

// Mock admin context
const MockAdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div data-mock-admin="true">
      {children}
    </div>
  );
};

export default function TestImagesWithSidebar() {
  return (
    <MockAdminProvider>
      <AdminLayout>
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Test Images Page với Sidebar</h1>
          <p className="mb-4">Đây là test page để xem sidebar có hiển thị không.</p>
          <div className="bg-white rounded-lg shadow p-4">
            <ImagesPage />
          </div>
        </div>
      </AdminLayout>
    </MockAdminProvider>
  );
}
