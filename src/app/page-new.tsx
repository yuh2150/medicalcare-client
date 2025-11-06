import { 
  HeroBanner, 
  SearchBar, 
  FeaturedList, 
  SpecialistCard, 
  DoctorCard, 
  NewsCard 
} from '../components/HomePage';
import type { HomePageData } from '../types';

// SEO Metadata
export const metadata = {
  title: 'Medical Care – Sức khỏe của bạn là ưu tiên của chúng tôi',
  description: 'Khám chuyên khoa, đặt lịch bác sĩ, mua thuốc và đọc tin sức khỏe mới nhất tại Medical Care.',
  openGraph: {
    title: 'Medical Care – Sức khỏe của bạn là ưu tiên của chúng tôi',
    description: 'Khám chuyên khoa, đặt lịch bác sĩ, mua thuốc và đọc tin sức khỏe mới nhất tại Medical Care.',
    images: ['/images/og-home.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Medical Care – Sức khỏe của bạn là ưu tiên của chúng tôi',
    description: 'Khám chuyên khoa, đặt lịch bác sĩ, mua thuốc và đọc tin sức khỏe mới nhất tại Medical Care.',
    images: ['/images/og-home.jpg'],
  },
};

// Fetch data from API
async function getHomeData(): Promise<HomePageData> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/home`, {
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch home data');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching home data:', error);
    // Return empty data as fallback
    return {
      featuredSpecialists: [],
      featuredDoctors: [],
      latestNews: []
    };
  }
}

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <HeroBanner />
      
      {/* Search Bar */}
      <SearchBar />
      
      {/* Featured Specialists */}
      <FeaturedList title="Chuyên khoa nổi bật">
        {data.featuredSpecialists.map((specialist) => (
          <SpecialistCard key={specialist.id} specialist={specialist} />
        ))}
      </FeaturedList>
      
      {/* Featured Doctors */}
      <div className="bg-white">
        <FeaturedList title="Bác sĩ nổi bật">
          {data.featuredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </FeaturedList>
      </div>
      
      {/* Latest News */}
      <FeaturedList title="Tin tức sức khỏe mới nhất">
        {data.latestNews.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </FeaturedList>
    </div>
  );
}
