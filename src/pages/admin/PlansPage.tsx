'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import AdminTable, { Column } from '@/components/admin/AdminTable';
import { Plan, Doctor, TimeSlot, TableFilter, BulkAction } from '@/types/admin';
import { planApi } from '@/api/planApi';
import { doctorApi } from '@/api/doctorApi';

const TIME_SLOTS = [
  '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
  '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00',
  '17:00-18:00', '18:00-19:00', '19:00-20:00', '20:00-21:00'
];

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 10
  });
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [planCount, setPlanCount] = useState(0);

  const loadPlanCount = useCallback(async () => {
    try {
      const response = await planApi.getPlansCount();
      setPlanCount(response.count || 0);
    } catch (error) {
      console.error('Error loading plan count:', error);
    }
  }, []);

  const loadDoctors = useCallback(async () => {
    try {
      const response = await doctorApi.getDoctors({ page: 1, limit: 100 });
      setDoctors(response.data || []);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  }, []);

  const loadPlans = useCallback(async () => {
    try {
      setLoading(true);
      const response = await planApi.getPlans({
        page: pagination.current,
        limit: pagination.pageSize
      });
      
      setPlans(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.pagination?.total || response.data?.length || 0
      }));
    } catch (error) {
      console.error('Error loading plans:', error);
      setPlans([]);
      alert('Có lỗi khi tải danh sách kế hoạch');
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    loadPlans();
    loadPlanCount();
    loadDoctors();
  }, [loadPlans, loadPlanCount, loadDoctors]);

  const openPlanModal = useCallback((plan: Plan | null = null) => {
    if (plan) {
      console.log('Editing plan:', plan);
    }
    setEditingPlan(plan);
    setShowPlanModal(true);
  }, []);

  const closePlanModal = useCallback(() => {
    setShowPlanModal(false);
    setEditingPlan(null);
  }, []);

  const handleDeletePlan = useCallback(async (planId: string) => {
    if (!planId) {
      alert('ID kế hoạch không hợp lệ');
      return;
    }
    
    if (!confirm('Bạn có chắc chắn muốn xóa kế hoạch này?')) return;

    try {
      const response = await planApi.deletePlan(planId);
      if (response.success) {
        await loadPlans();
        await loadPlanCount();
        alert('Xóa thành công!');
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra');
      }
    } catch (error: any) {
      console.error('Delete plan error:', error);
      alert('Có lỗi xảy ra!');
    }
  }, [loadPlans, loadPlanCount]);

  const handleBulkAction = useCallback(async (action: string, keys: string[]) => {
    const actionText = action === 'delete' ? 'xóa' : action;
    
    if (!confirm(`Bạn có chắc chắn muốn ${actionText} ${keys.length} kế hoạch?`)) {
      return;
    }

    try {
      const response = await planApi.bulkAction({ 
        key: action,
        label: actionText,
        action, 
        ids: keys 
      });
      
      if (response.success) {
        await loadPlans();
        await loadPlanCount();
        setSelectedKeys([]);
        alert(`${actionText.charAt(0).toUpperCase() + actionText.slice(1)} thành công!`);
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Bulk action error:', error);
      alert('Có lỗi xảy ra!');
    }
  }, [loadPlans, loadPlanCount]);

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId || (d as any)._id === doctorId);
    return doctor?.name || 'Không tìm thấy bác sĩ';
  };

  const columns: Column<Plan>[] = [
    {
      key: 'date',
      title: 'Ngày làm việc',
      sortable: true,
      render: (value, record) => (
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-4 w-4 text-gray-400" />
          <div>
            <div className="text-sm font-medium text-gray-900">
              {new Date(record.date).toLocaleDateString('vi-VN')}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(record.date).toLocaleDateString('vi-VN', { weekday: 'long' })}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'doctorId',
      title: 'Bác sĩ',
      render: (value, record) => (
        <div className="flex items-center space-x-2">
          <UserIcon className="h-4 w-4 text-gray-400" />
          <div>
            <div className="text-sm font-medium text-gray-900">
              {getDoctorName(record.doctorId)}
            </div>
            <div className="text-xs text-gray-500">
              ID: {record.doctorId}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'timeSlots',
      title: 'Khung giờ',
      render: (value, record) => {
        const totalSlots = record.timeSlots?.length || 0;
        const bookedSlots = record.timeSlots?.filter(slot => slot.isBooked).length || 0;
        const availableSlots = totalSlots - bookedSlots;
        
        return (
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-4 w-4 text-gray-400" />
            <div>
              <div className="text-sm text-gray-900">
                {totalSlots} khung giờ
              </div>
              <div className="text-xs text-gray-500">
                <span className="text-green-600">{availableSlots} trống</span>
                {bookedSlots > 0 && <span className="text-red-600"> • {bookedSlots} đã đặt</span>}
              </div>
              <div className="text-xs text-gray-500 max-w-xs truncate">
                {record.timeSlots?.slice(0, 3).map(slot => slot.time).join(', ')}{record.timeSlots?.length > 3 ? '...' : ''}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'notes',
      title: 'Ghi chú',
      render: (value, record) => (
        <div className="max-w-xs">
          <div 
            className="text-sm text-gray-600 overflow-hidden"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as any,
              lineHeight: '1.4em',
              maxHeight: '2.8em'
            }}
            title={record.notes || 'Không có ghi chú'}
          >
            {record.notes || 'Không có ghi chú'}
          </div>
        </div>
      )
    },
    {
      key: 'createdAt',
      title: 'Ngày tạo',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('vi-VN'),
      width: '120px'
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '120px',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openPlanModal(record)}
            className="text-yellow-600 hover:text-yellow-800"
            title="Chỉnh sửa"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              const planId = record.id || (record as any)._id;
              if (planId) handleDeletePlan(planId);
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
      key: 'doctorId',
      label: 'Bác sĩ',
      type: 'select',
      options: doctors.map(doctor => ({
        label: doctor.name,
        value: doctor.id || (doctor as any)._id
      }))
    },
    {
      key: 'dateFrom',
      label: 'Từ ngày',
      type: 'date'
    },
    {
      key: 'dateTo',
      label: 'Đến ngày',
      type: 'date'
    }
  ];

  const bulkActions: BulkAction[] = [
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý kế hoạch</h1>
          <p className="text-gray-600">
            Quản lý lịch làm việc và khung giờ của bác sĩ
            {planCount > 0 && <span className="ml-2">• Tổng: {planCount} kế hoạch</span>}
          </p>
        </div>
        <button
          onClick={() => openPlanModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4" />
          Thêm kế hoạch
        </button>
      </div>

      <AdminTable
        data={plans}
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

      {/* Plan Modal */}
      {showPlanModal && (
        <PlanModal
          plan={editingPlan}
          doctors={doctors}
          onClose={closePlanModal}
          onSave={() => {
            loadPlans();
            loadPlanCount();
            closePlanModal();
          }}
        />
      )}
    </div>
  );
}

