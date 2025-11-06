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
  UserIcon,
  PhoneIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import AdminTable, { Column } from '@/components/admin/AdminTable';
import { Appointment, AppointmentStatus, Doctor, Plan, TableFilter, BulkAction, AdminUser } from '@/types/admin';
import appointmentApi, { CreateAppointmentRequest, UpdateAppointmentRequest } from '@/api/appointmentApi';
import { doctorApi } from '@/api/doctorApi';
import { planApi } from '@/api/planApi';
import { userApi } from '@/api/userApi';

const APPOINTMENT_STATUSES: { value: AppointmentStatus; label: string; color: string }[] = [
  { value: 'scheduled', label: 'Đã lên lịch', color: 'bg-gray-100 text-gray-800' },
  { value: 'confirmed', label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
  { value: 'in-progress', label: 'Đang thực hiện', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'completed', label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
  { value: 'no-show', label: 'Không đến', color: 'bg-gray-100 text-gray-800' }
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [customers, setCustomers] = useState<AdminUser[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 10
  });
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [appointmentCount, setAppointmentCount] = useState(0);

  const loadAppointmentCount = useCallback(async () => {
    try {
      const stats = await appointmentApi.getStats();
      setAppointmentCount(stats.total || 0);
    } catch (error) {
      console.error('Error loading appointment count:', error);
    }
  }, []);

  const loadDoctors = useCallback(async () => {
    try {
      const response = await doctorApi.getDoctors({ page: 1, limit: 100 });
      
      // Transform data to ensure id field exists
      const transformedDoctors = (response.data || []).map(doctor => ({
        ...doctor,
        id: doctor.id || (doctor as any)._id || 'unknown'
      }));
      
      setDoctors(transformedDoctors);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  }, []);

  const loadCustomers = useCallback(async () => {
    try {
      const response = await userApi.getUsers({ page: 1, limit: 100, role: 'customer' });
      
      // Transform data to ensure id field exists
      const transformedCustomers = (response.data || []).map(customer => ({
        ...customer,
        id: customer.id || (customer as any)._id || 'unknown'
      }));
      
      setCustomers(transformedCustomers);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  }, []);

  const loadPlans = useCallback(async () => {
    try {
      const response = await planApi.getPlans({ page: 1, limit: 1000 });
      
      // Transform data to ensure id field exists
      const transformedPlans = (response.data || []).map(plan => ({
        ...plan,
        id: plan.id || (plan as any)._id || 'unknown'
      }));
      
      setPlans(transformedPlans);
    } catch (error) {
      console.error('Error loading plans:', error);
    }
  }, []);

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await appointmentApi.getAppointments({
        page: pagination.current,
        limit: pagination.pageSize
      });
      
      // Transform data to ensure id field exists
      const transformedAppointments = (response.data || []).map(appointment => ({
        ...appointment,
        id: appointment.id || (appointment as any)._id || 'unknown'
      }));
      
      setAppointments(transformedAppointments);
      setPagination(prev => ({
        ...prev,
        total: response.pagination?.total || 0
      }));
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    loadAppointmentCount();
    loadDoctors();
    loadCustomers();
    loadPlans();
  }, [loadAppointmentCount, loadDoctors, loadCustomers, loadPlans]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const getStatusLabel = (status: AppointmentStatus) => {
    const statusObj = APPOINTMENT_STATUSES.find(s => s.value === status);
    return statusObj?.label || status;
  };

  const getStatusColor = (status: AppointmentStatus) => {
    const statusObj = APPOINTMENT_STATUSES.find(s => s.value === status);
    return statusObj?.color || 'bg-gray-100 text-gray-800';
  };

  // const getTypeLabel = (type: AppointmentType) => {
  //   const typeObj = APPOINTMENT_TYPES.find(t => t.value === type);
  //   return typeObj?.label || type;
  // };

  const openAppointmentModal = (appointment?: Appointment) => {
    setEditingAppointment(appointment || null);
    setShowAppointmentModal(true);
  };

  const closeAppointmentModal = () => {
    setShowAppointmentModal(false);
    setEditingAppointment(null);
  };

  const handleDelete = async (appointment: Appointment) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa cuộc hẹn với ${appointment.customerName}?`)) {
      return;
    }

    try {
      await appointmentApi.deleteAppointment(appointment.id);
      loadAppointments();
      loadAppointmentCount();
    } catch (error: any) {
      alert(`Lỗi khi xóa cuộc hẹn: ${error.message}`);
    }
  };

  const handleConfirm = async (appointment: Appointment) => {
    try {
      await appointmentApi.confirmAppointment(appointment.id);
      loadAppointments();
    } catch (error: any) {
      alert(`Lỗi khi xác nhận cuộc hẹn: ${error.message}`);
    }
  };

  const handleCancel = async (appointment: Appointment) => {
    const reason = prompt('Lý do hủy cuộc hẹn (tùy chọn):');
    try {
      await appointmentApi.cancelAppointment(appointment.id, reason || undefined);
      loadAppointments();
    } catch (error: any) {
      alert(`Lỗi khi hủy cuộc hẹn: ${error.message}`);
    }
  };

  const handleComplete = async (appointment: Appointment) => {
    const diagnosis = prompt('Chẩn đoán (tùy chọn):');
    const prescription = prompt('Đơn thuốc (tùy chọn):');
    const notes = prompt('Ghi chú (tùy chọn):');
    
    try {
      await appointmentApi.completeAppointment(appointment.id, {
        diagnosis: diagnosis || undefined,
        prescription: prescription || undefined,
        notes: notes || undefined
      });
      loadAppointments();
    } catch (error: any) {
      alert(`Lỗi khi hoàn thành cuộc hẹn: ${error.message}`);
    }
  };

  const handleBulkAction = async (action: string, selectedIds: string[]) => {
    if (selectedIds.length === 0) {
      alert('Vui lòng chọn ít nhất một cuộc hẹn');
      return;
    }

    const confirmMessage = {
      confirm: `Bạn có chắc chắn muốn xác nhận ${selectedIds.length} cuộc hẹn đã chọn?`,
      cancel: `Bạn có chắc chắn muốn hủy ${selectedIds.length} cuộc hẹn đã chọn?`,
      complete: `Bạn có chắc chắn muốn hoàn thành ${selectedIds.length} cuộc hẹn đã chọn?`,
      delete: `Bạn có chắc chắn muốn xóa ${selectedIds.length} cuộc hẹn đã chọn?`
    }[action];

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      await appointmentApi.bulkAction({ 
        action: action as 'confirm' | 'cancel' | 'complete' | 'delete', 
        ids: selectedIds 
      });
      loadAppointments();
      loadAppointmentCount();
      setSelectedKeys([]);
    } catch (error: any) {
      alert(`Lỗi khi thực hiện hành động: ${error.message}`);
    }
  };

  const columns: Column<Appointment>[] = [
    {
      key: 'customerName',
      title: 'Khách hàng',
      render: (value: any, record: Appointment) => (
        <div className="flex items-center space-x-3">
          <div className="shrink-0">
            <UserIcon className="h-8 w-8 text-gray-400" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{record.customerName}</div>
            {record.customerPhone && (
              <div className="text-sm text-gray-500 flex items-center">
                <PhoneIcon className="h-3 w-3 mr-1" />
                {record.customerPhone}
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'doctorName',
      title: 'Bác sĩ',
      render: (value: any, record: Appointment) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{record.doctorName}</div>
          <div className="text-sm text-gray-500">{record.specialtyName}</div>
        </div>
      )
    },
    {
      key: 'date',
      title: 'Ngày & Giờ',
      render: (value: any, record: Appointment) => (
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-4 w-4 text-gray-400" />
          <div>
            <div className="text-sm font-medium text-gray-900">
              {new Date(record.date).toLocaleDateString('vi-VN')}
            </div>
            <div className="text-sm text-gray-500 flex items-center">
              <ClockIcon className="h-3 w-3 mr-1" />
              {record.timeSlot}
            </div>
          </div>
        </div>
      )
    },
    // {
    //   key: 'type',
    //   title: 'Loại',
    //   render: (value: any, record: Appointment) => (
    //     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
    //       {getTypeLabel(record.type)}
    //     </span>
    //   )
    // },
    {
      key: 'status',
      title: 'Trạng thái',
      render: (value: any, record: Appointment) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
          {getStatusLabel(record.status)}
        </span>
      )
    },
    {
      key: 'reason',
      title: 'Lý do khám',
      render: (value: any, record: Appointment) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-900 truncate" title={record.reason || ''}>
            {record.reason || '-'}
          </p>
        </div>
      )
    },
    {
      key: 'createdAt',
      title: 'Ngày tạo',
      render: (value: any, record: Appointment) => (
        <span className="text-sm text-gray-500">
          {new Date(record.createdAt).toLocaleDateString('vi-VN')}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Hành động',
      render: (value: any, record: Appointment) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => openAppointmentModal(record)}
            className="text-blue-600 hover:text-blue-900"
            title="Chỉnh sửa"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          
          {record.status === 'scheduled' && (
            <button
              onClick={() => handleConfirm(record)}
              className="text-green-600 hover:text-green-900"
              title="Xác nhận"
            >
              <CheckCircleIcon className="h-4 w-4" />
            </button>
          )}
          
          {(record.status === 'scheduled' || record.status === 'confirmed') && (
            <button
              onClick={() => handleCancel(record)}
              className="text-orange-600 hover:text-orange-900"
              title="Hủy cuộc hẹn"
            >
              <XCircleIcon className="h-4 w-4" />
            </button>
          )}
          
          {record.status === 'confirmed' && (
            <button
              onClick={() => handleComplete(record)}
              className="text-purple-600 hover:text-purple-900"
              title="Hoàn thành"
            >
              <DocumentTextIcon className="h-4 w-4" />
            </button>
          )}
          
          <button
            onClick={() => handleDelete(record)}
            className="text-red-600 hover:text-red-900"
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
      key: 'search',
      label: 'Tìm kiếm',
      type: 'text',
      placeholder: 'Tìm theo tên khách hàng, bác sĩ...'
    },
    {
      key: 'status',
      label: 'Trạng thái',
      type: 'select',
      options: [
        { label: 'Tất cả', value: '' },
        ...APPOINTMENT_STATUSES.map(status => ({ 
          label: status.label, 
          value: status.value 
        }))
      ]
    },
    // {
    //   key: 'type',
    //   label: 'Loại cuộc hẹn',
    //   type: 'select',
    //   options: [
    //     { label: 'Tất cả', value: '' },
    //     ...APPOINTMENT_TYPES.map(type => ({ 
    //       label: type.label, 
    //       value: type.value 
    //     }))
    //   ]
    // },
    {
      key: 'doctorId',
      label: 'Bác sĩ',
      type: 'select',
      options: [
        { label: 'Tất cả', value: '' },
        ...doctors.map(doctor => ({ 
          label: doctor.name, 
          value: doctor.id 
        }))
      ]
    },
    {
      key: 'date',
      label: 'Ngày hẹn',
      type: 'date'
    }
  ];

  const bulkActions: BulkAction[] = [
    {
      key: 'confirm',
      label: 'Xác nhận',
      icon: CheckCircleIcon,
      action: 'confirm'
    },
    {
      key: 'cancel',
      label: 'Hủy',
      icon: XCircleIcon,
      action: 'cancel'
    },
    {
      key: 'complete',
      label: 'Hoàn thành',
      icon: DocumentTextIcon,
      action: 'complete'
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý cuộc hẹn</h1>
          <p className="text-gray-600">
            Quản lý lịch hẹn khám bệnh của khách hàng
            {appointmentCount > 0 && <span className="ml-2">• Tổng: {appointmentCount} cuộc hẹn</span>}
          </p>
        </div>
        <button
          onClick={() => openAppointmentModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4" />
          Thêm cuộc hẹn
        </button>
      </div>

      <AdminTable
        data={appointments}
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

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <AppointmentModal
          appointment={editingAppointment}
          doctors={doctors}
          customers={customers}
          plans={plans}
          onClose={closeAppointmentModal}
          onSave={() => {
            loadAppointments();
            loadAppointmentCount();
            closeAppointmentModal();
          }}
        />
      )}
    </div>
  );
}

// Appointment Modal Component
interface AppointmentModalProps {
  appointment: Appointment | null;
  doctors: Doctor[];
  customers: AdminUser[];
  plans: Plan[];
  onClose: () => void;
  onSave: () => void;
}

function AppointmentModal({ appointment, doctors, customers, plans, onClose, onSave }: AppointmentModalProps) {
  const [formData, setFormData] = useState({
    customerId: '',
    doctorId: '',
    planId: '',
    date: '',
    timeSlot: '',
    status: 'scheduled' as AppointmentStatus,
    reason: '',
    notes: '',
    diagnosis: '',
    prescription: '',
    fee: 0
  });
  
  // Reset form data when appointment changes (when modal opens)
  useEffect(() => {
    if (appointment) {
      // Helper function to extract ID from object or string
      const extractId = (value: any): string => {
        if (!value) return '';
        if (typeof value === 'string') return value;
        return value.id || value._id || '';
      };

      const newFormData = {
        customerId: extractId(appointment.customerId),
        doctorId: extractId(appointment.doctorId),
        planId: extractId(appointment.planId),
        date: appointment.date ? new Date(appointment.date).toISOString().split('T')[0] : '',
        timeSlot: appointment.timeSlot || '',
        status: appointment.status || 'scheduled' as AppointmentStatus,
        reason: appointment.reason || '',
        notes: appointment.notes || '',
        diagnosis: appointment.diagnosis || '',
        prescription: appointment.prescription || '',
        fee: appointment.fee || 0
      };

      console.log('Setting form data from appointment:', newFormData);
      setFormData(newFormData);
    } else {
      // Reset form for new appointment
      setFormData({
        customerId: '',
        doctorId: '',
        planId: '',
        date: '',
        timeSlot: '',
        status: 'scheduled' as AppointmentStatus,
        reason: '',
        notes: '',
        diagnosis: '',
        prescription: '',
        fee: 0
      });
    }
  }, [appointment]);

  // Debug log để kiểm tra dữ liệu
  useEffect(() => {
    if (appointment) {
      console.log('Editing appointment:', appointment);
      console.log('Available doctors:', doctors.map(d => ({ id: d.id, name: d.name })));
      console.log('Available customers:', customers.map(c => ({ id: c.id, name: c.name })));
      console.log('Form data after update:', formData);
    }
  }, [appointment, doctors, customers, formData]);
  const [loading, setLoading] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  // Function to update available time slots
  const updateAvailableTimeSlots = useCallback((doctorId: string, date: string) => {
    if (!doctorId || !date || !plans.length) {
      setAvailableTimeSlots([]);
      return;
    }

    const selectedPlan = plans.find(p => 
      String(p.doctorId) === String(doctorId) &&
      new Date(p.date).toISOString().split('T')[0] === date
    );

    if (selectedPlan) {
      setFormData(prev => ({ ...prev, planId: selectedPlan.id }));

      if (selectedPlan.timeSlots && Array.isArray(selectedPlan.timeSlots) && selectedPlan.timeSlots.length > 0) {
        const availableSlots = selectedPlan.timeSlots
          .filter(slot => {
            // If isBooked is undefined, null, or false, slot is available
            // If editing existing appointment and this is the same time slot, also available
            const isSlotAvailable = !slot.isBooked;
            const isCurrentAppointmentSlot = appointment && appointment.timeSlot === slot.time;
            return isSlotAvailable || isCurrentAppointmentSlot;
          })
          .map(slot => slot.time);
        
        setAvailableTimeSlots(availableSlots);
      } else {
        setAvailableTimeSlots([]);
      }
    } else {
      setAvailableTimeSlots([]);
      setFormData(prev => ({ ...prev, planId: '' }));
    }
  }, [plans, appointment]);

  // Initial load when modal opens with existing appointment data
  useEffect(() => {
    if (appointment && plans.length > 0) {
      // Ensure form data is properly set for editing
      const appointmentDate = appointment.date ? new Date(appointment.date).toISOString().split('T')[0] : '';
      
      if (appointment.doctorId && appointmentDate) {
        updateAvailableTimeSlots(appointment.doctorId, appointmentDate);
      }
    }
  }, [appointment, plans, updateAvailableTimeSlots]);
  // Update time slots when doctor or date changes
  useEffect(() => {
    updateAvailableTimeSlots(formData.doctorId, formData.date);
  }, [formData.doctorId, formData.date, updateAvailableTimeSlots]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data
      if (!formData.customerId.trim()) {
        throw new Error('Vui lòng chọn khách hàng');
      }
      if (!formData.doctorId.trim()) {
        throw new Error('Vui lòng chọn bác sĩ');
      }
      if (!formData.date.trim()) {
        throw new Error('Vui lòng chọn ngày hẹn');
      }
      if (!formData.timeSlot.trim()) {
        throw new Error('Vui lòng chọn khung giờ');
      }
      if (!formData.planId.trim()) {
        throw new Error('Không tìm thấy kế hoạch phù hợp cho bác sĩ và ngày đã chọn');
      }

      if (appointment) {
        // Update existing appointment
        const updateData: UpdateAppointmentRequest = {
          customerId: formData.customerId,
          doctorId: formData.doctorId,
          planId: formData.planId,
          date: formData.date,
          timeSlot: formData.timeSlot,
          status: formData.status,
          reason: formData.reason || undefined,
          notes: formData.notes || undefined,
          diagnosis: formData.diagnosis || undefined,
          prescription: formData.prescription || undefined,
          fee: formData.fee > 0 ? formData.fee : undefined
        };
        
        await appointmentApi.updateAppointment(appointment.id, updateData);
      } else {
        // Create new appointment
        const createData: CreateAppointmentRequest = {
          customerId: formData.customerId,
          doctorId: formData.doctorId,
          planId: formData.planId,
          date: formData.date,
          timeSlot: formData.timeSlot,
          reason: formData.reason || undefined,
          notes: formData.notes || undefined
        };
        
        await appointmentApi.createAppointment(createData);
      }

      onSave();
    } catch (error: any) {
      alert(`Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {appointment ? 'Chỉnh sửa cuộc hẹn' : 'Thêm cuộc hẹn mới'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Khách hàng *
              </label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
                className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Chọn khách hàng</option>
                {customers.filter(user => user.role === 'customer').map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bác sĩ *
              </label>
              <select
                value={formData.doctorId}
                onChange={(e) => setFormData(prev => ({ ...prev, doctorId: e.target.value }))}
                className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Chọn bác sĩ</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty?.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày hẹn *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Khung giờ *
              </label>
              <select
                value={formData.timeSlot}
                onChange={(e) => setFormData(prev => ({ ...prev, timeSlot: e.target.value }))}
                className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Chọn khung giờ</option>
                {availableTimeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {formData.doctorId && formData.date && availableTimeSlots.length === 0 && (
                <p className="text-sm text-orange-600 mt-1">
                  Không có khung giờ trống cho ngày này
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại cuộc hẹn *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as AppointmentType }))}
                className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {APPOINTMENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div> */}

            {appointment && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as AppointmentStatus }))}
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {APPOINTMENT_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lý do khám
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Mô tả lý do khám bệnh..."
              className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {appointment && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chẩn đoán
                </label>
                <textarea
                  value={formData.diagnosis}
                  onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
                  placeholder="Chẩn đoán của bác sĩ..."
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đơn thuốc
                </label>
                <textarea
                  value={formData.prescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, prescription: e.target.value }))}
                  placeholder="Đơn thuốc kê cho bệnh nhân..."
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phí khám (VNĐ)
                </label>
                <input
                  type="number"
                  value={formData.fee}
                  onChange={(e) => setFormData(prev => ({ ...prev, fee: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Ghi chú thêm..."
              className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : (appointment ? 'Cập nhật' : 'Thêm mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
