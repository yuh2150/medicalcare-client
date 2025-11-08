'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { doctorApi } from '@/services';
import { DoctorCard } from './DoctorCard';
import { DoctorFilters } from './DoctorFilters';
import { DoctorSkeleton } from './DoctorSkeleton';
import { ErrorMessage } from '@/components/ui';
import { Section, Container } from '@/components/ui/Layout';
import { normalizeIds } from '@/lib/utils';
import type { Doctor } from '@/types';

interface DoctorFilter {
  search?: string;
  specialty?: string;
  specialtyId?: string;
  location?: string;
  experience?: string;
  rating?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface PaginatedDoctors {
  data: Doctor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function DoctorsPageContent() {
  const searchParams = useSearchParams();
  const [doctors, setDoctors] = useState<PaginatedDoctors | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState<DoctorFilter>(() => {
    const specialtyParam = searchParams.get('specialty');
    const specialtyIdParam = searchParams.get('specialtyId');
    return {
      search: '',
      specialty: specialtyParam || '',
      specialtyId: specialtyIdParam || '',
      sortBy: 'name',
      sortOrder: 'asc'
    };
  });

  const breadcrumbItems = [
    { label: 'Trang Chủ', href: '/' },
    { label: 'Bác Sĩ', href: '/doctors' },
    ...(filters.specialty ? [{ label: filters.specialty, href: '#' }] : [])
  ];

  // Update filters when URL params change
  useEffect(() => {
    const specialtyParam = searchParams.get('specialty');
    const specialtyIdParam = searchParams.get('specialtyId');
    
    if (specialtyParam !== filters.specialty || specialtyIdParam !== filters.specialtyId) {
      setFilters(prev => ({ 
        ...prev, 
        specialty: specialtyParam || '',
        specialtyId: specialtyIdParam || ''
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    fetchDoctors();
  }, [filters]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let result;
      
      // If we have specialtyId, use the specific endpoint
      if (filters.specialtyId) {
        const doctorsData = await doctorApi.getDoctorsBySpecialty(filters.specialtyId);
        result = {
          data: doctorsData,
          pagination: {
            page: 1,
            limit: 20,
            total: doctorsData.length,
            totalPages: Math.ceil(doctorsData.length / 20),
            hasNext: false,
            hasPrev: false
          }
        };
      } else {
        // Clean up filters to avoid sending undefined values
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        );
        
        result = await doctorApi.getDoctors({
          page: 1,
          limit: 20,
          ...cleanFilters
        });
      }
      
      // Normalize IDs for compatibility
      const transformedResult = {
        ...result,
        data: normalizeIds(result.data)
      };
      
      setDoctors(transformedResult as unknown as PaginatedDoctors);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleFilterChange = (newFilters: Partial<DoctorFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
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
          
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {filters.specialty ? `Bác Sĩ ${filters.specialty}` : 'Đội Ngũ Bác Sĩ'}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {filters.specialty 
                ? `Danh sách bác sĩ chuyên khoa ${filters.specialty} giàu kinh nghiệm và tận tâm`
                : 'Gặp gỡ đội ngũ bác sĩ chuyên gia giàu kinh nghiệm và tận tâm với sức khỏe của bạn'
              }
            </p>
          </div>
        </Container>
      </Section>

      {/* Main Content */}
      <Section padding="lg">
        <Container>
          {/* Filters */}
          <DoctorFilters
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />

          {/* Results */}
          {loading ? (
            <DoctorSkeleton viewMode={viewMode} count={8} />
          ) : error ? (
            <div className="text-center py-12">
              <ErrorMessage message={error} />
            </div>
          ) : doctors && doctors.data.length > 0 ? (
            <>
              {/* Results info */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  Tìm thấy <span className="font-semibold text-gray-900">{doctors.pagination.total}</span> bác sĩ
                </p>
                <div className="text-sm text-gray-500">
                  Trang {doctors.pagination.page} / {doctors.pagination.totalPages}
                </div>
              </div>

              {/* Doctor cards */}
              {viewMode === 'grid' ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {doctors.data.map((doctor) => (
                    <DoctorCard key={doctor.id || doctor._id} doctor={doctor} viewMode="grid" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {doctors.data.map((doctor) => (
                    <DoctorCard key={doctor.id || doctor._id} doctor={doctor} viewMode="list" />
                  ))}
                </div>
              )}

              {/* Pagination placeholder */}
              {doctors.pagination.totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="text-sm text-gray-500">
                    Phân trang sẽ được triển khai sau
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <div className="text-6xl mb-4">👨‍⚕️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy bác sĩ</h3>
                <p>Vui lòng thử điều chỉnh bộ lọc tìm kiếm của bạn.</p>
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* Floating CTA */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300">
          <span className="text-2xl">📞</span>
        </button>
      </div>
    </div>
  );
}
