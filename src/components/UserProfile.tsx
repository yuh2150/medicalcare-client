'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Shield, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

const UserProfile: React.FC = () => {
  const { user, logout, updateProfile, isAuthenticated } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [testingAdmin, setTestingAdmin] = useState(false);
  const [adminTestResult, setAdminTestResult] = useState<string>('');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setIsUpdating(true);
      await updateProfile();
    } catch (error) {
      console.error('Update profile error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa đăng nhập</h3>
          <p className="mt-1 text-sm text-gray-500">
            Vui lòng đăng nhập để xem thông tin profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-6">
      {/* User Information Card */}
      <div className="bg-white overflow-hidden shadow-lg rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <div className="ml-5 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.role === 'admin' ? (
                      <Shield className="w-3 h-3 mr-1" />
                    ) : (
                      <User className="w-3 h-3 mr-1" />
                    )}
                    {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                  </span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">User ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">{user.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Vai trò</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{user.role}</dd>
                </div>
                {user.createdAt && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Ngày tạo</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </dd>
                  </div>
                )}
                {user.updatedAt && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Cập nhật lần cuối</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(user.updatedAt).toLocaleDateString('vi-VN')}
                    </dd>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="bg-gray-50 px-4 py-4 sm:px-6">
          <div className="flex space-x-3">
            <button
              onClick={handleUpdateProfile}
              disabled={isUpdating}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <RefreshCw className={`-ml-1 mr-2 h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
              {isUpdating ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
            </button>
            
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut className="-ml-1 mr-2 h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* JWT Token Info (for development) */}
      <div className="bg-white overflow-hidden shadow-lg rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Token Information (Development)
          </h3>
          <div className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Access Token có sẵn</dt>
              <dd className="mt-1 flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-green-800">Có</span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Refresh Token có sẵn</dt>
              <dd className="mt-1 flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-green-800">Có</span>
              </dd>
            </div>
            <div className="text-xs text-gray-500">
              <p>• Tokens được lưu trong localStorage</p>
              <p>• Auto refresh khi access token hết hạn</p>
              <p>• Tự động redirect về login khi refresh token hết hạn</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
