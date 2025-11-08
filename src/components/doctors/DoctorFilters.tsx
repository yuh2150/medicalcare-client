'use client';

import { useState } from 'react';
import { Search, Filter, Grid3X3, List, MapPin, Star } from 'lucide-react';
import { Input, Button } from '@/components/ui';

interface DoctorFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: any) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function DoctorFilters({
  onSearch,
  onFilterChange,
  viewMode,
  onViewModeChange
}: DoctorFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const specialties = [
    'Tim mạch',
    'Nhi khoa', 
    'Sản phụ khoa',
    'Thần kinh',
    'Mắt',
    'Răng hàm mặt',
    'Da liễu',
    'Xương khớp',
    'Tiêu hóa',
    'Tai mũi họng',
    'Ung bướu',
    'Nội tiết',
    'Thẩm mỹ',
    'Cấp cứu'
  ];

  const locations = [
    'Hà Nội',
    'TP. Hồ Chí Minh',
    'Đà Nẵng',
    'Cần Thơ',
    'Hải Phòng',
    'Nha Trang',
    'Huế'
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
      {/* Main search bar */}
      <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Tìm kiếm bác sĩ theo tên, chuyên khoa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center gap-3">
          {/* Filter button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Bộ Lọc
          </Button>
          
          {/* View mode toggle */}
          <div className="flex border border-gray-300 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`p-3 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={`p-3 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          
          <Button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium"
          >
            Tìm Kiếm
          </Button>
        </div>
      </form>

      {/* Advanced filters */}
      {showFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Chuyên khoa
              </label>
              <select
                onChange={(e) => onFilterChange({ specialty: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tất cả chuyên khoa</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Địa điểm
              </label>
              <select
                onChange={(e) => onFilterChange({ location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tất cả địa điểm</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Kinh nghiệm
              </label>
              <select
                onChange={(e) => onFilterChange({ experience: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tất cả</option>
                <option value="0-5">0-5 năm</option>
                <option value="5-10">5-10 năm</option>
                <option value="10-15">10-15 năm</option>
                <option value="15+">15+ năm</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Đánh giá
              </label>
              <select
                onChange={(e) => onFilterChange({ rating: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tất cả</option>
                <option value="4">4+ sao</option>
                <option value="4.5">4.5+ sao</option>
                <option value="5">5 sao</option>
              </select>
            </div>
          </div>

          {/* Quick filters */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Bộ lọc nhanh:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Đánh giá cao', filter: { rating: '4.5' } },
                { label: 'Kinh nghiệm dày dặn', filter: { experience: '10+' } },
                { label: 'Có lịch hôm nay', filter: { available: 'today' } },
                { label: 'Phí khám dưới 500k', filter: { fee: 'under-500k' } }
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => onFilterChange(item.filter)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
