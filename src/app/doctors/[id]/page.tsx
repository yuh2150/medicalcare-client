import { DoctorDetailPage } from '@/components/doctors';

interface DoctorDetailProps {
  params: {
    id: string;
  };
}

export default async function DoctorDetail({ params }: DoctorDetailProps) {
//   if (!params.id) {
//     notFound();
//   }
  const { id } = await params;
  return <DoctorDetailPage doctorId={id} />;
}

export const metadata = {
  title: 'Chi Tiết Bác Sĩ - Medical Care',
  description: 'Thông tin chi tiết và đặt lịch khám với bác sĩ chuyên khoa',
};
