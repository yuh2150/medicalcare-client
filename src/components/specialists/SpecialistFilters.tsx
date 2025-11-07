'use client';

import { useState } from 'react';
import { Search, Filter, Grid3X3, List } from 'lucide-react';
import { Input, Button } from '../ui';

interface SpecialistFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: any) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function SpecialistFilters({
  onSearch,
  onFilterChange,
  viewMode,
  onViewModeChange
}: SpecialistFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
      {/* Thanh tìm kiếm chính */}
      <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Tìm kiếm chuyên khoa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center gap-3">
          {/* Nút bộ lọc */}
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
          
          {/* Nút tìm kiếm */}
          <Button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium"
          >
            Tìm Kiếm
          </Button>
        </div>
      </form>

      {/* Bộ lọc mở rộng */}
      {showFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sắp xếp theo
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => onFilterChange({ sortBy: e.target.value })}
              >
                <option value="name">Tên chuyên khoa</option>
                <option value="createdAt">Mới nhất</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thứ tự
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => onFilterChange({ sortOrder: e.target.value })}
              >
                <option value="asc">Tăng dần</option>
                <option value="desc">Giảm dần</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => onFilterChange({ 
                  isActive: e.target.value === 'all' ? undefined : e.target.value === 'active' 
                })}
              >
                <option value="all">Tất cả</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
