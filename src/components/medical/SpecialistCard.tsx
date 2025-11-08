import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { getId } from '@/lib/utils';
import { HTMLContent } from '@/components/ui';
import type { Specialist } from '@/types';

// Component Thẻ Chuyên khoa
interface SpecialistCardProps {
  specialist: Specialist;
}

export function SpecialistCard({ specialist }: SpecialistCardProps) {
  return (
    <Link href={`/specialists/${specialist.slug || getId(specialist)}`}>
      <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100 overflow-hidden">
        <div className="relative h-48 bg-linear-to-br from-blue-50 to-blue-100 overflow-hidden">
          {(specialist.thumbnail || specialist.image) ? (
            <Image
              src={specialist.thumbnail || specialist.image || ''}
              alt={specialist.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder-specialist.png';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-6xl">
              🏥
            </div>
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
            {specialist.name}
          </h3>
          <div className="text-gray-600 leading-relaxed mb-4">
            <HTMLContent 
              content={specialist.shortDesc || specialist.description || ''}
              maxLength={120}
              className="text-sm line-clamp-3"
            />
          </div>
          <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
            Xem Chi Tiết
            <ChevronRight className="w-4 h-4 ml-1 group-hover:ml-0 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}
