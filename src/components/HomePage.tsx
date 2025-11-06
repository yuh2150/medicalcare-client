import Link from 'next/link';
import Image from 'next/image';
import type { Specialist, Doctor, News } from '@/types';

// Hero Banner Component
export function HeroBanner() {
  return (
    <section className="relative h-[500px] bg-linear-to-r from-blue-600 to-blue-800 text-white">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Sức khỏe của bạn là ưu tiên của chúng tôi
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Khám chuyên khoa, đặt lịch bác sĩ, mua thuốc và đọc tin sức khỏe mới nhất tại Medical Care.
          </p>
          <Link 
            href="/appointments/book"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
          >
            Đặt lịch ngay
          </Link>
        </div>
      </div>
    </section>
  );
}

// Search Bar Component
export function SearchBar() {
  return (
    <section className="bg-white py-8 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Tìm bác sĩ hoặc chuyên khoa..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Featured List Wrapper
interface FeaturedListProps {
  title: string;
  children: React.ReactNode;
}

export function FeaturedList({ title, children }: FeaturedListProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children}
        </div>
      </div>
    </section>
  );
}

// Specialist Card Component
interface SpecialistCardProps {
  specialist: Specialist;
}

export function SpecialistCard({ specialist }: SpecialistCardProps) {
  return (
    <Link href={`/specialists/${specialist.slug}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer card-hover">
        <div className="relative h-40 mb-4 bg-gray-200 rounded-lg overflow-hidden">
          <Image
            src={specialist.thumbnail}
            alt={specialist.name}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder-specialist.png';
            }}
          />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {specialist.name}
        </h3>
        <p className="text-gray-600">
          {specialist.shortDesc}
        </p>
      </div>
    </Link>
  );
}

// Doctor Card Component
interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Link href={`/doctors/${doctor.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer card-hover">
        <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
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
        <h3 className="text-xl font-semibold text-gray-900 mb-1 text-center">
          {doctor.name}
        </h3>
        <p className="text-blue-600 mb-2 text-center">
          {doctor.specialty}
        </p>
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 text-gray-600">{doctor.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// News Card Component
interface NewsCardProps {
  news: News;
}

export function NewsCard({ news }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Link href={`/news/${news.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer card-hover">
        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
          {news.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {news.excerpt}
        </p>
        <p className="text-sm text-gray-500">
          {formatDate(news.publishedAt)}
        </p>
      </div>
    </Link>
  );
}
