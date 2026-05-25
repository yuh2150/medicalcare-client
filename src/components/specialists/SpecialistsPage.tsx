'use client';

import { useState, useEffect } from 'react';
import { Container, Section, Breadcrumb } from '../layout';
import { ErrorMessage } from '../ui';
import { SpecialistFilters } from './SpecialistFilters';
import { SpecialistCard } from './SpecialistCard';
import { SpecialistSkeleton } from './SpecialistSkeleton';
import { specialistApi } from '@/services';
import { normalizeIds } from '@/lib/utils';
import type { Specialty, SpecialistFilter, PaginatedSpecialists } from '@/types/specialist';

export function SpecialistsPage() {
  const [specialists, setSpecialists] = useState<PaginatedSpecialists | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<SpecialistFilter>({
    search: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const breadcrumbItems = [
    { label: 'Trang Chủ', href: '/' },
    { label: 'Chuyên Khoa', href: '/specialists' }
  ];

  useEffect(() => {
    fetchSpecialists();
  }, [filters, page]);

  const fetchSpecialists = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Clean up filters to avoid sending undefined values
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null && value !== '')
      );
      
      const result = await specialistApi.getSpecialists({
        page,
        limit: 12,
        ...cleanFilters
      });
      
      // Normalize IDs for compatibility
      const transformedResult = {
        ...result,
        data: normalizeIds(result.data.map(specialist => ({
          ...specialist,
          doctors: specialist.doctors ? normalizeIds(specialist.doctors) : []
        })))
      };
      
      setSpecialists(transformedResult);
    } catch (err) {
      console.error('Error fetching specialists:', err);
      setError('Không thể tải danh sách chuyên khoa. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setPage(1);
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleFilterChange = (newFilters: Partial<SpecialistFilter>) => {
    setPage(1);
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  const totalItems = specialists?.pagination?.total ?? specialists?.data.length ?? 0;
  const totalPages = specialists?.pagination?.totalPages ?? Math.max(1, Math.ceil(totalItems / 12));
  const currentPage = specialists?.pagination?.page ?? page;
  const shouldClientPaginate = !specialists?.pagination || specialists.data.length > 12;
  const pagedData = specialists
    ? (shouldClientPaginate
        ? specialists.data.slice((page - 1) * 12, page * 12)
        : specialists.data)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <Section background="white" padding="lg">
        <Container>
          <Breadcrumb items={breadcrumbItems} className="mb-6" />
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Chuyên Khoa Y Tế</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Khám phá các chuyên khoa đa dạng với đội ngũ bác sĩ chuyên gia giàu kinh nghiệm
            </p>
          </div>
        </Container>
      </Section>

      {/* Main Content */}
      <Section padding="lg">
        <Container>
          {/* Filters */}
          <SpecialistFilters
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />

          {/* Content */}
          {loading ? (
            <SpecialistSkeleton viewMode={viewMode} count={8} />
          ) : error ? (
            <div className="py-20 flex items-center justify-center">
              <ErrorMessage message={error} />
            </div>
          ) : specialists && specialists.data.length > 0 ? (
            <>
              {/* Results count */}
              <div className="mb-6">
                <p className="text-gray-600">
                  Tìm thấy <span className="font-semibold text-gray-900">{totalItems}</span> chuyên khoa
                </p>
              </div>

              {/* Specialists Grid/List */}
              {viewMode === 'grid' ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {pagedData.map((specialist) => (
                    <SpecialistCard
                      key={specialist.id}
                      specialist={specialist}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {pagedData.map((specialist) => (
                    <SpecialistCard
                      key={specialist.id}
                      specialist={specialist}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
                    <div className="flex items-center gap-2">
                      <button
                        disabled={page <= 1}
                        onClick={() => setPage(prev => Math.max(1, prev - 1))}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Trước
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setPage(page)}
                            className={`w-10 h-10 text-sm font-medium rounded-xl transition-colors ${
                              page === currentPage
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        disabled={page >= totalPages}
                        onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sau
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🏥</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Không tìm thấy chuyên khoa
                </h3>
                <p className="text-gray-600">
                  Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm khác.
                </p>
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* Floating CTA */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => window.location.href = '/appointments/book'}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-3 font-semibold group"
        >
          <span>📅</span>
          <span className="hidden sm:inline">Đặt Lịch Khám Ngay</span>
          <span className="sm:hidden">Đặt Lịch</span>
        </button>
      </div>
    </div>
  );
}
