'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Users, Star, Phone, MapPin, Clock } from 'lucide-react';
import { Container, Section, Breadcrumb } from '../layout';
import { Button, ErrorMessage, Badge } from '../ui';
import { HTMLContent } from '../ui/HTMLContent';
import { DoctorCard } from '../doctors/DoctorCard';
import { specialistApi, doctorApi } from '@/services';
import { normalizeId, normalizeIds } from '@/lib/utils';
import type { Specialty } from '@/types/specialist';
import type { Doctor } from '@/types';

interface SpecialistDetailPageProps {
  specialistId: string;
}

export function SpecialistDetailPage({ specialistId }: SpecialistDetailPageProps) {
  const [specialist, setSpecialist] = useState<Specialty | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbItems = [
    { label: 'Trang Chủ', href: '/' },
    { label: 'Chuyên Khoa', href: '/specialists' },
    { label: specialist?.name || 'Chi Tiết', href: '#' }
  ];

  useEffect(() => {
    fetchSpecialistDetail();
    fetchDoctorsBySpecialty();
  }, [specialistId]);

  const fetchSpecialistDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await specialistApi.getSpecialistById(specialistId);
      
      // Normalize IDs for compatibility
      const transformedResult = normalizeId({
        ...result,
        doctors: result.doctors ? normalizeIds(result.doctors) : []
      });
      
      setSpecialist(transformedResult);
    } catch (err) {
      console.error('Error fetching specialist detail:', err);
      setError('Không thể tải thông tin chuyên khoa. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorsBySpecialty = async () => {
    try {
      setDoctorsLoading(true);
      
      // Fetch doctors by specialty ID (use specialistId directly)
      const doctorsResult = await doctorApi.getDoctorsBySpecialty(specialistId);
      
      // Transform doctors to match expected type
      const transformedDoctors = doctorsResult.map(doctor => ({
        ...doctor,
        id: doctor.id || (doctor as any)._id || '',
        specialty: typeof doctor.specialty === 'string' ? doctor.specialty : (doctor.specialty as any)?.name || ''
      })) as Doctor[];
      
      setDoctors(transformedDoctors);
    } catch (err) {
      console.error('Error fetching doctors by specialty:', err);
      // Don't show error for doctors, just log it
      setDoctors([]);
    } finally {
      setDoctorsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Loading skeleton */}
        <Section background="white" padding="lg">
          <Container>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-48 mb-6"></div>
              <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96"></div>
            </div>
          </Container>
        </Section>
        
        <div className="relative h-64 bg-gray-200 animate-pulse"></div>
        
        <Section padding="lg">
          <Container>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
              <div className="space-y-4">
                <div className="h-48 bg-gray-200 rounded-2xl animate-pulse"></div>
              </div>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  if (error || !specialist) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Section background="white" padding="lg">
          <Container>
            <div className="py-20 flex items-center justify-center">
              <ErrorMessage message={error || 'Không tìm thấy thông tin chuyên khoa'} />
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
          <Breadcrumb items={breadcrumbItems} className="mb-6" />
          
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/specialists"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Quay lại</span>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{specialist.name}</h1>
              {specialist.description && (
                <div className="text-xl text-gray-600 max-w-2xl">
                  <HTMLContent content={specialist.description} />
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => window.location.href = '/appointments/book'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-semibold flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Đặt Lịch Khám
              </Button>
              
              <Button
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-2xl font-semibold"
              >
                Tư Vấn Trực Tuyến
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Banner Image */}
      {specialist.bannerImage && (
        <div className="relative h-64 lg:h-80">
          <Image
            src={specialist.bannerImage}
            alt={specialist.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      )}

      {/* Main Content */}
      <Section padding="xl">
        <Container>
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-3">
              {/* Detailed Description */}
              {specialist.detailedDescription && (
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Giới Thiệu Chuyên Khoa</h2>
                  <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                    <HTMLContent content={specialist.detailedDescription} />
                  </div>
                </div>
              )}

              {/* Services */}
              {specialist.services && specialist.services.length > 0 && (
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Dịch Vụ Chính</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {specialist.services.map((service, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100"
                      >
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-800 font-medium">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Đội ngũ bác sĩ */}
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Đội Ngũ Bác Sĩ {specialist.name}
                    {!doctorsLoading && doctors.length > 0 && (
                      <span className="text-blue-600 ml-2">({doctors.length})</span>
                    )}
                  </h2>
                  {doctors.length > 6 && (
                    <Link 
                      href={`/doctors?specialtyId=${specialist.id}&specialty=${encodeURIComponent(specialist.name)}`}
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      Xem tất cả
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </Link>
                  )}
                </div>
                
                {doctorsLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }, (_, i) => (
                      <div key={i} className="bg-gray-50 rounded-2xl p-6 animate-pulse">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : doctors.length > 0 ? (
                  <div className="space-y-4">
                    {doctors.slice(0, 6).map((doctor) => (
                      <DoctorCard key={doctor.id} doctor={doctor} viewMode="list" />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Chưa có bác sĩ
                    </h3>
                    <p className="text-gray-600">
                      Hiện tại chưa có bác sĩ nào thuộc chuyên khoa này.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sticky top-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Thông Tin Nhanh</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Số bác sĩ</div>
                      <div className="font-semibold text-gray-900">
                        {doctorsLoading ? (
                          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                        ) : (
                          `${doctors.length}+ bác sĩ`
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Giờ hoạt động</div>
                      <div className="font-semibold text-gray-900">24/7 Cấp cứu</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Địa điểm</div>
                      <div className="font-semibold text-gray-900">Tầng 3-5, WebMedical</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Phone className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Liên hệ</div>
                      <div className="font-semibold text-gray-900">+84 (028) 123-4567</div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-200">
                  <Button
                    onClick={() => window.location.href = '/appointments/book'}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-5 h-5" />
                    Đặt Lịch Ngay
                  </Button>
                </div>
              </div>

              {/* Status Badge */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="text-center">
                  <Badge variant="success" className="text-sm font-medium">
                    ✅ Đang Hoạt Động
                  </Badge>
                  <p className="text-sm text-gray-600 mt-2">
                    Chuyên khoa đang sẵn sàng phục vụ bệnh nhân
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Floating CTA */}
      <div className="fixed bottom-6 right-6 z-50 lg:hidden">
        <button 
          onClick={() => window.location.href = '/appointments/book'}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-3 font-semibold"
        >
          <Calendar className="w-5 h-5" />
          <span>Đặt Lịch</span>
        </button>
      </div>
    </div>
  );
}
