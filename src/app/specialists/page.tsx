import { SpecialistsPage } from '@/components/specialists';

export const metadata = {
  title: 'Chuyên Khoa Y Tế - WebMedical',
  description: 'Khám phá các chuyên khoa y tế toàn diện với đội ngũ bác sĩ chuyên gia giàu kinh nghiệm tại WebMedical.',
  keywords: 'chuyên khoa, bác sĩ chuyên khoa, y tế, WebMedical, khám bệnh, điều trị',
  openGraph: {
    title: 'Chuyên Khoa Y Tế - WebMedical',
    description: 'Khám phá các chuyên khoa y tế toàn diện với đội ngũ bác sĩ chuyên gia giàu kinh nghiệm.',
    type: 'website',
    locale: 'vi_VN',
  },
};

export default function SpecialistsListPage() {
  return <SpecialistsPage />;
}
