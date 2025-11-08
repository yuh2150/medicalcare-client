'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Star, MapPin, Phone, Mail } from 'lucide-react';
import { getId } from '@/lib/utils';
import { HTMLContent } from '@/components/ui';
import type { Doctor } from '@/types';

interface DoctorCardProps {
  doctor: Doctor;
  viewMode?: 'grid' | 'list';
}

export function DoctorCard({ doctor, viewMode = 'grid' }: DoctorCardProps) {
  if (viewMode === 'list') {
    return (
      <Link href={`/doctors/${getId(doctor)}`}>
        <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 p-6 m-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-linear-to-br from-blue-100 to-blue-200 ring-4 ring-white shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0">
              {doctor.avatar ? (
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
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-2xl">
                  👨‍⚕️
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-1">
                Dr. {doctor.name}
              </h3>
              
              <p className="text-blue-600 font-medium mb-2">
                {doctor.specialty}
              </p>

              {/* Học hàm, học vị */}
              {(doctor.academicRank || doctor.academicDegree) && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {doctor.academicRank && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {doctor.academicRank}
                    </span>
                  )}
                  {doctor.academicDegree && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      {doctor.academicDegree}
                    </span>
                  )}
                </div>
              )}

              {/* Mô tả ngắn */}
              {(doctor.bio || doctor.description) && (
                <div className="text-gray-600 text-sm mb-2">
                  <HTMLContent 
                    content={doctor.description || doctor.bio || ''}
                    maxLength={400}
                    className="text-sm line-clamp-3"
                  />
                </div>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(doctor.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {doctor.rating || 0} ({doctor.reviewCount || 0} đánh giá)
                </span>
              </div>

              {/* Info */}
              {/* <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {doctor.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{doctor.location}</span>
                  </div>
                )}
                {doctor.experience && (
                  <div className="flex items-center gap-1">
                    <HTMLContent 
                      content={doctor.experience}
                      maxLength={150}
                      className="text-sm line-clamp-2"
                    />
                  </div>
                )}
                {doctor.organizationMember && (
                  <div className="flex items-center gap-1">
                    <span className="text-blue-500 font-medium">{doctor.organizationMember}</span>
                  </div>
                )}
              </div> */}
            </div>

            {/* Action Button */}
            <div className="shrink-0">
              <div className="bg-blue-50 text-blue-600 py-3 px-6 rounded-2xl font-medium group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Đặt Lịch
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/doctors/${getId(doctor)}`}>
      <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100 p-8 text-center">
        <div className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden bg-linear-to-br from-blue-100 to-blue-200 ring-4 ring-white shadow-lg group-hover:scale-110 transition-transform duration-300">
          {doctor.avatar ? (
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
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-2xl">
              👨‍⚕️
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            Dr. {doctor.name}
          </h3>
          <p className="text-blue-600 font-medium">
            {doctor.specialty}
          </p>
          
          {/* Học hàm, học vị */}
          {(doctor.academicRank || doctor.academicDegree) && (
            <div className="flex flex-wrap gap-1 justify-center">
              {doctor.academicRank && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {doctor.academicRank}
                </span>
              )}
              {doctor.academicDegree && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  {doctor.academicDegree}
                </span>
              )}
            </div>
          )}

          {/* Tổ chức */}
          {doctor.organization && (
            <p className="text-xs text-gray-500 truncate" title={doctor.organization}>
              {doctor.organization}
            </p>
          )}
          
          {/* Mô tả ngắn */}
          {(doctor.bio || doctor.description) && (
            <div className="text-gray-600 text-sm">
              <HTMLContent 
                content={doctor.description || doctor.bio || ''}
                maxLength={80}
                className="text-xs line-clamp-2"
              />
            </div>
          )}
          
          {/* Rating */}
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(doctor.rating || 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 font-medium">{doctor.rating || 0}</span>
          </div>

          {/* Kinh nghiệm */}
          {/* {doctor.experience && (
            <div className="text-sm text-gray-600">
              <HTMLContent 
                content={doctor.experience}
                maxLength={100}
                className="text-sm line-clamp-2"
              />
            </div>
          )} */}

          {/* Quá trình đào tạo ngắn */}
          {doctor.trainingProcess && doctor.trainingProcess.length > 0 && (
            <div className="text-xs text-gray-500">
              <HTMLContent 
                content={doctor.trainingProcess[0]}
                maxLength={60}
                className="text-xs line-clamp-1"
              />
            </div>
          )}

          {/* Thành viên tổ chức */}
          {doctor.organizationMember && (
            <p className="text-xs text-blue-500 font-medium truncate" title={doctor.organizationMember}>
              {doctor.organizationMember}
            </p>
          )}

          {/* Location */}
          {doctor.location && (
            <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>{doctor.location}</span>
            </div>
          )}
        </div>

        {/* Book Appointment Button */}
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
