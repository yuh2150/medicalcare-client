'use client';

import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import AdminTable, { Column } from '@/components/admin/AdminTable';
import { Specialty, TableFilter, BulkAction } from '../../../types/admin';
import { specialistApi } from '@/services/adminApi';
import { RichTextEditor, HTMLContent } from '@/components/ui';

export default function SpecialistsPage() {
  const [specialists, setSpecialists] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 10
  });
  const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
  const [specialistCount, setSpecialistCount] = useState<number>(0);

  useEffect(() => {
    loadSpecialists();
    loadSpecialistCount();
  }, [pagination.current, pagination.pageSize]);

  const loadSpecialistCount = async () => {
    try {
      const response = await specialistApi.getSpecialistsCount();
      setSpecialistCount(response.count || 0);
    } catch (error) {
      console.error('Error loading specialist count:', error);
    }
  };

  const loadSpecialists = async () => {
    try {
      setLoading(true);
      const response = await specialistApi.getSpecialists({
        page: pagination.current,
        limit: pagination.pageSize
      });
      
      setSpecialists(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total
      }));
    } catch (error) {
      console.error('Error loading specialists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Validate ID
    if (!id?.trim()) {
      alert('ID chuyên khoa không hợp lệ');
      return;
    }

    console.log('Attempting to delete specialist with ID:', id);
    
    if (window.confirm('Bạn có chắc chắn muốn xóa chuyên khoa này?')) {
      try {
        const result = await specialistApi.deleteSpecialist(id);
        if (result.success) {
          loadSpecialists(); // Reload data
          loadSpecialistCount(); // Reload count
          alert('Xóa chuyên khoa thành công!');
        } else {
          throw new Error(result.message || 'Có lỗi xảy ra');
        }
      } catch (error: any) {
        console.error('Error deleting specialist:', error);
        alert(error.message || 'Có lỗi xảy ra khi xóa chuyên khoa');
      }
    }
  };

  const handleBulkAction = async (action: string, selectedIds: string[]) => {
    if (!selectedIds || selectedIds.length === 0) {
      alert('Vui lòng chọn ít nhất một mục');
      return;
    }

    // Validate all selected IDs
    const validIds = selectedIds.filter(id => id?.trim());
    if (validIds.length === 0) {
      alert('Không có ID hợp lệ nào được chọn');
      return;
    }

    console.log('Bulk action:', action, 'for IDs:', validIds);

    const actionText = action === 'delete' ? 'xóa' : action;

    if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} ${validIds.length} chuyên khoa đã chọn?`)) {
      return;
    }

    try {
      const response = await specialistApi.bulkAction({ 
        key: action,
        label: actionText,
        action, 
        ids: validIds 
      });
      
      if (response.success) {
        setSelectedKeys([]);
        loadSpecialists();
        loadSpecialistCount(); // Reload count
        alert(response.message || `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} thành công!`);
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra');
      }
    } catch (error: any) {
      console.error('Error performing bulk action:', error);
      alert(error.message || 'Có lỗi xảy ra!');
    }
  };

  const columns: Column<Specialty>[] = [
    {
      key: 'image',
      title: 'Hình ảnh',
      render: (_, specialty) => (
        <div className="shrink-0 h-10 w-10">
          {specialty.image ? (
            <img 
              className="h-10 w-10 rounded-full object-cover" 
              src={specialty.image} 
              alt={specialty.name} 
            />
          ) : (
            <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-xs">N/A</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      title: 'Tên chuyên khoa',
      sortable: true,
      render: (_, specialty) => (
        <div className="min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            {specialty.name}
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      title: 'Mô tả',
      render: (_, specialty) => (
        <div className="max-w-md">
          <div 
            className="text-sm text-gray-600 overflow-hidden"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical' as any,
              lineHeight: '1.4em',
              maxHeight: '4.2em'
            }}
          >
            {specialty.description ? (
              <HTMLContent 
                content={specialty.description} 
                maxLength={120}
                showReadMore={false}
                className="text-sm text-gray-600"
                enableLinks={false}
                enableTables={false}
              />
            ) : (
              <span className="text-gray-400 italic">Chưa có mô tả</span>
            )}
          </div>
        </div>
      ),
      // width: '300px'
    },
    {
      key: 'createdAt',
      title: 'Ngày tạo',
      sortable: true,
      render: (_, specialty) => new Date(specialty.createdAt).toLocaleDateString('vi-VN'),
      width: '120px'
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '120px',
      render: (_, record) => (
        <div className="flex items-center gap-2">

          <button
            onClick={() => {
              setEditingSpecialty(record);
              setShowSpecialtyModal(true);
            }}
            className="text-yellow-600 hover:text-yellow-800"
            title="Chỉnh sửa"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              const specialtyId = record.id || (record as any)._id;
              if (specialtyId) handleDelete(specialtyId);
            }}
            className="text-red-600 hover:text-red-800"
            title="Xóa"
            disabled={!record.id && !(record as any)._id}
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const filters: TableFilter[] = [
    {
      key: 'name',
      label: 'Tên chuyên khoa',
      type: 'text',
      placeholder: 'Tìm kiếm theo tên...'
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
      key: 'delete',
      label: 'Xóa',
      icon: TrashIcon,
      danger: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý chuyên khoa</h1>
          <p className="text-gray-600">
            Quản lý thông tin chuyên khoa trong hệ thống
            {specialistCount > 0 && <span className="ml-2">• Tổng: {specialistCount} chuyên khoa</span>}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingSpecialty(null);
            setShowSpecialtyModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4" />
          Thêm chuyên khoa
        </button>
      </div>

      {/* Table */}
      <AdminTable
        data={specialists}
        columns={columns}
        loading={loading}
        pagination={{
          current: pagination.current,
          total: pagination.total,
          pageSize: pagination.pageSize,
          onChange: (page, pageSize) => setPagination(prev => ({ ...prev, current: page, pageSize }))
        }}
        selection={{
          selectedKeys,
          onChange: setSelectedKeys,
          getRowKey: (record) => record.id || (record as any)._id || 'unknown'
        }}
        filters={filters}
        bulkActions={bulkActions}
        onBulkAction={handleBulkAction}
        onExport={() => {
          alert('Tính năng xuất CSV sẽ được triển khai sau');
        }}
      />

      {/* Specialty Modal */}
      {showSpecialtyModal && (
        <SpecialtyModal
          specialty={editingSpecialty}
          onClose={() => {
            setShowSpecialtyModal(false);
            setEditingSpecialty(null);
          }}
          onSave={() => {
            loadSpecialists();
            loadSpecialistCount(); // Reload count
            setShowSpecialtyModal(false);
            setEditingSpecialty(null);
          }}
        />
      )}


    </div>
  );
}

// Modal component for Add/Edit Specialty
interface SpecialtyModalProps {
  specialty: Specialty | null;
  onClose: () => void;
  onSave: () => void;
}

const SpecialtyModal: React.FC<SpecialtyModalProps> = ({ specialty, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: specialty?.name || '',
    description: specialty?.description || '',
    image: specialty?.image || ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation functions
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên chuyên khoa là bắt buộc';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Tên chuyên khoa không được vượt quá 100 ký tự';
    }

    if (formData.image.trim() && formData.image.trim().length > 500) {
      newErrors.image = 'URL hình ảnh không được vượt quá 500 ký tự';
    }

    if (formData.description.trim() && formData.description.trim().length > 2000) {
      newErrors.description = 'Mô tả không được vượt quá 2000 ký tự';
    }

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
      console.log('Submitting specialty form:', formData);

      if (specialty) {
        // Debug logging for specialty object
        console.log('Specialty object:', specialty);
        console.log('Specialty ID:', specialty.id);
        console.log('Specialty _id:', (specialty as any)._id);
        
        // Check for valid ID from multiple possible sources
        const specialtyId = specialty.id || (specialty as any)._id;
        if (!specialtyId?.trim()) {
          throw new Error('Không tìm thấy ID hợp lệ của chuyên khoa để cập nhật');
        }
        
        console.log('Using specialty ID for update:', specialtyId);
        
        // Update existing specialty
        const result = await specialistApi.updateSpecialist(specialtyId, formData);
        if (result.success) {
          onSave();
        } else {
          throw new Error(result.message || 'Có lỗi xảy ra');
        }
      } else {
        // Create new specialty
        const result = await specialistApi.createSpecialist(formData);
        if (result.success) {
          onSave();
        } else {
          throw new Error(result.message || 'Có lỗi xảy ra');
        }
      }
    } catch (error: any) {
      console.error('Error saving specialty:', error);
      alert(error.message || 'Có lỗi xảy ra khi lưu chuyên khoa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            {specialty ? 'Chỉnh sửa chuyên khoa' : 'Thêm chuyên khoa mới'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên chuyên khoa *
                <span className="text-gray-500 text-xs ml-1">(tối đa 100 ký tự)</span>
              </label>
              <input
                type="text"
                required
                maxLength={100}
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
            
            {/* Image Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Hình ảnh
                <span className="text-gray-500 text-xs ml-1">(tối đa 500 ký tự)</span>
              </label>
              <input
                type="text"
                maxLength={500}
                value={formData.image}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, image: e.target.value }));
                  if (errors.image) setErrors(prev => ({ ...prev, image: '' }));
                }}
                placeholder="https://example.com/specialty-image.jpg"
                className={`w-full border rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.image ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
            </div>
            
            {/* Description Field */}
            <div>
              <RichTextEditor
                key={specialty?.id || (specialty as any)?._id || 'new'} // Force re-mount for different records
                label="Mô tả chi tiết"
                value={formData.description}
                onChange={(data) => {
                  setFormData(prev => ({ ...prev, description: data }));
                  if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
                }}
                placeholder="Mô tả chi tiết về chuyên khoa..."
                error={errors.description}
                helperText="Bạn có thể sử dụng định dạng rich text để tạo nội dung đẹp mắt"
                className="mb-4 text-gray-900"
              />
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
                {loading ? 'Đang lưu...' : (specialty ? 'Cập nhật' : 'Tạo mới')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


