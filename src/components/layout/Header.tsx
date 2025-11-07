'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Phone, MapPin } from 'lucide-react';
import { AuthNavigation } from '../auth';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Trang Chủ', href: '/' },
    { name: 'Chuyên khoa', href: '/specialists' },
    { name: 'Bác Sĩ', href: '/doctors' },
    { name: 'Đặt Lịch', href: '/appointments' },
    { name: 'Về Chúng Tôi', href: '/about' },
    { name: 'Liên Hệ', href: '/contact' }
  ];

  return (
    <>
      {/* Thanh trên */}
      <div className="bg-blue-600 text-white py-2 text-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>Cấp cứu: +84 (028) 123-4567</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>123 Đường Trung Tâm Y Tế, TP. HCM</span>
              </div>
            </div>
            <div className="hidden md:block text-sm">
              Mở cửa 24/7 cho Cấp cứu
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-2xl font-bold text-gray-900">WebMedical</div>
                <div className="text-xs text-blue-600 font-medium -mt-1">Đối Tác Sức Khỏe Của Bạn</div>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group py-2"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>
            
            {/* Desktop Auth + CTA */}
            <div className="hidden lg:flex items-center space-x-4">
              <AuthNavigation />
              <Link
                href="/appointments/book"
                className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Đặt Lịch Ngay
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="container mx-auto px-4 py-6">
              <nav className="space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="pt-6 border-t border-gray-200 mt-6">
                <AuthNavigation />
                <Link
                  href="/appointments/book"
                  className="block bg-blue-600 text-white text-center px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-all duration-300 mt-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Đặt Lịch Khám
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
