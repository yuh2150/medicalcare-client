'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import AdminTable, { Column } from '@/components/admin/AdminTable';
import { Doctor, Specialty, TableFilter, BulkAction } from '@/types/admin';
import { doctorApi } from '@/services/adminApi';
import { specialistApi } from '@/services/specialistApi';
import { RichTextEditor, HTMLContent } from '@/components/ui';

const DOCTOR_STATUS = {
  active: 'Hoạt động',
  inactive: 'Không hoạt động',
  on_leave: 'Nghỉ phép',
  suspended: 'Tạm ngưng'
} as const;

const ACADEMIC_TITLES = {
  'Giáo sư': 'Giáo sư',
  'Phó Giáo sư': 'Phó Giáo sư',
  'Tiến sĩ': 'Tiến sĩ',
  'Thạc sĩ': 'Thạc sĩ',
  'Bác sĩ': 'Bác sĩ',
  'Bác sĩ Chuyên khoa I': 'Bác sĩ Chuyên khoa I',
  'Bác sĩ Chuyên khoa II': 'Bác sĩ Chuyên khoa II'
} as const;

const ACADEMIC_DEGREES = {
  'Tiến sĩ Y khoa': 'Tiến sĩ Y khoa',
  'Thạc sĩ Y khoa': 'Thạc sĩ Y khoa',
  'Bác sĩ Y khoa': 'Bác sĩ Y khoa',
  'Cử nhân Y khoa': 'Cử nhân Y khoa'
} as const;

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 10
  });
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [doctorCount, setDoctorCount] = useState(0);

  // Load specialties for dropdown
  const loadSpecialties = useCallback(async () => {
    try {
      const response = await specialistApi.getSpecialists({ page: 1, limit: 100 });
      setSpecialties(response.data || []);
    } catch (error) {
      console.error('Error loading specialties:', error);
      setSpecialties([]);
    }
  }, []);

  // Load doctor count
  const loadDoctorCount = useCallback(async () => {
    try {
      const response = await doctorApi.getDoctors({ page: 1, limit: 1 });
      setDoctorCount(response.pagination?.total || 0);
    } catch (error) {
      console.error('Error loading doctor count:', error);
    }
  }, []);

  const loadDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await doctorApi.getDoctors({
        page: pagination.current,
        limit: pagination.pageSize
      });
      
      setDoctors(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.pagination?.total || response.data?.length || 0
      }));
    } catch (error) {
      console.error('Error loading doctors:', error);
      setDoctors([]);
      alert('Có lỗi khi tải danh sách bác sĩ');
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize]);

  // Load data on component mount
  useEffect(() => {
    loadSpecialties();
    loadDoctorCount();
  }, [loadSpecialties, loadDoctorCount]);

  // Load doctors when pagination changes
  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const openDoctorModal = useCallback((doctor: Doctor | null = null) => {
    if (doctor) {
      console.log('Opening modal with doctor:', doctor);
      console.log('Doctor ID:', doctor.id);
      console.log('Doctor _id:', (doctor as any)._id);
    }
    setEditingDoctor(doctor);
    setShowDoctorModal(true);
  }, []);

  const closeDoctorModal = useCallback(() => {
    setShowDoctorModal(false);
    setEditingDoctor(null);
  }, []);

  const handleBulkAction = useCallback(async (action: string, keys: string[]) => {
    const actionText = action === 'delete' ? 'xóa' : 
                     action === 'activate' ? 'kích hoạt' : 'vô hiệu hóa';
    
    if (!confirm(`Bạn có chắc chắn muốn ${actionText} ${keys.length} bác sĩ?`)) {
      return;
    }

    try {
      const response = await doctorApi.bulkAction({ 
        key: action,
        label: actionText,
        action, 
        ids: keys 
      });
      
      if (response.success) {
        await loadDoctors();
        setSelectedKeys([]);
        alert(`${actionText.charAt(0).toUpperCase() + actionText.slice(1)} thành công!`);
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Bulk action error:', error);
      alert('Có lỗi xảy ra!');
    }
  }, [loadDoctors]);

  const handleDeleteDoctor = useCallback(async (doctorId: string) => {
    if (!doctorId) {
      alert('ID bác sĩ không hợp lệ');
      return;
    }
    
    if (!confirm('Bạn có chắc chắn muốn xóa bác sĩ này?')) return;

    try {
      const response = await doctorApi.deleteDoctor(doctorId);
      if (response.success) {
        await loadDoctors();
        alert('Xóa thành công!');
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Delete doctor error:', error);
      alert('Có lỗi xảy ra!');
    }
  }, [loadDoctors]);

  const columns: Column<Doctor>[] = [
    {
      key: 'avatar',
      title: 'Ảnh',
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
            <UserIcon className="h-10 w-10 text-gray-400" />
          )}
        </div>
      )
    },
    {
      key: 'name',
      title: 'Thông tin bác sĩ',
      sortable: true,
      render: (value, record) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {record.academicTitle} {record.name}
          </div>
          <div className="text-sm text-gray-500">{record.academicDegree}</div>
          <div className="text-sm text-gray-500">{record.email}</div>
          <div className="text-sm text-gray-500">{record.phone}</div>
        </div>
      )
    },
    {
      key: 'specialty',
      title: 'Chuyên khoa',
      render: (value, record) => {
        // Find specialty name from specialties list using specialtyId
        const doctorSpecialtyId = record.specialtyId;
        const specialty = specialties.find(s => 
          (s.id && s.id === doctorSpecialtyId) || 
          ((s as any)._id && (s as any)._id === doctorSpecialtyId)
        );
        const specialtyName = specialty?.name || record.specialty?.name || 'Chưa có chuyên khoa';
        
        return (
          <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
            {specialtyName}
          </span>
        );
      }
    },
    {
      key: 'consultationFee',
      title: 'Phí khám',
      sortable: true,
      render: (value) => (
        <span className="text-sm font-medium">
          {value ? `${value.toLocaleString('vi-VN')} VNĐ` : 'Chưa có'}
        </span>
      )
    },
    {
      key: 'status',
      title: 'Trạng thái',
      sortable: true,
      render: (value) => {
        const statusConfig = {
          ACTIVE: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
          INACTIVE: { color: 'bg-red-100 text-red-800', icon: XCircleIcon },
          ON_LEAVE: { color: 'bg-yellow-100 text-yellow-800', icon: XCircleIcon },
          SUSPENDED: { color: 'bg-gray-100 text-gray-800', icon: XCircleIcon }
        };
        
        const config = statusConfig[value as keyof typeof statusConfig] || statusConfig.INACTIVE;
        const Icon = config.icon;
        
        return (
          <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${config.color}`}>
            <Icon className="h-3 w-3 mr-1" />
            {DOCTOR_STATUS[value as keyof typeof DOCTOR_STATUS] || value}
          </span>
        );
      }
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
            onClick={() => openDoctorModal(record)}
            className="text-yellow-600 hover:text-yellow-800"
            title="Chỉnh sửa"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              const doctorId = record.id || (record as any)._id;
              if (doctorId) handleDeleteDoctor(doctorId);
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
      key: 'academicTitle',
      label: 'Học hàm',
      type: 'select',
      options: Object.entries(ACADEMIC_TITLES).map(([value, label]) => ({ label, value }))
    },
    {
      key: 'academicDegree',
      label: 'Học vị',
      type: 'select',
      options: Object.entries(ACADEMIC_DEGREES).map(([value, label]) => ({ label, value }))
    },
    {
      key: 'status',
      label: 'Trạng thái',
      type: 'select',
      options: Object.entries(DOCTOR_STATUS).map(([value, label]) => ({ label, value }))
    },
    {
      key: 'specialtyId',
      label: 'Chuyên khoa',
      type: 'select',
      options: [
        { label: 'Tất cả', value: '' },
        ...specialties.map(specialty => ({
          label: specialty.name,
          value: specialty.id || (specialty as any)._id
        }))
      ]
    },
    {
      key: 'createdFrom',
      label: 'Từ ngày',
      type: 'date'
    }
  ];

  const bulkActions: BulkAction[] = [
    {
      key: 'activate',
      label: 'Kích hoạt',
      icon: CheckCircleIcon,
      action: 'activate'
    },
    {
      key: 'deactivate',
      label: 'Vô hiệu hóa',
      icon: XCircleIcon,
      action: 'deactivate'
    },
    {
      key: 'on_leave',
      label: 'Nghỉ phép',
      icon: XCircleIcon,
      action: 'on_leave'
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: TrashIcon,
      danger: true,
      action: 'delete'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý bác sĩ</h1>
          <p className="text-gray-600">
            Quản lý thông tin bác sĩ trong hệ thống
            {doctorCount > 0 && <span className="ml-2">• Tổng: {doctorCount} bác sĩ</span>}
          </p>
        </div>
        <button
          onClick={() => openDoctorModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4" />
          Thêm bác sĩ
        </button>
      </div>

      <AdminTable
        data={doctors}
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
          getRowKey: (record) => record.id || (record as any)._id || 'unknown'
        }}
        filters={filters}
        bulkActions={bulkActions}
        onBulkAction={handleBulkAction}
        onExport={() => {
          alert('Tính năng xuất CSV sẽ được triển khai sau');
        }}
      />

      {/* Doctor Modal */}
      {showDoctorModal && (
        <DoctorModal
          doctor={editingDoctor}
          onClose={closeDoctorModal}
          onSave={() => {
            loadDoctors();
            closeDoctorModal();
          }}
        />
      )}
    </div>
  );
}

// Doctor Modal Component
interface DoctorModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onSave: () => void;
}

function DoctorModal({ doctor, onClose, onSave }: DoctorModalProps) {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [formData, setFormData] = useState({
    name: doctor?.name || '',
    email: doctor?.email || '',
    phone: doctor?.phone || '',
    specialtyId: doctor?.specialtyId || '',
    academicTitle: doctor?.academicTitle || 'Bác sĩ',
    academicDegree: doctor?.academicDegree || 'Bác sĩ Y khoa',
    description: doctor?.description || '',
    membership: doctor?.membership || '',
    training: doctor?.training || '',
    experience: doctor?.experience || '',
    avatar: doctor?.avatar || '',
    additionalImages: doctor?.additionalImages?.join(',') || '',
    consultationFee: doctor?.consultationFee || 0,
    status: doctor?.status || 'ACTIVE'
  });
  const [loading, setLoading] = useState(false);

  // Load specialties for dropdown
  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const response = await specialistApi.getSpecialists({ page: 1, limit: 100 });
        setSpecialties(response.data || []);
      } catch (error) {
        console.error('Error loading specialties:', error);
        setSpecialties([]);
      }
    };
    
    loadSpecialties();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        consultationFee: Number(formData.consultationFee),
        additionalImages: formData.additionalImages.split(',').filter(img => img.trim()).map(img => img.trim())
      };

      let response;
      if (doctor) {
        // Kiểm tra ID từ nhiều nguồn có thể
        const doctorId = doctor.id || (doctor as any)._id;
        if (!doctorId) {
          console.error('Doctor object:', doctor);
          throw new Error('Không tìm thấy ID của bác sĩ để cập nhật');
        }
        console.log('Updating doctor with ID:', doctorId);
        response = await doctorApi.updateDoctor(doctorId, submitData);
      } else {
        response = await doctorApi.createDoctor(submitData);
      }
      if (response.success) {
        alert(doctor ? 'Cập nhật thành công!' : 'Tạo bác sĩ thành công!');
        onSave();
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Save doctor error:', error);
      alert('Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            {doctor ? 'Chỉnh sửa bác sĩ' : 'Thêm bác sĩ mới'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên bác sĩ *
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value.trim() }))}
                  className="text-gray-900 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value.toLowerCase() }))}
                  className="text-gray-900 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  placeholder="+84901234567"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="text-gray-900 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chuyên khoa *
                </label>
                <select
                  required
                  value={formData.specialtyId}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialtyId: e.target.value }))}
                  className="text-gray-900 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Chọn chuyên khoa --</option>
                  {specialties.map((specialty) => (
                    <option key={specialty.id || (specialty as any)._id} value={specialty.id || (specialty as any)._id}>
                      {specialty.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Học hàm *
                </label>
                <select
                  required
                  value={formData.academicTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, academicTitle: e.target.value as any }))}
                  className="text-gray-900 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(ACADEMIC_TITLES).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Học vị *
                </label>
                <select
                  required
                  value={formData.academicDegree}
                  onChange={(e) => setFormData(prev => ({ ...prev, academicDegree: e.target.value as any }))}
                  className="text-gray-900 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(ACADEMIC_DEGREES).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phí khám (VNĐ)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.consultationFee}
                  onChange={(e) => setFormData(prev => ({ ...prev, consultationFee: parseInt(e.target.value) || 0 }))}
                  className="text-gray-900 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="text-gray-900 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(DOCTOR_STATUS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Ảnh đại diện
              </label>
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                className="text-gray-900 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <RichTextEditor
                key={doctor?.id || (doctor as any)?._id || 'new'} // Force re-mount for different records
                label="Mô tả chi tiết"
                value={formData.description}
                onChange={(data) => setFormData(prev => ({ ...prev, description: data }))}
                placeholder="Giới thiệu chuyên môn, kinh nghiệm, lĩnh vực điều trị..."
                helperText="Mô tả chi tiết về bác sĩ với định dạng rich text"
                className="mb-4 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thành viên các tổ chức y tế
              </label>
              <textarea
                rows={2}
                maxLength={500}
                value={formData.membership}
                onChange={(e) => setFormData(prev => ({ ...prev, membership: e.target.value }))}
                className="text-gray-900 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="VD: Hội Tim mạch Việt Nam, Hiệp hội Bác sĩ Châu Á..."
              />
              <p className="text-xs text-gray-500 mt-1">Tối đa 500 ký tự</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quá trình đào tạo
              </label>
              <textarea
                rows={3}
                maxLength={1000}
                value={formData.training}
                onChange={(e) => setFormData(prev => ({ ...prev, training: e.target.value }))}
                className="text-gray-900 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="VD: Tốt nghiệp Đại học Y Hà Nội, Thạc sĩ tại Đại học Tokyo..."
              />
              <p className="text-xs text-gray-500 mt-1">Tối đa 1000 ký tự</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kinh nghiệm làm việc
              </label>
              <textarea
                rows={3}
                maxLength={1000}
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                className="text-gray-900 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="VD: 10 năm tại BV Bạch Mai, 5 năm tại Singapore..."
              />
              <p className="text-xs text-gray-500 mt-1">Tối đa 1000 ký tự</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ảnh bổ sung (URL, cách nhau bởi dấu phẩy)
              </label>
              <textarea
                rows={2}
                value={formData.additionalImages}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalImages: e.target.value }))}
                placeholder="VD: /images/cert1.jpg, /images/cert2.jpg"
                className="text-gray-900 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Nhập URL các ảnh chứng chỉ, bằng cấp, giải thưởng. Cách nhau bởi dấu phẩy
              </p>
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
                {loading ? 'Đang lưu...' : (doctor ? 'Cập nhật' : 'Tạo mới')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
