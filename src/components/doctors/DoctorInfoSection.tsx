'use client';

import { Mail, Phone, MapPin, Award, GraduationCap, Briefcase, User, Building } from 'lucide-react';
import { HTMLContent } from '@/components/ui';
import type { Doctor } from '@/types';

interface DoctorInfoSectionProps {
  doctor: Doctor;
}

export function DoctorInfoSection({ doctor }: DoctorInfoSectionProps) {
  return (
    <div className="space-y-8">
      {/* Main Info */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600" />
          Thông Tin Cơ Bản
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Họ và tên</label>
              <p className="text-lg font-semibold text-gray-900">Dr. {doctor.name}</p>
            </div>
            
            {doctor.email && (
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <a 
                    href={`mailto:${doctor.email}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {doctor.email}
                  </a>
                </div>
              </div>
            )}

            {doctor.phone && (
              <div>
                <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <a 
                    href={`tel:${doctor.phone}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {doctor.phone}
                  </a>
                </div>
              </div>
            )}

            {doctor.specialty && (
              <div>
                <label className="text-sm font-medium text-gray-500">Chuyên khoa</label>
                <p className="text-gray-900 font-medium">{doctor.specialty}</p>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {doctor.experience && (
              <div>
                <label className="text-sm font-medium text-gray-500">Kinh nghiệm</label>
                <div className="flex items-center gap-2 mt-1">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <div className="text-gray-900 flex-1">
                    {doctor.experience && (
                      <HTMLContent content={doctor.experience} />
                    )}
                  </div>
                </div>
              </div>
            )}

            {doctor.organization && (
              <div>
                <label className="text-sm font-medium text-gray-500">Tổ chức công tác</label>
                <div className="flex items-center gap-2 mt-1">
                  <Building className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-900">{doctor.organization}</span>
                </div>
              </div>
            )}

            {doctor.organizationMember && (
              <div>
                <label className="text-sm font-medium text-gray-500">Thành viên tổ chức</label>
                <p className="text-gray-900">{doctor.organizationMember}</p>
              </div>
            )}

            {(doctor.location) && (
              <div>
                <label className="text-sm font-medium text-gray-500">Địa điểm khám</label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-900">{doctor.location}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Academic credentials */}
        {(doctor.academicRank || doctor.academicDegree) && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <label className="text-sm font-medium text-gray-500 block mb-3">Học hàm, học vị</label>
            <div className="flex flex-wrap gap-2">
              {doctor.academicRank && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  {doctor.academicRank}
                </span>
              )}
              {doctor.academicDegree && (
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                  {doctor.academicDegree}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* About/Description */}
      {(doctor.bio || doctor.description) && (
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-6 h-6 text-blue-600" />
            Giới Thiệu
          </h2>
          <div className="text-gray-600 leading-relaxed max-w-none">
            <HTMLContent content={doctor.description || ''} />
          </div>
        </div>
      )}

      {/* Training Process */}
      {doctor.trainingProcess && doctor.trainingProcess.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            Quá Trình Đào Tạo
          </h2>
          <ul className="space-y-3">
            {doctor.trainingProcess.map((training, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                <div className="text-gray-600 leading-relaxed flex-1">
                  <HTMLContent content={training} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Education */}
      {doctor.education && doctor.education.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            Học Vấn
          </h2>
          <ul className="space-y-2">
            {doctor.education.map((edu, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                <div className="text-gray-600 flex-1">
                  <HTMLContent content={edu} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Qualifications */}
      {doctor.qualifications && doctor.qualifications.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-blue-600" />
            Chứng Chỉ & Chuyên Môn
          </h2>
          <ul className="space-y-2">
            {doctor.qualifications.map((qual, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                <div className="text-gray-600 flex-1">
                  <HTMLContent content={qual} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Additional Professional Info */}
      {(doctor.organizationMember || doctor.organization) && (
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Building className="w-6 h-6 text-blue-600" />
            Thông Tin Nghề Nghiệp
          </h2>
          <div className="space-y-4">
            {doctor.organization && (
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">Tổ chức công tác</label>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <HTMLContent content={doctor.organization} className="text-gray-700" />
                </div>
              </div>
            )}
            {doctor.organizationMember && (
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">Chức vụ / Thành viên</label>
                <div className="bg-green-50 p-3 rounded-lg">
                  <HTMLContent content={doctor.organizationMember} className="text-gray-700" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
