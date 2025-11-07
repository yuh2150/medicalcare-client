"use client";
import { useState } from 'react';
import { Search, MapPin, Calendar, Users, Award, HeartHandshake } from 'lucide-react';

// Component Section Tìm kiếm Nâng cao
export function SearchSection() {
  const [searchType, setSearchType] = useState('doctor');
  
  return (
    <section className="bg-white py-16 relative">
      {/* Hoa văn nền tinh tế */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-600 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-blue-400 rounded-full blur-2xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tìm Dịch Vụ Chăm Sóc</h2>
            <p className="text-gray-600">Tìm kiếm bác sĩ, khoa hoặc dịch vụ</p>
          </div>
          
          {/* Thẻ tìm kiếm */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            {/* Tab loại tìm kiếm */}
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 p-1 rounded-2xl flex">
                {[
                  { id: 'doctor', label: 'Bác sĩ', icon: Users },
                  { id: 'department', label: 'Khoa', icon: HeartHandshake },
                  { id: 'service', label: 'Dịch vụ', icon: Award }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setSearchType(id)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                      searchType === id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form tìm kiếm */}
            <div className="grid md:grid-cols-12 gap-4 items-end">
              {/* Tìm kiếm chính */}
              <div className="md:col-span-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm {searchType === 'doctor' ? 'bác sĩ' : searchType === 'department' ? 'khoa' : 'dịch vụ'}
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={`Tìm ${searchType === 'doctor' ? 'bác sĩ' : searchType === 'department' ? 'khoa' : 'dịch vụ'}...`}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Bộ lọc vị trí */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vị trí
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-all">
                    <option>Tất cả vị trí</option>
                    <option>TP. Hồ Chí Minh</option>
                    <option>Hà Nội</option>
                    <option>Đà Nẵng</option>
                  </select>
                </div>
              </div>

              {/* Bộ lọc chuyên khoa (cho bác sĩ) */}
              {searchType === 'doctor' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chuyên khoa
                  </label>
                  <select className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-all">
                    <option>Tất cả chuyên khoa</option>
                    <option>Tim mạch</option>
                    <option>Nhi khoa</option>
                    <option>Da liễu</option>
                  </select>
                </div>
              )}

              {/* Nút tìm kiếm */}
              <div className={searchType === 'doctor' ? 'md:col-span-2' : 'md:col-span-4'}>
                <button className="w-full bg-blue-600 text-white py-4 px-6 rounded-2xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group">
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Tìm kiếm
                </button>
              </div>
            </div>

            {/* Liên kết nhanh */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Tìm kiếm phổ biến:</p>
              <div className="flex flex-wrap gap-2">
                {['Khám tổng quát', 'Tim mạch', 'Nhi khoa', 'Cấp cứu', 'Nha khoa'].map((term) => (
                  <button
                    key={term}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
