'use client';

import { useEffect, useState } from 'react';
import { 
  HeroBanner,
  SearchSection,
  FeaturedServices,
  AboutSection,
  PatientTestimonials
} from '.';
import { 
  FeaturedList, 
  SpecialistCard, 
  DoctorCard, 
  NewsCard
} from '../medical';
import { LoadingSpinner, SkeletonCard, ErrorMessage } from '../ui';
import { homeApi } from '@/services/api';
import type { HomePageData } from '@/types';

export function HomeContent() {
  const [data, setData] = useState<HomePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await homeApi.getHomeData();
        setData(result);
      } catch (err) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        console.error('Lỗi tải dữ liệu trang chủ:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Khung hero */}
        <div className="h-[600px] bg-linear-to-br from-blue-50 via-white to-blue-50 animate-pulse">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="space-y-6">
              <div className="h-16 bg-gray-200 rounded-lg w-96"></div>
              <div className="h-6 bg-gray-200 rounded w-80"></div>
              <div className="h-12 bg-gray-200 rounded-2xl w-48"></div>
            </div>
          </div>
        </div>
        
        {/* Khung tìm kiếm */}
        <div className="h-64 bg-white"></div>
        
        {/* Khung nội dung */}
        <FeaturedList title="Dịch Vụ Y Tế">
          {Array.from({ length: 4 }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </FeaturedList>
        
        <FeaturedList title="Chuyên Khoa Nổi Bật" background="white">
          {Array.from({ length: 3 }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </FeaturedList>
        
        <FeaturedList title="Đội Ngũ Bác Sĩ Chuyên Khoa">
          {Array.from({ length: 3 }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </FeaturedList>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Vẫn hiển thị hero và các section tĩnh khi có lỗi dữ liệu */}
        <HeroBanner />
        <SearchSection />
        <FeaturedServices />
        <AboutSection />
        
        {/* Thông báo lỗi cho nội dung động */}
        <div className="py-20 flex items-center justify-center">
          <ErrorMessage message={error} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Section Hero */}
      <HeroBanner />
      
      {/* Section Tìm kiếm */}
      <SearchSection />
      
      {/* Dịch vụ nổi bật */}
      <FeaturedServices />
      
      {/* Section Giới thiệu */}
      <AboutSection />
      
      {/* Chuyên khoa nổi bật */}
      <FeaturedList 
        title="Chuyên Khoa Nổi Bật" 
        subtitle="Các chuyên khoa y tế toàn diện với sự chăm sóc chuyên nghiệp"
        background="white"
      >
        {data && data.featuredSpecialists.length > 0 ? (
          data.featuredSpecialists.map((specialist) => (
            <SpecialistCard key={specialist.id} specialist={specialist} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-2">Chưa Có Chuyên Khoa Nổi Bật</h3>
              <p>Chúng tôi đang nỗ lực bổ sung thêm các khoa chuyên môn cho bạn.</p>
            </div>
          </div>
        )}
      </FeaturedList>
      
      {/* Bác sĩ nổi bật */}
      <FeaturedList 
        title="Gặp Gỡ Đội Ngũ Bác Sĩ Chuyên Khoa" 
        subtitle="Các chuyên gia y tế giàu kinh nghiệm tận tâm vì sức khỏe của bạn"
      >
        {data && data.featuredDoctors.length > 0 ? (
          data.featuredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-2">Chưa Có Bác Sĩ Nổi Bật</h3>
              <p>Hồ sơ đội ngũ bác sĩ sẽ sớm được cập nhật.</p>
            </div>
          </div>
        )}
      </FeaturedList>
      
      {/* Cảm nhận bệnh nhân */}
      <PatientTestimonials />
      
      {/* Blog sức khỏe / Tin tức */}
      <FeaturedList 
        title="Mẹo Sức Khỏe & Tin Tức" 
        subtitle="Cập nhật những hiểu biết mới nhất về chăm sóc sức khỏe và lời khuyên về sức khỏe"
        background="white"
      >
        {data && data.latestNews.length > 0 ? (
          data.latestNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-2">Chưa Có Bài Viết Mới</h3>
              <p>Hãy quay lại sớm để xem tin tức sức khỏe và mẹo chăm sóc sức khỏe mới nhất.</p>
            </div>
          </div>
        )}
      </FeaturedList>
    </div>
  );
}
