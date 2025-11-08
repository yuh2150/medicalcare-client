'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, Users, Heart } from 'lucide-react';
import { Section, Container, Breadcrumb } from '@/components/ui/Layout';
import { LoadingSpinner } from '@/components/ui';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const breadcrumbItems = [
    { label: 'Trang Chủ', href: '/' },
    { label: 'Liên Hệ', href: '#' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitMessage('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitMessage('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Section background="white" padding="lg">
        <Container>
          <Breadcrumb items={breadcrumbItems} className="mb-6" />
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Liên Hệ Với Chúng Tôi</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các kênh dưới đây.
            </p>
          </div>
        </Container>
      </Section>

      {/* Contact Info Cards */}
      <Section padding="lg">
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Phone */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Điện Thoại</h3>
              <p className="text-gray-600 mb-3">Gọi cho chúng tôi</p>
              <div className="space-y-1">
                <p className="text-blue-600 font-semibold">1900 123 456</p>
                <p className="text-gray-500 text-sm">24/7 - Khẩn cấp</p>
                <p className="text-blue-600">0123 456 789</p>
                <p className="text-gray-500 text-sm">8:00 - 17:00</p>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 mb-3">Gửi email cho chúng tôi</p>
              <div className="space-y-1">
                <p className="text-green-600 font-semibold">info@medicalcare.vn</p>
                <p className="text-gray-500 text-sm">Thông tin chung</p>
                <p className="text-green-600">support@medicalcare.vn</p>
                <p className="text-gray-500 text-sm">Hỗ trợ kỹ thuật</p>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Địa Chỉ</h3>
              <p className="text-gray-600 mb-3">Đến thăm chúng tôi</p>
              <div className="space-y-1">
                <p className="text-purple-600 font-semibold">123 Đường ABC</p>
                <p className="text-gray-500 text-sm">Quận 1, TP. Hồ Chí Minh</p>
                <p className="text-purple-600">456 Đường XYZ</p>
                <p className="text-gray-500 text-sm">Quận Ba Đình, Hà Nội</p>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Giờ Làm Việc</h3>
              <p className="text-gray-600 mb-3">Thời gian phục vụ</p>
              <div className="space-y-1">
                <p className="text-orange-600 font-semibold">Thứ 2 - Thứ 6</p>
                <p className="text-gray-500 text-sm">8:00 - 17:00</p>
                <p className="text-orange-600">Thứ 7 - Chủ Nhật</p>
                <p className="text-gray-500 text-sm">8:00 - 12:00</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Contact Form & Map */}
      <Section padding="xl">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Gửi Tin Nhắn</h2>
                  <p className="text-gray-600">
                    Điền thông tin vào form dưới đây và chúng tôi sẽ liên hệ lại với bạn sớm nhất.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập địa chỉ email"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Chủ đề *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Chọn chủ đề</option>
                      <option value="consultation">Tư vấn khám bệnh</option>
                      <option value="appointment">Đặt lịch hẹn</option>
                      <option value="service">Dịch vụ y tế</option>
                      <option value="complaint">Khiếu nại</option>
                      <option value="partnership">Hợp tác</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Nội dung tin nhắn *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Nhập nội dung tin nhắn..."
                    />
                  </div>

                  {submitMessage && (
                    <div className={`p-4 rounded-2xl ${
                      submitMessage.includes('Cảm ơn') 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {submitMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Gửi Tin Nhắn
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Map & Additional Info */}
            <div>
              {/* Map */}
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Vị Trí Của Chúng Tôi</h3>
                <div className="bg-gray-200 rounded-2xl h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p>Bản đồ Google Maps</p>
                    <p className="text-sm">(Tích hợp sau)</p>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Câu Hỏi Thường Gặp</h3>
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Làm thế nào để đặt lịch khám?</h4>
                    <p className="text-gray-600 text-sm">
                      Bạn có thể đặt lịch khám online qua website hoặc gọi điện thoại đến hotline của chúng tôi.
                    </p>
                  </div>
                  <div className="border-b border-gray-100 pb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Có dịch vụ khám tại nhà không?</h4>
                    <p className="text-gray-600 text-sm">
                      Có, chúng tôi cung cấp dịch vụ khám và chăm sóc tại nhà cho các trường hợp đặc biệt.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Thời gian chờ đợi là bao lâu?</h4>
                    <p className="text-gray-600 text-sm">
                      Thông thường thời gian chờ đợi từ 15-30 phút tùy thuộc vào tình trạng bận rộn.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section background="blue" padding="xl">
        <Container>
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Cần Hỗ Trợ Khẩn Cấp?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Đội ngũ y bác sĩ của chúng tôi sẵn sàng hỗ trợ bạn 24/7 trong các trường hợp khẩn cấp.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:1900123456"
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Gọi Ngay: 1900 123 456
              </a>
              <a
                href="/appointments/book"
                className="border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Đặt Lịch Khám
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
