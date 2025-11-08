'use client';

import { useState, useEffect } from 'react';
import { Search, Calendar, Clock, User, MapPin, Phone, ChevronDown } from 'lucide-react';
import { specialistApi, doctorApi, planApi } from '@/services';
import appointmentApi from '@/services/appointmentApi';
import { useAuth } from '@/context/AuthContext';
import { Section, Container, Breadcrumb } from '@/components/ui/Layout';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import { DoctorCard } from '@/components/doctors/DoctorCard';
import { AppointmentScheduler } from '@/components/doctors/AppointmentScheduler';
import type { AppointmentBookingData } from '@/components/doctors/AppointmentBookingModal';
import type { Specialty } from '@/types/specialist';
import type { Doctor, Plan } from '@/types';

interface SearchFilters {
  specialtyId: string;
  doctorId: string;
  location: string;
}

export function AppointmentBookingPage() {
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState<'search' | 'select-doctor' | 'book'>('search');
  const [filters, setFilters] = useState<SearchFilters>({
    specialtyId: '',
    doctorId: '',
    location: ''
  });
  
  // Data states
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctorPlans, setDoctorPlans] = useState<Plan[]>([]);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const breadcrumbItems = [
    { label: 'Trang Chủ', href: '/' },
    { label: 'Đặt Lịch Khám', href: '#' }
  ];

  useEffect(() => {
    fetchSpecialties();
  }, []);

  useEffect(() => {
    if (filters.specialtyId) {
      fetchDoctorsBySpecialty(filters.specialtyId);
    }
  }, [filters.specialtyId]);

  const fetchSpecialties = async () => {
    try {
      setLoading(true);
      const result = await specialistApi.getSpecialists({ page: 1, limit: 100 });
      setSpecialties(result.data || []);
    } catch (err) {
      console.error('Error fetching specialties:', err);
      setError('Không thể tải danh sách chuyên khoa');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorsBySpecialty = async (specialtyId: string) => {
    try {
      setLoading(true);
      const result = await doctorApi.getDoctorsBySpecialty(specialtyId);
      // Transform doctors to match expected type
      const transformedDoctors = result.map((doctor: any) => ({
        ...doctor,
        id: doctor.id || doctor._id || '',
        specialty: typeof doctor.specialty === 'string' ? doctor.specialty : doctor.specialty?.name || ''
      })) as Doctor[];
      setDoctors(transformedDoctors);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Không thể tải danh sách bác sĩ');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpecialtyChange = (specialtyId: string) => {
    setFilters(prev => ({ ...prev, specialtyId }));
    setSelectedDoctor(null);
    setDoctorPlans([]);
    if (specialtyId) {
      setStep('select-doctor');
    }
  };

  const handleDoctorSelect = async (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setStep('book');
    
    // Fetch doctor's plans
    try {
      setLoading(true);
      const plans = await planApi.getPlansByDoctor(doctor.id || doctor._id || '');
      setDoctorPlans(plans as Plan[]);
    } catch (err) {
      console.error('Error fetching doctor plans:', err);
      setDoctorPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async (bookingData: AppointmentBookingData) => {
    if (!isAuthenticated || !user || !selectedDoctor) {
      alert('Vui lòng đăng nhập để đặt lịch khám.');
      return;
    }

    if (user.role !== 'customer') {
      alert('Chỉ khách hàng mới có thể đặt lịch khám.');
      return;
    }

    try {
      setLoading(true);
      
      // Find the selected plan to get the date
      const selectedPlan = doctorPlans.find(plan => 
        (plan.id || plan._id) === bookingData.planId
      );
      
      const appointmentData = {
        customerId: user.id,
        doctorId: selectedDoctor.id || selectedDoctor._id || '',
        planId: bookingData.planId,
        date: selectedPlan?.date || new Date().toISOString().split('T')[0],
        timeSlot: bookingData.timeSlot.time,
        reason: bookingData.patientInfo.notes || 'Khám tổng quát',
        notes: `Tên: ${bookingData.patientInfo.name}, SĐT: ${bookingData.patientInfo.phone}${bookingData.patientInfo.email ? `, Email: ${bookingData.patientInfo.email}` : ''}${bookingData.patientInfo.notes ? `, Ghi chú: ${bookingData.patientInfo.notes}` : ''}`
      };

      await appointmentApi.createAppointment(appointmentData);
      alert('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn để xác nhận lịch khám.');
      
      // Reset form
      setStep('search');
      setFilters({ specialtyId: '', doctorId: '', location: '' });
      setSelectedDoctor(null);
      setDoctorPlans([]);
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      alert(error.message || 'Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Section background="white" padding="lg">
        <Container>
          <Breadcrumb items={breadcrumbItems} className="mb-6" />
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Đặt Lịch Khám</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tìm kiếm bác sĩ phù hợp và đặt lịch khám một cách dễ dàng
            </p>
          </div>
        </Container>
      </Section>

      {/* Progress Steps */}
      <Section background="gray" padding="sm">
        <Container>
          <div className="flex items-center justify-center space-x-8 py-4">
            <div className={`flex items-center gap-2 ${step === 'search' ? 'text-blue-600' : step === 'select-doctor' || step === 'book' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step === 'search' ? 'bg-blue-600 text-white' : 
                step === 'select-doctor' || step === 'book' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                1
              </div>
              <span className="font-medium">Chọn Chuyên Khoa</span>
            </div>
            
            <div className={`w-12 h-0.5 ${step === 'select-doctor' || step === 'book' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            
            <div className={`flex items-center gap-2 ${step === 'select-doctor' ? 'text-blue-600' : step === 'book' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step === 'select-doctor' ? 'bg-blue-600 text-white' : 
                step === 'book' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
              <span className="font-medium">Chọn Bác Sĩ</span>
            </div>
            
            <div className={`w-12 h-0.5 ${step === 'book' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            
            <div className={`flex items-center gap-2 ${step === 'book' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step === 'book' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                3
              </div>
              <span className="font-medium">Đặt Lịch</span>
            </div>
          </div>
        </Container>
      </Section>

      {/* Main Content */}
      <Section padding="xl">
        <Container>
          {error && (
            <div className="mb-6">
              <ErrorMessage message={error} />
            </div>
          )}

          {/* Step 1: Search Specialty */}
          {step === 'search' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Chọn Chuyên Khoa Khám
                </h2>
                
                {loading ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {specialties.map((specialty) => (
                      <button
                        key={specialty.id || specialty._id}
                        onClick={() => handleSpecialtyChange(specialty.id || specialty._id || '')}
                        className="p-4 text-left border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <span className="text-2xl">🏥</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-700">
                              {specialty.name}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {(specialty as any).shortDesc || specialty.description || 'Khám và điều trị chuyên khoa'}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Select Doctor */}
          {step === 'select-doctor' && (
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Chọn Bác Sĩ
                  </h2>
                  <button
                    onClick={() => setStep('search')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    ← Quay lại chọn chuyên khoa
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm bác sĩ theo tên hoặc chuyên khoa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner />
                  </div>
                ) : filteredDoctors.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors.map((doctor) => (
                      <div
                        key={doctor.id || doctor._id}
                        className="cursor-pointer"
                        onClick={() => handleDoctorSelect(doctor)}
                      >
                        <DoctorCard doctor={doctor} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Không tìm thấy bác sĩ
                    </h3>
                    <p className="text-gray-600">
                      Thử thay đổi từ khóa tìm kiếm hoặc chọn chuyên khoa khác.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Book Appointment */}
          {step === 'book' && selectedDoctor && (
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Đặt Lịch Khám
                  </h2>
                  <button
                    onClick={() => setStep('select-doctor')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    ← Quay lại chọn bác sĩ
                  </button>
                </div>

                {/* Selected Doctor Info */}
                <div className="bg-blue-50 rounded-2xl p-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Dr. {selectedDoctor.name}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {selectedDoctor.specialty}
                      </p>
                      {selectedDoctor.experience && (
                        <p className="text-sm text-gray-600">
                          {selectedDoctor.experience}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Authentication Check */}
                {!isAuthenticated ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Cần Đăng Nhập
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Bạn cần đăng nhập để có thể đặt lịch khám.
                    </p>
                    <button
                      onClick={() => window.location.href = '/login'}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Đăng Nhập
                    </button>
                  </div>
                ) : user?.role !== 'customer' ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Quyền Truy Cập Bị Hạn Chế
                    </h3>
                    <p className="text-gray-600">
                      Chỉ khách hàng mới có thể đặt lịch khám.
                    </p>
                  </div>
                ) : (
                  /* Appointment Scheduler */
                  <AppointmentScheduler
                    plans={doctorPlans}
                    doctor={selectedDoctor}
                    onBookAppointment={handleBookAppointment}
                  />
                )}
              </div>
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
