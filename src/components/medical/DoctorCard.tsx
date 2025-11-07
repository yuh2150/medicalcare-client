import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Star } from 'lucide-react';
import type { Doctor } from '@/types';

// Component Thẻ Bác sĩ
interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Link href={`/doctors/${doctor.id}`}>
      <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100 p-8 text-center">
        <div className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden bg-linear-to-br from-blue-100 to-blue-200 ring-4 ring-white shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Image
            src={doctor.avatar}
            alt={doctor.name}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder-doctor.png';
            }}
          />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            Dr. {doctor.name}
          </h3>
          <p className="text-blue-600 font-medium">
            {doctor.specialty}
          </p>
          
          {/* Rating */}
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(doctor.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 font-medium">{doctor.rating}</span>
          </div>

          {/* Kinh nghiệm */}
          {doctor.experience && (
            <p className="text-sm text-gray-600">
              {doctor.experience} năm kinh nghiệm
            </p>
          )}
        </div>

        {/* Nút Đặt lịch khám */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="bg-blue-50 text-blue-600 py-3 px-6 rounded-2xl font-medium group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            Đặt Lịch Khám
          </div>
        </div>
      </div>
    </Link>
  );
}
