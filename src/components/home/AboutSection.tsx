import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Award } from 'lucide-react';

// Section Giới thiệu
export function AboutSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Nội dung */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                Về WebMedical
              </div>
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                Dịch Vụ Y Tế Đáng Tin Cậy Cho Gia Đình Bạn
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Với hơn 20 năm kinh nghiệm, WebMedical đã cung cấp các dịch vụ chăm sóc sức khỏe 
                đặc biệt cho các gia đình trong khu vực. Cam kết của chúng tôi về sự xuất sắc 
                và chăm sóc lấy bệnh nhân làm trung tâm là điều tạo nên sự khác biệt.
              </p>
            </div>

            {/* Tính năng */}
            <div className="space-y-4">
              {[
                'Trang thiết bị y tế hiện đại',
                'Đội ngũ chuyên gia y tế có trình độ cao',
                'Đa dạng chuyên khoa toàn diện',
                'Dịch vụ cấp cứu 24/7'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <Link 
              href="/about"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Tìm Hiểu Thêm Về Chúng Tôi
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Hình ảnh */}
          <div className="relative">
            <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hospital-building.png"
                alt="Bệnh viện WebMedical"
                fill
                className="object-cover"
              />
            </div>
            {/* Thẻ thống kê */}
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">20+</div>
                  <div className="text-sm text-gray-600">Năm Kinh Nghiệm Xuất Sắc</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
