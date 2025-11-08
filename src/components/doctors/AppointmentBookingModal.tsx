'use client';

import { useState } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { Doctor, TimeSlot } from '@/types';

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor;
  selectedDate: Date;
  selectedTimeSlot: TimeSlot;
  planId: string;
  onConfirm?: (bookingData: AppointmentBookingData) => void;
}

export interface AppointmentBookingData {
  planId: string;
  timeSlot: TimeSlot;
  patientInfo: {
    name: string;
    phone: string;
    email: string;
    notes?: string;
  };
}

export function AppointmentBookingModal({
  isOpen,
  onClose,
  doctor,
  selectedDate,
  selectedTimeSlot,
  planId,
  onConfirm
}: AppointmentBookingModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const bookingData: AppointmentBookingData = {
        planId,
        timeSlot: selectedTimeSlot,
        patientInfo: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          notes: formData.notes.trim()
        }
      };

      if (onConfirm) {
        await onConfirm(bookingData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-linear-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/30">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100/50 bg-white/60 backdrop-blur-sm rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Đặt Lịch Khám</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100/50 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Appointment Summary */}
        <div className="p-6 bg-linear-to-r from-blue-50/80 to-purple-50/80 border-b border-gray-100/50 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Dr. {doctor.name}</h3>
              <p className="text-sm text-blue-600 font-medium">{doctor.specialty}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-3 border border-white/30">
              <div className="text-gray-700 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Ngày khám</div>
                  <div className="font-semibold text-gray-900">{format(selectedDate, 'dd/MM/yyyy', { locale: vi })}</div>
                  <div className="text-xs text-gray-600">{format(selectedDate, 'EEEE', { locale: vi })}</div>
                </div>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-3 border border-white/30">
              <div className="text-gray-700 flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Giờ khám</div>
                  <div className="font-bold text-gray-900">{selectedTimeSlot.time}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white/40 backdrop-blur-sm">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
              <User className="w-4 h-4 text-blue-600" />
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="text-gray-800 w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200 placeholder:text-gray-500 shadow-sm"
              placeholder="Nhập họ và tên đầy đủ"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
              <Phone className="w-4 h-4 text-green-600" />
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="text-gray-800 w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-green-500/50 focus:border-green-400 transition-all duration-200 placeholder:text-gray-500 shadow-sm"
              placeholder="Nhập số điện thoại liên hệ"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
              <Mail className="w-4 h-4 text-purple-600" />
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="text-gray-800 w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-200 placeholder:text-gray-500 shadow-sm"
              placeholder="example@email.com (tùy chọn)"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
              <MessageSquare className="w-4 h-4 text-orange-600" />
              Ghi chú
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="text-gray-800 w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-400 transition-all duration-200 placeholder:text-gray-500 shadow-sm resize-none"
              placeholder="Mô tả triệu chứng, lý do khám hoặc yêu cầu đặc biệt..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100/80 backdrop-blur-sm border border-gray-200/50 text-gray-700 rounded-2xl hover:bg-gray-200/80 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
            >
              {isSubmitting ? 'Đang xử lý...' : '✨ Xác nhận đặt lịch'}
            </button>
          </div>
        </form>

        {/* Contact info */}
        <div className="px-6 pb-6 text-center bg-white/30 backdrop-blur-sm rounded-b-3xl border-t border-gray-100/50">
          <p className="text-sm text-gray-600 mb-3 font-medium">
            💬 Hoặc liên hệ trực tiếp với bác sĩ:
          </p>
          <div className="flex justify-center gap-3">
            {doctor.phone && (
              <a 
                href={`tel:${doctor.phone}`}
                className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl text-blue-600 hover:text-blue-800 hover:bg-white/80 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
              >
                <Phone className="w-4 h-4" />
                {doctor.phone}
              </a>
            )}
            {doctor.email && (
              <a 
                href={`mailto:${doctor.email}`}
                className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl text-purple-600 hover:text-purple-800 hover:bg-white/80 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
