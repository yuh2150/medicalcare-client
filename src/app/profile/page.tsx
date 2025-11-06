import ProtectedRoute from '@/routes/ProtectedRoute';
import UserProfile from '@/components/UserProfile';

export default function Profile() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Thông tin cá nhân</h1>
            <p className="mt-2 text-gray-600">
              Quản lý thông tin tài khoản và cài đặt bảo mật của bạn
            </p>
          </div>
          <UserProfile />
        </div>
      </div>
    </ProtectedRoute>
  );
}
