'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react';
import { specialistApi } from '@/services';
import type { Specialty } from '@/types/specialist';

interface QuickBookingWidgetProps {
  className?: string;
}

export function QuickBookingWidget({ className = '' }: QuickBookingWidgetProps) {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchSpecialties = async () => {
    try {
      setLoading(true);
      const result = await specialistApi.getSpecialists({ page: 1, limit: 10 });
      setSpecialties(result.data || []);
    } catch (err) {
      console.error('Error fetching specialties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickBook = () => {
    if (selectedSpecialty) {
      window.location.href = `/appointments/book?specialtyId=${selectedSpecialty}`;
    } else {
      window.location.href = '/appointments/book';
    }
  };

  return (
    <div className={`bg-white rounded-3xl shadow-lg border border-gray-100 p-8 ${className}`}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Đặt Lịch Nhanh</h3>
        <p className="text-gray-600">Chọn chuyên khoa và đặt lịch ngay</p>
      </div>

      <div className="space-y-4">
        {/* Specialty Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chuyên khoa (tùy chọn)
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              disabled={loading}
            >
              <option value="">Chọn chuyên khoa...</option>
              {specialties.map((specialty) => (
                <option key={specialty.id || specialty._id} value={specialty.id || specialty._id}>
                  {specialty.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-sm text-gray-600">Thời gian</div>
            <div className="font-semibold text-gray-900">24/7</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-sm text-gray-600">Đặt lịch</div>
            <div className="font-semibold text-gray-900">Miễn phí</div>
          </div>
        </div>

        {/* Book Button */}
        <button
          onClick={handleQuickBook}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          <span>Đặt Lịch Ngay</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Alternative Links */}
        <div className="text-center text-sm text-gray-500">
          Hoặc{' '}
          <a href="/doctors" className="text-blue-600 hover:text-blue-700 font-medium">
            tìm bác sĩ
          </a>
          {' '}phù hợp với bạn
        </div>
      </div>
    </div>
  );
}
