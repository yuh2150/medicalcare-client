'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, MapPin, AlertCircle, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import appointmentApi from '@/services/appointmentApi';
import { useAuth } from '@/context/AuthContext';
import { Section, Container } from '@/components/ui/Layout';
import { LoadingSpinner, ErrorMessage, Badge } from '@/components/ui';
import type { Appointment } from '@/types/admin';

const statusConfig = {
  scheduled: {
    label: 'Chờ Xác Nhận',
    color: 'bg-yellow-100 text-yellow-800',
    icon: <Clock className="w-4 h-4" />
  },
  confirmed: {
    label: 'Đã Xác Nhận',
    color: 'bg-blue-100 text-blue-800',
    icon: <CheckCircle className="w-4 h-4" />
  },
  'in-progress': {
    label: 'Đang Khám',
    color: 'bg-purple-100 text-purple-800',
    icon: <User className="w-4 h-4" />
  },
  completed: {
    label: 'Hoàn Thành',
    color: 'bg-green-100 text-green-800',
    icon: <CheckCircle className="w-4 h-4" />
  },
  cancelled: {
    label: 'Đã Hủy',
    color: 'bg-red-100 text-red-800',
    icon: <XCircle className="w-4 h-4" />
  },
  'no-show': {
    label: 'Không Đến',
    color: 'bg-gray-100 text-gray-800',
    icon: <AlertCircle className="w-4 h-4" />
  }
};

// Helper function to safely get doctor name
const getDoctorName = (appointment: Appointment): string => {
  if (typeof appointment.doctorName === 'string') {
    return appointment.doctorName;
  } else if (typeof appointment.doctorName === 'object' && appointment.doctorName && (appointment.doctorName as any).name) {
    return (appointment.doctorName as any).name;
  } else if (typeof appointment.doctorId === 'string') {
    return appointment.doctorId;
  }
  return 'Bác sĩ';
};

export function MyAppointmentsPage() {
  const { user, isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show'>('all');

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchMyAppointments();
    }
  }, [isAuthenticated, user]);

  const fetchMyAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await appointmentApi.getAppointments({
        customerId: user?.id,
        page: 1,
        limit: 100
      });
      
      setAppointments(result.data || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Không thể tải danh sách lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
      return;
    }

    try {
      await appointmentApi.cancelAppointment(appointmentId, 'Hủy bởi khách hàng');
      await fetchMyAppointments(); // Refresh list
      alert('Đã hủy lịch hẹn thành công');
    } catch (error: any) {
      console.error('Error cancelling appointment:', error);
      alert(error.message || 'Có lỗi xảy ra khi hủy lịch hẹn');
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Cần Đăng Nhập</h2>
          <p className="text-gray-600 mb-4">Bạn cần đăng nhập để xem lịch hẹn của mình.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Đăng Nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Section background="white" padding="lg">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lịch Hẹn Của Tôi</h1>
              <p className="text-gray-600 mt-1">Quản lý các lịch hẹn khám bệnh của bạn</p>
            </div>
            
            <button
              onClick={() => window.location.href = '/appointments/book'}
              className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Đặt Lịch Mới
            </button>
          </div>
        </Container>
      </Section>

      <Section padding="xl">
        <Container>
          {/* Filter Tabs */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-2 mb-8">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'Tất Cả' },
                { key: 'scheduled', label: 'Chờ Xác Nhận' },
                { key: 'confirmed', label: 'Đã Xác Nhận' },
                { key: 'in-progress', label: 'Đang Khám' },
                { key: 'completed', label: 'Hoàn Thành' },
                { key: 'cancelled', label: 'Đã Hủy' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    filter === tab.key
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                  {tab.key !== 'all' && (
                    <span className="ml-2 text-xs bg-white/20 rounded-full px-2 py-0.5">
                      {appointments.filter(a => a.status === tab.key).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'all' ? 'Chưa có lịch hẹn nào' : `Không có lịch hẹn ${statusConfig[filter as keyof typeof statusConfig]?.label.toLowerCase()}`}
              </h3>
              <p className="text-gray-600 mb-4">
                {filter === 'all' 
                  ? 'Bạn chưa đặt lịch hẹn nào. Hãy đặt lịch khám với bác sĩ ngay hôm nay!'
                  : 'Thử chuyển sang tab khác để xem các lịch hẹn khác.'
                }
              </p>
              {filter === 'all' && (
                <button
                  onClick={() => window.location.href = '/appointments/book'}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Đặt Lịch Ngay
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment, index) => (
                <div
                  key={appointment._id || appointment.id || `appointment-${index}`}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Main Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* Doctor Avatar */}
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>

                        <div className="flex-1">
                          {/* Header */}
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">
                              Dr. {getDoctorName(appointment)}
                            </h3>
                            <Badge className={statusConfig[appointment.status as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-800'}>
                              <div className="flex items-center gap-1">
                                {statusConfig[appointment.status as keyof typeof statusConfig]?.icon}
                                {statusConfig[appointment.status as keyof typeof statusConfig]?.label || appointment.status}
                              </div>
                            </Badge>
                          </div>

                          {/* Details */}
                          <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <span>
                                {format(parseISO(appointment.date), 'dd/MM/yyyy, EEEE', { locale: vi })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-green-500" />
                              <span>{appointment.timeSlot}</span>
                            </div>
                            {appointment.reason && (
                              <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-orange-500" />
                                <span>{appointment.reason}</span>
                              </div>
                            )}
                          </div>

                          {/* Notes */}
                          {appointment.notes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700">
                                <strong>Ghi chú:</strong> {appointment.notes}
                              </p>
                            </div>
                          )}

                          {/* Diagnosis & Prescription (for completed appointments) */}
                          {appointment.status === 'completed' && (appointment.diagnosis || appointment.prescription) && (
                            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                              {appointment.diagnosis && (
                                <p className="text-sm text-gray-700 mb-2">
                                  <strong>Chẩn đoán:</strong> {appointment.diagnosis}
                                </p>
                              )}
                              {appointment.prescription && (
                                <p className="text-sm text-gray-700">
                                  <strong>Đơn thuốc:</strong> {appointment.prescription}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {appointment.status === 'scheduled' && (
                        <button
                          onClick={() => handleCancelAppointment(appointment._id || appointment.id || '')}
                          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Hủy</span>
                        </button>
                      )}
                      
                      {appointment.status === 'confirmed' && (
                        <div className="text-center">
                          <p className="text-sm text-green-600 font-medium">Sẵn sàng khám</p>
                          <p className="text-xs text-gray-500">
                            Vui lòng có mặt đúng giờ
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
