'use client';

import { useEffect, useState } from 'react';
import { 
  FeaturedList, 
  SpecialistCard, 
  DoctorCard, 
  NewsCard 
} from './HomePage';
import { LoadingSpinner, SkeletonCard, ErrorMessage } from './UI';
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
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Loading skeletons */}
        <FeaturedList title="Chuyên khoa nổi bật">
          {Array.from({ length: 3 }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </FeaturedList>
        
        <div className="bg-white">
          <FeaturedList title="Bác sĩ nổi bật">
            {Array.from({ length: 3 }, (_, i) => (
              <SkeletonCard key={i} />
            ))}
          </FeaturedList>
        </div>
        
        <FeaturedList title="Tin tức sức khỏe mới nhất">
          {Array.from({ length: 3 }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </FeaturedList>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      {/* Featured Specialists */}
      <FeaturedList title="Chuyên khoa nổi bật">
        {data.featuredSpecialists.length > 0 ? (
          data.featuredSpecialists.map((specialist) => (
            <SpecialistCard key={specialist.id} specialist={specialist} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-8">
            Chưa có chuyên khoa nổi bật
          </div>
        )}
      </FeaturedList>
      
      {/* Featured Doctors */}
      <div className="bg-white">
        <FeaturedList title="Bác sĩ nổi bật">
          {data.featuredDoctors.length > 0 ? (
            data.featuredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-8">
              Chưa có bác sĩ nổi bật
            </div>
          )}
        </FeaturedList>
      </div>
      
      {/* Latest News */}
      <FeaturedList title="Tin tức sức khỏe mới nhất">
        {data.latestNews.length > 0 ? (
          data.latestNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-8">
            Chưa có tin tức mới
          </div>
        )}
      </FeaturedList>
    </>
  );
}
