import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Users, Award, HeartHandshake } from 'lucide-react';

// Component Banner Chính với Thiết kế Hiện đại
export function HeroBanner() {
  return (
    <section className="relative bg-linear-to-br from-blue-50 via-white to-blue-50 min-h-[600px] flex items-center overflow-hidden">
      {/* Hoa văn nền */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Nội dung bên trái */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Sức Khỏe Của Bạn,
                <span className="text-blue-600 block">Ưu Tiên Của Chúng Tôi</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                Trải nghiệm dịch vụ chăm sóc sức khỏe đẳng cấp thế giới cùng đội ngũ 
                chuyên gia y tế tận tâm. Hành trình chăm sóc sức khỏe của bạn bắt đầu từ đây.
              </p>
            </div>
            
            {/* Nút hành động */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/appointments/book"
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Đặt Lịch Khám
              </Link>
              <Link 
                href="/about"
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-2xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                Tìm Hiểu Thêm
              </Link>
            </div>

            {/* Thống kê */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">10K+</div>
                <div className="text-sm text-gray-600">Bệnh Nhân Hài Lòng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">50+</div>
                <div className="text-sm text-gray-600">Bác Sĩ Chuyên Khoa</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">24/7</div>
                <div className="text-sm text-gray-600">Hỗ Trợ</div>
              </div>
            </div>
          </div>

          {/* Hình ảnh bên phải */}
          <div className="relative">
            <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/doctor.png"
                alt="Chuyên gia Y tế"
                fill
                className="object-cover"
                priority
              />
              {/* Thẻ nổi */}
              <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <HeartHandshake className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Chăm sóc 24/7</div>
                    <div className="text-sm text-gray-600">Luôn ở đây vì bạn</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
