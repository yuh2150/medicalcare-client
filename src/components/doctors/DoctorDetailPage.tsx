'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Clock
} from 'lucide-react';
import { doctorApi, planApi } from '@/services';
import appointmentApi from '@/services/appointmentApi';
import type { AppointmentBookingData } from './AppointmentBookingModal';
import { ErrorMessage, LoadingSpinner } from '@/components/ui';
import { HTMLContent } from '@/components/ui/HTMLContent';
import { Section, Container } from '@/components/ui/Layout';
import { DoctorCard } from './DoctorCard';
import { AppointmentScheduler } from './AppointmentScheduler';
import { DoctorInfoSection } from './DoctorInfoSection';
import { getId, normalizeId, normalizeIds } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import type { Doctor, Plan, TimeSlot } from '@/types';

interface DoctorDetailPageProps {
  doctorId: string;
}

export function DoctorDetailPage({ doctorId }: DoctorDetailPageProps) {
  const { user, isAuthenticated } = useAuth();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [relatedDoctors, setRelatedDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);

  const handleBookAppointment = async (bookingData: AppointmentBookingData) => {
    console.log('Booking appointment:', bookingData);
    
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      alert('Bạn cần đăng nhập để đặt lịch khám. Vui lòng đăng nhập trước.');
      // TODO: Redirect to login page or show login modal
      return;
    }

    // Check if user role is customer
    if (user.role !== 'customer') {
      alert('Chỉ khách hàng mới có thể đặt lịch khám.');
      return;
    }
    
    try {
      // Create appointment using API
      // Find the selected plan to get the date
      const selectedPlan = plans.find(plan => 
        (plan.id || plan._id) === bookingData.planId
      );
      
      const appointmentData = {
        customerId: user.id, // Get from authenticated user context
        doctorId: doctorId,
        planId: bookingData.planId,
        date: selectedPlan?.date || new Date().toISOString().split('T')[0],
        timeSlot: bookingData.timeSlot.time, // Use the time field directly (e.g., "08:00-09:00")
        reason: bookingData.patientInfo.notes || 'Khám tổng quát',
        notes: `Tên: ${bookingData.patientInfo.name}, SĐT: ${bookingData.patientInfo.phone}${bookingData.patientInfo.email ? `, Email: ${bookingData.patientInfo.email}` : ''}${bookingData.patientInfo.notes ? `, Ghi chú: ${bookingData.patientInfo.notes}` : ''}`
      };

      await appointmentApi.createAppointment(appointmentData);
      alert('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn để xác nhận lịch khám.');
      
      // Refresh plans to update availability
      fetchDoctorDetail();
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      alert(error.message || 'Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.');
    }
  };

  const breadcrumbItems = [
    { label: 'Trang Chủ', href: '/' },
    { label: 'Bác Sĩ', href: '/doctors' },
    { label: doctor?.name || 'Chi Tiết', href: '#' }
  ];

  useEffect(() => {
    fetchDoctorDetail();
  }, [doctorId]);

  const fetchDoctorDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch doctor details
      const doctorResult = await doctorApi.getDoctorById(doctorId);
      const transformedDoctor = normalizeId(doctorResult);
      setDoctor(transformedDoctor as unknown as Doctor);

      // Fetch doctor's plans/schedule
      try {
        const plansResult = await planApi.getPlansByDoctor(doctorId);
        setPlans(plansResult as unknown as Plan[] || []);
      } catch (planError) {
        console.warn('Could not fetch doctor plans:', planError);
        setPlans([]);
      }

      // Fetch related doctors (same specialty)
      if (transformedDoctor.specialty) {
        try {
          const specialtyName = typeof transformedDoctor.specialty === 'string' 
            ? transformedDoctor.specialty 
            : transformedDoctor.specialty.name;
          const relatedResult = await doctorApi.getDoctorsBySpecialty(specialtyName);
          const filteredRelated = relatedResult
            .filter(d => getId(d) !== getId(transformedDoctor))
            .slice(0, 3);
          setRelatedDoctors(filteredRelated as unknown as Doctor[]);
        } catch (relatedError) {
          console.warn('Could not fetch related doctors:', relatedError);
          setRelatedDoctors([]);
        }
      }
      
    } catch (err) {
      console.error('Error fetching doctor detail:', err);
      setError('Không thể tải thông tin bác sĩ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Loading skeleton */}
        <Section background="white" padding="lg">
          <Container>
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-64 mb-6"></div>
              <div className="h-8 bg-gray-200 rounded w-96 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full max-w-2xl"></div>
            </div>
          </Container>
        </Section>
        
        <div className="relative h-64 bg-gray-200 animate-pulse"></div>
        
        <Section padding="lg">
          <Container>
            <LoadingSpinner />
          </Container>
        </Section>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Section background="white" padding="lg">
          <Container>
            <div className="text-center py-12">
              <ErrorMessage message={error || 'Không tìm thấy thông tin bác sĩ'} />
              <Link href="/doctors" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
                ← Quay lại danh sách bác sĩ
              </Link>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Section background="white" padding="lg">
        <Container>
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm">
              {breadcrumbItems.map((item, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                  <a href={item.href} className="text-blue-600 hover:text-blue-800">
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          
          {/* Doctor info header */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-linear-to-br from-blue-100 to-blue-200 ring-4 ring-white shadow-lg shrink-0">
              {doctor.avatar ? (
                <Image
                  src={doctor.avatar}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder-doctor.png';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-4xl">
                  👨‍⚕️
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dr. {doctor.name}
              </h1>
              <p className="text-xl text-blue-600 font-medium mb-4">
                {doctor.specialty}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(doctor.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">
                  {doctor.rating} ({doctor.reviewCount || 0} đánh giá)
                </span>
              </div>

              {/* Học hàm, học vị */}
              {(doctor.academicRank || doctor.academicDegree) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {doctor.academicRank && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      {doctor.academicRank}
                    </span>
                  )}
                  {doctor.academicDegree && (
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                      {doctor.academicDegree}
                    </span>
                  )}
                </div>
              )}


            </div>

            {/* Book appointment button */}
            <div className="shrink-0">
              {!isAuthenticated ? (
                <div className="text-center">
                  <button 
                    onClick={() => alert('Vui lòng đăng nhập để đặt lịch khám.')}
                    className="bg-gray-400 text-white px-8 py-4 rounded-2xl font-semibold cursor-not-allowed flex items-center gap-2 mb-2"
                    disabled
                  >
                    <Calendar className="w-5 h-5" />
                    Đặt Lịch Khám
                  </button>
                  <p className="text-sm text-gray-500">Cần đăng nhập</p>
                </div>
              ) : user?.role !== 'customer' ? (
                <div className="text-center">
                  <button 
                    className="bg-gray-400 text-white px-8 py-4 rounded-2xl font-semibold cursor-not-allowed flex items-center gap-2 mb-2"
                    disabled
                  >
                    <Calendar className="w-5 h-5" />
                    Đặt Lịch Khám
                  </button>
                  <p className="text-sm text-gray-500">Chỉ khách hàng mới có thể đặt lịch</p>
                </div>
              ) : (
                <button 
                  onClick={() => setShowScheduler(!showScheduler)}
                  className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  {showScheduler ? 'Ẩn Lịch Khám' : 'Đặt Lịch Khám'}
                </button>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Appointment Scheduler */}
      {showScheduler && (
        <Section background="gray" padding="lg">
          <Container>
            <AppointmentScheduler 
              plans={plans}
              doctor={doctor}
              onBookAppointment={handleBookAppointment}
            />
          </Container>
        </Section>
      )}

      {/* Main Content */}
      <Section padding="xl">
        <Container>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main info */}
            <div className="lg:col-span-2">
              <DoctorInfoSection doctor={doctor} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Schedule Summary */}
              {plans.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Lịch Khám Gần Nhất
                  </h3>
                  <div className="space-y-3">
                    {plans.slice(0, 3).map((plan) => (
                      <div key={plan.id || plan._id} className="border border-gray-200 rounded-lg p-3">
                        <div className="font-medium text-gray-900">{plan.date}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {plan.timeSlots?.filter(slot => !slot.isBooked).length || 0} khung giờ có sẵn
                        </div>
                      </div>
                    ))}
                  </div>
                  {isAuthenticated && user?.role === 'customer' ? (
                    <button 
                      onClick={() => setShowScheduler(true)}
                      className="w-full mt-4 text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Đặt lịch khám →
                    </button>
                  ) : (
                    <div className="w-full mt-4 text-gray-400 font-medium flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {!isAuthenticated ? 'Cần đăng nhập để đặt lịch' : 'Chỉ khách hàng có thể đặt lịch'}
                    </div>
                  )}
                </div>
              )}

              {/* Contact info */}
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Thông Tin Liên Hệ</h3>
                <div className="space-y-3">
                  {doctor.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <a href={`tel:${doctor.phone}`} className="text-gray-600 hover:text-blue-600">
                        {doctor.phone}
                      </a>
                    </div>
                  )}
                  {doctor.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <a href={`mailto:${doctor.email}`} className="text-gray-600 hover:text-blue-600">
                        {doctor.email}
                      </a>
                    </div>
                  )}
                  {doctor.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-600">{doctor.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related doctors */}
          {relatedDoctors.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Bác Sĩ Cùng Chuyên Khoa
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedDoctors.map((relatedDoctor) => (
                  <DoctorCard 
                    key={relatedDoctor.id || relatedDoctor._id} 
                    doctor={relatedDoctor} 
                  />
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* Floating CTA */}
      {isAuthenticated && user?.role === 'customer' && (
        <div className="fixed bottom-6 right-6 z-50 lg:hidden">
          <button 
            onClick={() => setShowScheduler(true)}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300"
          >
            <Calendar className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
