'use client';

import React from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { Shield, User, Stethoscope, ShoppingCart } from 'lucide-react';

export default function TestRolesPage() {
  const { user, hasRole, canAccessAdmin } = useAdmin();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Vui lòng đăng nhập để kiểm tra roles
          </h1>
          <a
            href="/admin/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Đăng nhập Admin
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Kiểm tra hệ thống Role
          </h1>

          {/* Current User Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">
              Thông tin người dùng hiện tại
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-blue-700">Email:</span>
                <p className="text-blue-900">{user.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-blue-700">Tên:</span>
                <p className="text-blue-900">{user.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-blue-700">Role:</span>
                <p className="text-blue-900 font-semibold">{user.role}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-blue-700">Trạng thái:</span>
                <p className="text-blue-900">{user.status}</p>
              </div>
            </div>
          </div>

          {/* Role Checks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-red-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Admin Role</h3>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
                hasRole('admin') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {hasRole('admin') ? '✓ Có quyền Admin' : '✗ Không có quyền Admin'}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Stethoscope className="h-8 w-8 text-blue-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Doctor Role</h3>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
                hasRole('doctor') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {hasRole('doctor') ? '✓ Có quyền Doctor' : '✗ Không có quyền Doctor'}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <ShoppingCart className="h-8 w-8 text-green-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Customer Role</h3>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
                hasRole('customer') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {hasRole('customer') ? '✓ Có quyền Customer' : '✗ Không có quyền Customer'}
              </div>
            </div>
          </div>

          {/* Admin Access Check */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-yellow-900 mb-4">
              Kiểm tra quyền truy cập Admin Panel
            </h2>
            <div className={`px-4 py-2 rounded-lg text-sm font-medium inline-block ${
              canAccessAdmin() 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {canAccessAdmin() 
                ? '✓ Có thể truy cập Admin Panel (Admin hoặc Doctor)' 
                : '✗ Không thể truy cập Admin Panel (chỉ Customer)'}
            </div>
          </div>

          {/* Role-specific Information */}
          {user.role === 'doctor' && user.specialties && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                Thông tin Doctor
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-blue-700">Chuyên khoa:</span>
                  <p className="text-blue-900">
                    {user.specialties.map(s => s.name).join(', ')}
                  </p>
                </div>
                {user.licenseNumber && (
                  <div>
                    <span className="text-sm font-medium text-blue-700">Số giấy phép:</span>
                    <p className="text-blue-900">{user.licenseNumber}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {user.role === 'customer' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-green-900 mb-4">
                Thông tin Customer
              </h2>
              <p className="text-green-700">
                Customer không có quyền truy cập Admin Panel. Chỉ có thể sử dụng các tính năng dành cho khách hàng.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex flex-wrap gap-4">
            <a
              href="/admin/dashboard"
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                canAccessAdmin()
                  ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                  : 'text-gray-400 bg-gray-200 cursor-not-allowed'
              }`}
              {...(!canAccessAdmin() && { 'aria-disabled': true })}
            >
              Đi đến Dashboard
            </a>
            <a
              href="/admin/login"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Đăng nhập tài khoản khác
            </a>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
