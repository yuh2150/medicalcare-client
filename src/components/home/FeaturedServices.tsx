import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// Section Dịch vụ Nổi bật
export function FeaturedServices() {
  const services = [
    {
      id: 1,
      name: 'Khám Tổng Quát',
      description: 'Tầm soát sức khỏe toàn diện và chăm sóc dự phòng',
      icon: '🩺',
      color: 'from-blue-500 to-blue-600',
      link: '/services/general-checkup'
    },
    {
      id: 2,
      name: 'Nhi Khoa',
      description: 'Chăm sóc chuyên biệt cho trẻ em và thanh thiếu niên',
      icon: '👶',
      color: 'from-green-500 to-green-600',
      link: '/services/pediatrics'
    },
    {
      id: 3,
      name: 'Tim Mạch',
      description: 'Chuyên gia về tim và hệ thống tim mạch',
      icon: '❤️',
      color: 'from-red-500 to-red-600',
      link: '/services/cardiology'
    },
    {
      id: 4,
      name: 'Cấp Cứu',
      description: 'Dịch vụ y tế cấp cứu và chăm sóc khẩn cấp 24/7',
      icon: '🚨',
      color: 'from-orange-500 to-orange-600',
      link: '/services/emergency'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Dịch Vụ Y Tế Của Chúng Tôi</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dịch vụ chăm sóc sức khỏe toàn diện được cung cấp bởi đội ngũ chuyên gia y tế
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <Link key={service.id} href={service.link}>
              <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100">
                <div className={`w-16 h-16 bg-linear-${service.color} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {service.name}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-6 flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                  Tìm Hiểu Thêm
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:ml-0 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
