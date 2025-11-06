'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';

export default function AuthSyncTestPage() {
  const { user: authUser, isAuthenticated: authAuthenticated, login: authLogin, logout: authLogout } = useAuth();
  const { user: adminUser, isAuthenticated: adminAuthenticated, canAccessAdmin } = useAdmin();

  const handleLogin = async (email: string, password: string) => {
    try {
      await authLogin({ email, password });
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed: ' + (error as Error).message);
    }
  };

  const handleLogout = async () => {
    try {
      await authLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Test Auth Sync
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* AuthContext Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                AuthContext Status
              </h2>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Authenticated:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    authAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {authAuthenticated ? 'Yes' : 'No'}
                  </span>
                </div>
                {authUser && (
                  <>
                    <div>
                      <span className="font-medium">Email:</span>
                      <span className="ml-2">{authUser.email}</span>
                    </div>
                    <div>
                      <span className="font-medium">Name:</span>
                      <span className="ml-2">{authUser.name}</span>
                    </div>
                    <div>
                      <span className="font-medium">Role:</span>
                      <span className="ml-2 px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                        {authUser.role}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* AdminContext Status */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-900 mb-4">
                AdminContext Status
              </h2>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Authenticated:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    adminAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {adminAuthenticated ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Can Access Admin:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    canAccessAdmin() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {canAccessAdmin() ? 'Yes' : 'No'}
                  </span>
                </div>
                {adminUser && (
                  <>
                    <div>
                      <span className="font-medium">Email:</span>
                      <span className="ml-2">{adminUser.email}</span>
                    </div>
                    <div>
                      <span className="font-medium">Name:</span>
                      <span className="ml-2">{adminUser.name}</span>
                    </div>
                    <div>
                      <span className="font-medium">Role:</span>
                      <span className="ml-2 px-2 py-1 rounded text-sm bg-green-100 text-green-800">
                        {adminUser.role}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Test Login Buttons */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Login</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleLogin('admin@medical.com', 'admin123')}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                disabled={authAuthenticated}
              >
                Login as Admin
              </button>
              <button
                onClick={() => handleLogin('doctor@medical.com', 'doctor123')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={authAuthenticated}
              >
                Login as Doctor
              </button>
              <button
                onClick={() => handleLogin('customer@medical.com', 'customer123')}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                disabled={authAuthenticated}
              >
                Login as Customer
              </button>
            </div>
            
            {authAuthenticated && (
              <button
                onClick={handleLogout}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-4">
              <a
                href="/admin"
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  canAccessAdmin()
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                {...(!canAccessAdmin() && { 'aria-disabled': true })}
              >
                Go to Admin Panel
              </a>
              <a
                href="/admin/test-roles"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
              >
                Admin Role Test
              </a>
              <a
                href="/"
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm font-medium"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
