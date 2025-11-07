import { SpecialistDetailPage } from '@/components/specialists';

interface SpecialistDetailPageProps {
  params: {
    id: string;
  };
}

export const metadata = {
  title: 'Chi Tiết Chuyên Khoa - WebMedical',
  description: 'Thông tin chi tiết về chuyên khoa và đội ngũ bác sĩ chuyên gia tại WebMedical.',
};

export default function SpecialistDetail({ params }: SpecialistDetailPageProps) {
  return <SpecialistDetailPage specialistId={params.id} />;
}
