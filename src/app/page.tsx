import { HomeContent } from '@/components/home';

// SEO Metadata cho WebMedical
export const metadata = {
  title: 'WebMedical – Sức Khỏe Của Bạn, Ưu Tiên Của Chúng Tôi',
  description: 'Trải nghiệm dịch vụ chăm sóc sức khỏe đẳng cấp thế giới với đội ngũ chuyên gia y tế tận tâm. Đặt lịch khám, tìm bác sĩ chuyên khoa và tiếp cận các dịch vụ y tế toàn diện.',
  keywords: 'chăm sóc y tế, sức khỏe, bác sĩ, chuyên khoa, đặt lịch khám, bệnh viện, phòng khám, dịch vụ y tế',
  openGraph: {
    title: 'WebMedical – Sức Khỏe Của Bạn, Ưu Tiên Của Chúng Tôi',
    description: 'Trải nghiệm dịch vụ chăm sóc sức khỏe đẳng cấp thế giới với đội ngũ chuyên gia y tế tận tâm.',
    images: ['/images/og-webmedical.jpg'],
    type: 'website',
    locale: 'vi_VN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WebMedical – Sức Khỏe Của Bạn, Ưu Tiên Của Chúng Tôi',
    description: 'Trải nghiệm dịch vụ chăm sóc sức khỏe đẳng cấp thế giới với đội ngũ chuyên gia y tế tận tâm.',
    images: ['/images/og-webmedical.jpg'],
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
    <main className="min-h-screen">
      {/* All sections are now handled in HomeContent component */}
      <HomeContent />
    </main>
  );
}
