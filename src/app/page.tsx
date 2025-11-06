import { HeroBanner, SearchBar } from '@/components/HomePage';
import { HomeContent } from '@/components/HomeContent';

// SEO Metadata
export const metadata = {
  title: 'Medical Care – Sức khỏe của bạn là ưu tiên của chúng tôi',
  description: 'Khám chuyên khoa, đặt lịch bác sĩ, mua thuốc và đọc tin sức khỏe mới nhất tại Medical Care.',
  keywords: 'bác sĩ, chuyên khoa, khám bệnh, sức khỏe, y tế, đặt lịch khám',
  openGraph: {
    title: 'Medical Care – Sức khỏe của bạn là ưu tiên của chúng tôi',
    description: 'Khám chuyên khoa, đặt lịch bác sĩ, mua thuốc và đọc tin sức khỏe mới nhất tại Medical Care.',
    images: ['/images/og-home.jpg'],
    type: 'website',
    locale: 'vi_VN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Medical Care – Sức khỏe của bạn là ưu tiên của chúng tôi',
    description: 'Khám chuyên khoa, đặt lịch bác sĩ, mua thuốc và đọc tin sức khỏe mới nhất tại Medical Care.',
    images: ['/images/og-home.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner - Static content for better initial load */}
      <HeroBanner />
      
      {/* Search Bar - Static content */}
      <SearchBar />
      
      {/* Dynamic content with loading states */}
      <HomeContent />
    </div>
  );
}
