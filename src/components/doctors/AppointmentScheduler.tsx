'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { format, addDays, isSameDay, parseISO, startOfDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import { AppointmentBookingModal, type AppointmentBookingData } from './AppointmentBookingModal';
import type { Plan, TimeSlot, Doctor } from '@/types';

interface AppointmentSchedulerProps {
  plans: Plan[];
  doctor: Doctor;
  onBookAppointment?: (bookingData: AppointmentBookingData) => void;
  className?: string;
}

export function AppointmentScheduler({ 
  plans, 
  doctor,
  onBookAppointment,
  className = ''
}: AppointmentSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfDay(new Date()));
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');

  // Get available dates from plans
  const availableDates = plans
    .map(plan => parseISO(plan.date))
    .filter(date => date >= startOfDay(new Date()));

  // Get week dates
  const getWeekDates = (startDate: Date) => {
    return Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  };

  const weekDates = getWeekDates(currentWeekStart);

  // Get plan for selected date
  const selectedPlan = selectedDate 
    ? plans.find(plan => isSameDay(parseISO(plan.date), selectedDate))
    : null;

  // Available time slots for selected date
  const availableTimeSlots = selectedPlan?.timeSlots?.filter(slot => !slot.isBooked) || [];

  const goToPreviousWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, 7));
  };

  const handleDateSelect = (date: Date) => {
    const hasPlans = availableDates.some(availableDate => isSameDay(availableDate, date));
    if (hasPlans) {
      setSelectedDate(date);
      setSelectedTimeSlot(null);
    }
  };

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    if (selectedPlan) {
      setSelectedPlanId(selectedPlan.id || selectedPlan._id || '');
    }
  };

  const handleBookAppointment = () => {
    if (selectedDate && selectedTimeSlot && selectedPlanId) {
      setShowBookingModal(true);
    }
  };

  const handleConfirmBooking = async (bookingData: AppointmentBookingData) => {
    if (onBookAppointment) {
      await onBookAppointment(bookingData);
    }
    setShowBookingModal(false);
    // Reset selections
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setSelectedPlanId('');
  };

  const isDateAvailable = (date: Date) => {
    return availableDates.some(availableDate => isSameDay(availableDate, date));
  };

  const isDateInPast = (date: Date) => {
    return date < startOfDay(new Date());
  };

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-md ${className}`}>
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blue-600" />
        Đặt Lịch Khám
      </h3>

      {/* Week navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousWeek}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <span className="font-medium text-gray-900">
          {format(weekDates[0], 'dd/MM', { locale: vi })} - {format(weekDates[6], 'dd/MM/yyyy', { locale: vi })}
        </span>
        
        <button
          onClick={goToNextWeek}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Date selection */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {weekDates.map((date, index) => {
          const isAvailable = isDateAvailable(date);
          const isPast = isDateInPast(date);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          
          return (
            <button
              key={index}
              onClick={() => handleDateSelect(date)}
              disabled={!isAvailable || isPast}
              className={`
                p-3 rounded-lg text-center transition-all duration-200
                ${isSelected 
                  ? 'bg-blue-600 text-white' 
                  : isAvailable && !isPast
                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <div className="text-xs">
                {format(date, 'EEE', { locale: vi })}
              </div>
              <div className="font-bold">
                {format(date, 'dd')}
              </div>
              {isAvailable && !isPast && (
                <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-1"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Time slots */}
      {selectedDate && availableTimeSlots.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            Chọn Giờ Khám - {format(selectedDate, 'dd/MM/yyyy', { locale: vi })}
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availableTimeSlots.map((timeSlot, index) => {
              const isSelected = selectedTimeSlot === timeSlot;
              
              return (
                <button
                  key={timeSlot._id || index}
                  onClick={() => handleTimeSlotSelect(timeSlot)}
                  className={`
                    p-3 rounded-lg text-sm font-medium transition-all duration-200
                    ${isSelected
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  {isSelected && <Check className="w-4 h-4 inline mr-1" />}
                  {timeSlot.time}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* No time slots message */}
      {selectedDate && availableTimeSlots.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Không có khung giờ nào có sẵn cho ngày này</p>
        </div>
      )}

      {/* No dates available */}
      {availableDates.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Hiện tại không có lịch khám nào có sẵn</p>
          <p className="text-sm mt-1">Vui lòng liên hệ trực tiếp để đặt lịch</p>
        </div>
      )}

      {/* Confirmation button */}
      {selectedTimeSlot && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-green-800">
              <Check className="w-5 h-5" />
              <span className="font-medium">Đã chọn:</span>
            </div>
            <div className="mt-2 text-sm text-green-700">
              <div>Ngày: {selectedDate && format(selectedDate, 'dd/MM/yyyy, EEEE', { locale: vi })}</div>
              <div>Giờ: {selectedTimeSlot?.time}</div>
            </div>
          </div>
          
          <button 
            onClick={handleBookAppointment}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Tiếp Tục Đặt Lịch
          </button>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedDate && selectedTimeSlot && (
        <AppointmentBookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          doctor={doctor}
          selectedDate={selectedDate}
          selectedTimeSlot={selectedTimeSlot}
          planId={selectedPlanId}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
}
