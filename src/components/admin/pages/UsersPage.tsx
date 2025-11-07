'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  UserCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import AdminTable, { Column } from '@/components/admin/AdminTable';
import { AdminUser, UserRole, TableFilter, BulkAction } from '../../../types/admin';

import { userApi } from '@/services/adminApi';

const USER_ROLES = {
  admin: 'Quản trị viên',
  doctor: 'Bác sĩ',
  customer: 'Khách hàng'
} as const;

const USER_STATUS = {
  active: 'Hoạt động',
  inactive: 'Không hoạt động'
} as const;

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 10
  });
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userCount, setUserCount] = useState<number>(0);

  const openUserModal = useCallback((user: AdminUser | null = null) => {
    setEditingUser(user);
    setShowUserModal(true);
  }, []);

  const closeUserModal = useCallback(() => {
    setShowUserModal(false);
    setEditingUser(null);
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userApi.getUsers({
        page: pagination.current,
        limit: pagination.pageSize
      });
      
      setUsers(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.pagination?.total || response.data?.length || 0
      }));
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
      alert('Có lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize]);

  const loadUserCount = useCallback(async () => {
    try {
      const response = await userApi.getUsersCount();
      setUserCount(response.count || 0);
    } catch (error) {
      console.error('Error loading user count:', error);
    }
  }, []);

  useEffect(() => {
    loadUsers();
    loadUserCount();
  }, [loadUsers, loadUserCount]);

  const handleBulkAction = useCallback(async (action: string, keys: string[]) => {
    if (!keys || keys.length === 0) {
      alert('Vui lòng chọn ít nhất một mục');
      return;
    }

    // Validate all selected IDs
    const validKeys = keys.filter(key => key?.trim());
    if (validKeys.length === 0) {
      alert('Không có ID hợp lệ nào được chọn');
      return;
    }

    console.log('Bulk action:', action, 'for IDs:', validKeys);

    const actionText = action === 'delete' ? 'xóa' : 
                     action === 'activate' ? 'kích hoạt' : 'vô hiệu hóa';
    
    if (!confirm(`Bạn có chắc chắn muốn ${actionText} ${validKeys.length} người dùng?`)) {
      return;
    }

    try {
      const response = await userApi.bulkAction({ 
        key: action,
        label: actionText,
        action, 
        ids: validKeys 
      });
      
      if (response.success) {
        await loadUsers();
        await loadUserCount();
        setSelectedKeys([]);
        alert(response.message || `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} thành công!`);
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra');
      }
    } catch (error: any) {
      console.error('Bulk action error:', error);
      alert(error.message || 'Có lỗi xảy ra!');
    }
  }, [loadUsers, loadUserCount]);

  const handleDeleteUser = useCallback(async (userId: string) => {
    // Validate user ID
    if (!userId?.trim()) {
      alert('ID người dùng không hợp lệ');
      return;
    }

    console.log('Attempting to delete user with ID:', userId);
    
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;

    try {
      const response = await userApi.deleteUser(userId);
      if (response.success) {
        await loadUsers();
        await loadUserCount();
        alert('Xóa thành công!');
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra');
      }
    } catch (error: any) {
      console.error('Delete user error:', error);
      alert(error.message || 'Có lỗi xảy ra!');
    }
  }, [loadUsers, loadUserCount]);

  const columns: Column<AdminUser>[] = [
    {
      key: 'avatar',
      title: 'Avatar',
      width: '80px',
      render: (value, record) => (
        <div className="shrink-0 h-10 w-10">
          {record.avatar ? (
            <img 
              className="h-10 w-10 rounded-full object-cover" 
              src={record.avatar} 
              alt={record.name} 
            />
          ) : (
            <UserCircleIcon className="h-10 w-10 text-gray-400" />
          )}
        </div>
      )
    },
    {
      key: 'name',
      title: 'Thông tin',
      sortable: true,
      render: (value, record) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{record.name}</div>
          <div className="text-sm text-gray-500">{record.email}</div>
          {record.phone && (
            <div className="text-sm text-gray-500">{record.phone}</div>
          )}
        </div>
      )
    },
    {
      key: 'role',
      title: 'Vai trò',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
          value === 'admin' ? 'bg-purple-100 text-purple-800' :
          value === 'doctor' ? 'bg-blue-100 text-blue-800' : 
          'bg-gray-100 text-gray-800'
        }`}>
          {USER_ROLES[value as keyof typeof USER_ROLES] || value}
        </span>
      )
    },
    {
      key: 'status',
      title: 'Trạng thái',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
          value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value === 'active' ? (
            <>
              <CheckCircleIcon className="h-3 w-3 mr-1" />
              {USER_STATUS.active}
            </>
          ) : (
            <>
              <XCircleIcon className="h-3 w-3 mr-1" />
              {USER_STATUS.inactive}
            </>
          )}
        </span>
      )
    },
    {
      key: 'createdAt',
      title: 'Ngày tạo',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('vi-VN')
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '120px',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openUserModal(record)}
            className="text-yellow-600 hover:text-yellow-800"
            title="Chỉnh sửa"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteUser(record.id)}
            className="text-red-600 hover:text-red-800"
            title="Xóa"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const filters: TableFilter[] = [
    {
      key: 'role',
      label: 'Vai trò',
      type: 'select',
      options: Object.entries(USER_ROLES).map(([value, label]) => ({ label, value }))
    },
    {
      key: 'status',
      label: 'Trạng thái',
      type: 'select',
      options: Object.entries(USER_STATUS).map(([value, label]) => ({ label, value }))
    },
    {
      key: 'createdFrom',
      label: 'Từ ngày',
      type: 'date'
    },
    {
      key: 'createdTo',
      label: 'Đến ngày',
      type: 'date'
    }
  ];

  const bulkActions: BulkAction[] = [
    {
      key: 'activate',
      label: 'Kích hoạt',
      icon: CheckCircleIcon
    },
    {
      key: 'deactivate',
      label: 'Vô hiệu hóa',
      icon: XCircleIcon
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: TrashIcon,
      danger: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
          <p className="text-gray-600">
            Quản lý tài khoản người dùng hệ thống 
            {userCount > 0 && <span className="ml-2">• Tổng: {userCount} người dùng</span>}
          </p>
        </div>
        <button
          onClick={() => openUserModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4" />
          Thêm người dùng
        </button>
      </div>

      <AdminTable
        data={users}
        columns={columns}
        loading={loading}
        pagination={{
          current: pagination.current,
          total: pagination.total,
          pageSize: pagination.pageSize,
          onChange: (page, pageSize) => setPagination(prev => ({ 
            ...prev, 
            current: page, 
            pageSize: pageSize || prev.pageSize 
          }))
        }}
        selection={{
          selectedKeys,
          onChange: setSelectedKeys,
          getRowKey: (record) => record.id
        }}
        filters={filters}
        bulkActions={bulkActions}
        onBulkAction={handleBulkAction}
        onExport={() => {
          alert('Tính năng xuất dữ liệu sẽ được triển khai sau');
        }}
      />

      {/* User Modal */}
      {showUserModal && (
        <UserModal
          user={editingUser}
          onClose={closeUserModal}
          onSave={() => {
            loadUsers();
            loadUserCount();
            closeUserModal();
          }}
        />
      )}
    </div>
  );
}

// User Modal Component
interface UserModalProps {
  user: AdminUser | null;
  onClose: () => void;
  onSave: () => void;
}

function UserModal({ user, onClose, onSave }: UserModalProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'customer' as UserRole,
    status: user?.status || 'active' as 'active' | 'inactive',
    phone: user?.phone || '',
    password: '', // Password field for create/update
    avatar: user?.avatar || ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation functions
  const validateEmail = (email: string): string | null => {
    if (!email.trim()) return 'Email là bắt buộc';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return 'Email không hợp lệ';
    return null;
  };

  const validatePhone = (phone: string): string | null => {
    if (!phone.trim()) return null; // Phone is optional
    const phoneRegex = /^\+[1-9]\d{1,14}$/; // E.164 format
    if (!phoneRegex.test(phone.trim())) return 'Số điện thoại phải theo định dạng E.164 (ví dụ: +84987654321)';
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!user && !password.trim()) return 'Mật khẩu là bắt buộc khi tạo người dùng mới';
    if (password.trim() && password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên là bắt buộc';
    }

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Prepare data - remove password if empty for updates
      const submitData: any = { ...formData };
      if (user && !submitData.password.trim()) {
        delete submitData.password;
      }

      console.log('Submitting user form:', { ...submitData, password: submitData.password ? '[HIDDEN]' : undefined });

      const apiCall = user 
        ? userApi.updateUser(user.id, submitData)
        : userApi.createUser(submitData);

      const response = await apiCall;
      if (response.success) {
        alert(user ? 'Cập nhật thành công!' : 'Tạo người dùng thành công!');
        onSave();
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra');
      }
    } catch (error: any) {
      console.error('Save user error:', error);
      alert(error.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            {user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, name: e.target.value }));
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                className={`w-full border rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, email: e.target.value }));
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                className={`w-full border rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
                <span className="text-gray-500 text-xs ml-1">(định dạng E.164: +84987654321)</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, phone: e.target.value }));
                  if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                }}
                placeholder="+84987654321"
                className={`w-full border rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu {!user && '*'}
                {user && <span className="text-gray-500 text-xs ml-1">(để trống nếu không muốn thay đổi)</span>}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, password: e.target.value }));
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                }}
                className={`w-full border rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Avatar Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Avatar
              </label>
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  avatar: e.target.value 
                }))}
                placeholder="https://example.com/avatar.jpg"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vai trò *
              </label>
              <select
                required
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  role: e.target.value as UserRole 
                }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(USER_ROLES).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  status: e.target.value as 'active' | 'inactive' 
                }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(USER_STATUS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Đang lưu...' : (user ? 'Cập nhật' : 'Tạo mới')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
