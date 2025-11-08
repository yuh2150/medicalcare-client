import Link from 'next/link';
import { Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">W</span>
                </div>
                <div>
                  <div className="text-2xl font-bold">WebMedical</div>
                  <div className="text-sm text-blue-400">Đối Tác Sức Khỏe Của Bạn</div>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Cung cấp dịch vụ chăm sóc sức khỏe đặc biệt với lòng trắc ẩn, sự đổi mới và xuất sắc. 
                Sức khỏe và hạnh phúc của bạn là ưu tiên hàng đầu của chúng tôi.
              </p>
              
              {/* Thông tin liên hệ */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">Cấp cứu: +84 (028) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">123 Đường Trung Tâm Y Tế, TP. Hồ Chí Minh</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4 mt-6">
                {[
                  { name: 'Facebook', icon: 'M18.77 7.46H15.5v-1.9c0-.9.6-1.1 1-1.1h2.17V1.26h-3.17C12.33 1.26 10 3.59 10 6.76v.7H7.5v3.2H10V22h4.5v-10.34h2.83l.44-3.2z' },
                  { name: 'Twitter', icon: 'M23.32 4.56c-.8.35-1.66.59-2.56.69.92-.55 1.63-1.43 1.96-2.47-.86.51-1.81.88-2.83 1.08-.81-.86-1.97-1.4-3.25-1.4-2.46 0-4.46 1.99-4.46 4.44 0 .35.04.69.11 1.02C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.54.78 2.9 1.97 3.69-.73-.02-1.41-.22-2.01-.55v.06c0 2.15 1.53 3.95 3.56 4.37-.37.1-.76.15-1.16.15-.28 0-.56-.03-.83-.08.56 1.75 2.18 3.02 4.1 3.06-1.51 1.18-3.41 1.88-5.48 1.88-.36 0-.71-.02-1.05-.06 1.95 1.25 4.27 1.98 6.76 1.98 8.11 0 12.54-6.72 12.54-12.54 0-.19 0-.37-.01-.56.86-.62 1.61-1.4 2.2-2.28z' },
                  { name: 'LinkedIn', icon: 'M20.94 3H3.06A1.1 1.1 0 0 0 2 4.06v15.88C2 20.5 2.5 21 3.06 21h17.88c.56 0 1.06-.5 1.06-1.06V4.06C22 3.5 21.5 3 20.94 3zM8.09 18.74H5.09V9.43h3v9.31zM6.59 8.09c-.96 0-1.74-.78-1.74-1.74s.78-1.74 1.74-1.74 1.74.78 1.74 1.74-.78 1.74-1.74 1.74zm12.15 10.65h-3V14.19c0-1.12-.02-2.56-1.56-2.56-1.56 0-1.8 1.22-1.8 2.48v4.63h-3V9.43h2.88v1.28h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v5z' }
                ].map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all duration-300 group"
                  >
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            
            {/* Liên kết nhanh */}
            <div>
              <h3 className="text-lg font-bold mb-6">Liên Kết Nhanh</h3>
              <ul className="space-y-3">
                {[
                  { name: 'Về Chúng Tôi', href: '/about' },
                  { name: 'Dịch Vụ', href: '/services' },
                  { name: 'Tìm Bác Sĩ', href: '/doctors' },
                  { name: 'Đặt Lịch Khám', href: '/appointments/book' },
                  { name: 'Cổng Bệnh Nhân', href: '/portal' },
                  { name: 'Blog Sức Khỏe', href: '/blog' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Dịch vụ */}
            <div>
              <h3 className="text-lg font-bold mb-6">Dịch Vụ Y Tế</h3>
              <ul className="space-y-3">
                {[
                  'Cấp Cứu',
                  'Khám Tổng Quát',
                  'Tim Mạch',
                  'Nhi Khoa',
                  'Phẫu Thuật',
                  'Chẩn Đoán Hình Ảnh',
                  'Xét Nghiệm',
                  'Nhà Thuốc'
                ].map((service) => (
                  <li key={service}>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {service}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Thanh cuối */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © 2025 WebMedical. Tất cả quyền được bảo lưu.
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Chính Sách Bảo Mật
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Điều Khoản Dịch Vụ
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Chính Sách Cookie
              </Link>
              <Link href="/accessibility" className="text-gray-400 hover:text-white transition-colors">
                Khả Năng Tiếp Cận
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
