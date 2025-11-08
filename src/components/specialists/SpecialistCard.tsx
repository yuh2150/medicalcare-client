'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Users, Calendar } from 'lucide-react';
import { getId } from '@/lib/utils';
import { Specialty } from '@/types/specialist';
import { HTMLContent } from '../ui';

interface SpecialistCardProps {
  specialist: Specialty;
  viewMode?: 'grid' | 'list';
}

export function SpecialistCard({ specialist, viewMode = 'grid' }: SpecialistCardProps) {
  const defaultSpecialtyIcons: Record<string, string> = {
    'tim-mach': '❤️',
    'nhi-khoa': '👶',
    'san-phu-khoa': '🤱',
    'than-kinh': '🧠',
    'mat': '👁️',
    'rang-ham-mat': '🦷',
    'da-lieu': '🧴',
    'xuong-khop': '🦴',
    'tieu-hoa': '🫁',
    'tai-mui-hong': '👂',
    'ung-buou': '🎗️',
    'noi-tiet': '⚡',
    'tham-my': '✨',
    'cap-cuu': '🚨',
    'default': '🏥'
  };

  const getSpecialtyIcon = (name: string) => {
    const key = name.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9]/g, '-') // Replace special chars with -
      .replace(/-+/g, '-') // Replace multiple - with single -
      .replace(/^-|-$/g, ''); // Remove leading/trailing -
    
    return defaultSpecialtyIcons[key] || defaultSpecialtyIcons.default;
  };

  if (viewMode === 'list') {
    return (
      <Link href={`/specialists/${getId(specialist)}`}>
        <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 p-6 m-6">
          <div className="flex items-center gap-6">
            {/* Icon/Image */}
            <div className="shrink-0">
              {(specialist.image || specialist.thumbnail) ? (
                <div className="w-16 h-16 rounded-2xl overflow-hidden">
                  <Image
                    src={specialist.image || specialist.thumbnail || ''}
                    alt={specialist.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-105 transition-transform duration-300">
                  {getSpecialtyIcon(specialist.name)}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                {specialist.name}
              </h3>
              {specialist.description && (
                <p className="text-gray-600 line-clamp-2 mb-3">
                  {specialist.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>Nhiều bác sĩ</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Đặt lịch dễ dàng</span>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="shrink-0">
              <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/specialists/${getId(specialist)}`}>
      <div className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden transform hover:-translate-y-2">
        {/* Image/Icon Header */}
        <div className="relative h-48 bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center">
          {(specialist.image || specialist.thumbnail) ? (
            <Image
              src={specialist.image || specialist.thumbnail || ''}
              alt={specialist.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="text-6xl opacity-80 group-hover:scale-110 transition-transform duration-300">
              {getSpecialtyIcon(specialist.name)}
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3 line-clamp-1">
            {specialist.name}
          </h3>
          
          {specialist.description && (
            <div className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
              <HTMLContent 
                content={specialist.description}
                maxLength={150}
                showReadMore={false}
                enableLinks={false}
                enableTables={false}
                className="text-sm"
              />
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>Nhiều bác sĩ</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Có sẵn</span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between">
            <span className="text-blue-600 font-medium group-hover:text-blue-700">
              Xem Chi Tiết
            </span>
            <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
}
