'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Users, Star, Phone, MapPin, Clock } from 'lucide-react';
import { Container, Section, Breadcrumb } from '../layout';
import { Button, ErrorMessage, Badge } from '../ui';
import { specialistApi } from '@/services';
import type { Specialty } from '@/types/specialist';

interface SpecialistDetailPageProps {
  specialistId: string;
}

export function SpecialistDetailPage({ specialistId }: SpecialistDetailPageProps) {
  const [specialist, setSpecialist] = useState<Specialty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbItems = [
    { label: 'Trang Chủ', href: '/' },
    { label: 'Chuyên Khoa', href: '/specialists' },
    { label: specialist?.name || 'Chi Tiết', href: '#' }
  ];

  useEffect(() => {
    fetchSpecialistDetail();
  }, [specialistId]);

  const fetchSpecialistDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await specialistApi.getSpecialistById(specialistId);
      
      // Handle MongoDB _id mapping
      const transformedResult = {
        ...result,
        id: result.id || (result as any)._id,
        doctors: result.doctors?.map(doctor => ({
          ...doctor,
          id: doctor.id || (doctor as any)._id
        })) || []
      };
      
      setSpecialist(transformedResult);
    } catch (err) {
      console.error('Error fetching specialist detail:', err);
      setError('Không thể tải thông tin chuyên khoa. Vui lòng thử lại sau.');
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
                <p className="text-xl text-gray-600 max-w-2xl">{specialist.description}</p>
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
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content Column */}
            <div className="lg:col-span-2">
              {/* Detailed Description */}
              {specialist.detailedDescription && (
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Giới Thiệu Chuyên Khoa</h2>
                  <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                    {specialist.detailedDescription.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))}
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

              {/* Doctors */}
              {specialist.doctors && specialist.doctors.length > 0 && (
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Đội Ngũ Bác Sĩ ({specialist.doctors.length})
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {specialist.doctors.map((doctor) => (
                      <div key={doctor.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-8 h-8 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{doctor.name}</h3>
                            {doctor.title && (
                              <p className="text-sm text-gray-600">{doctor.title}</p>
                            )}
                            {doctor.experience && (
                              <p className="text-sm text-blue-600">{doctor.experience} năm kinh nghiệm</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                        {specialist.doctors?.length || 0}+ bác sĩ
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