// Plan Modal Component
interface PlanModalProps {
  plan: Plan | null;
  doctors: Doctor[];
  onClose: () => void;
  onSave: () => void;
}

function PlanModal({ plan, doctors, onClose, onSave }: PlanModalProps) {
  const [formData, setFormData] = useState({
    doctorId: plan?.doctorId || '',
    date: plan?.date ? new Date(plan.date).toISOString().split('T')[0] : '',
    timeSlots: plan?.timeSlots || [] as TimeSlot[],
    notes: plan?.notes || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data
      if (!formData.doctorId.trim()) {
        throw new Error('Vui lòng chọn bác sĩ');
      }
      if (!formData.date.trim()) {
        throw new Error('Vui lòng chọn ngày làm việc');
      }
      if (formData.timeSlots.length === 0) {
        throw new Error('Vui lòng chọn ít nhất một khung giờ');
      }

      // Ensure date is in YYYY-MM-DD format
      const dateStr = formData.date.includes('T') 
        ? formData.date.split('T')[0] 
        : formData.date;
      
      const submitData = {
        ...formData,
        date: dateStr
      };

      let response;
      if (plan) {
        // Kiểm tra ID từ nhiều nguồn có thể
        const planId = plan.id || (plan as any)._id;
        if (!planId) {
          console.error('Plan object:', plan);
          throw new Error('Không tìm thấy ID của kế hoạch để cập nhật');
        }
        console.log('Updating plan with ID:', planId);
        response = await planApi.updatePlan(planId, submitData);
      } else {
        response = await planApi.createPlan(submitData);
      }
      if (response.success) {
        alert(plan ? 'Cập nhật thành công!' : 'Tạo kế hoạch thành công!');
        onSave();
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra');
      }
    } catch (error: any) {
      console.error('Save plan error:', error);
      alert(error.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSlotToggle = (timeSlot: string) => {
    setFormData(prev => {
      const existingSlotIndex = prev.timeSlots.findIndex(slot => slot.time === timeSlot);
      
      if (existingSlotIndex !== -1) {
        // Remove the slot
        return {
          ...prev,
          timeSlots: prev.timeSlots.filter((_, index) => index !== existingSlotIndex)
        };
      } else {
        // Add new slot
        const newSlot: TimeSlot = {
          time: timeSlot,
          isBooked: false
        };
        return {
          ...prev,
          timeSlots: [...prev.timeSlots, newSlot].sort((a, b) => a.time.localeCompare(b.time))
        };
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            {plan ? 'Chỉnh sửa kế hoạch' : 'Thêm kế hoạch mới'}
          </h2>
          
          {!plan && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Mỗi bác sĩ chỉ được tạo một kế hoạch cho mỗi ngày. 
                Nếu bác sĩ đã có kế hoạch cho ngày được chọn, hệ thống sẽ từ chối tạo kế hoạch mới.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bác sĩ <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.doctorId}
                  onChange={(e) => setFormData(prev => ({ ...prev, doctorId: e.target.value }))}
                  className="text-gray-500 text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Chọn bác sĩ</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id || (doctor as any)._id} value={doctor.id || (doctor as any)._id}>
                      {doctor.name} - {doctor.specialty?.name || 'Chưa có chuyên khoa'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày làm việc <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="text-gray-500 text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Khung giờ làm việc <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
                {TIME_SLOTS.map(timeSlot => {
                  const existingSlot = formData.timeSlots.find(slot => slot.time === timeSlot);
                  const isSelected = !!existingSlot;
                  const isBooked = existingSlot?.isBooked || false;
                  
                  return (
                    <label key={timeSlot} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleTimeSlotToggle(timeSlot)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <span className="text-sm text-gray-700">{timeSlot}</span>
                        {isBooked && (
                          <span className="ml-1 text-xs text-red-600 font-medium">(Đã đặt)</span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Đã chọn: {formData.timeSlots.length} khung giờ
                {formData.timeSlots.filter(slot => slot.isBooked).length > 0 && 
                  ` • ${formData.timeSlots.filter(slot => slot.isBooked).length} đã có người đặt`
                }
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú
              </label>
              <textarea
                rows={3}
                maxLength={500}
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="text-gray-500 text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ghi chú thêm về lịch làm việc..."
              />
              <p className="text-xs text-gray-500 mt-1">Tối đa 500 ký tự</p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Đang lưu...' : (plan ? 'Cập nhật' : 'Tạo mới')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
