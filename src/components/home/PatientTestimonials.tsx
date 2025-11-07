"use client";
import { useState } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

// Section Cảm nhận Bệnh nhân
export function PatientTestimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      name: 'Nguyễn Thị Hoa',
      condition: 'Bệnh nhân Tim mạch',
      content: 'Sự chăm sóc tôi nhận được tại WebMedical thật đặc biệt. Các bác sĩ rất chu đáo, tận tình và giải thích mọi thứ một cách rõ ràng. Tôi cảm thấy được quan tâm thực sự.',
      rating: 5,
      avatar: '/images/doctor.png'
    },
    {
      id: 2,
      name: 'Trần Văn Nam',
      condition: 'Cấp cứu',
      content: 'Thời gian phản hồi nhanh và đội ngũ chuyên nghiệp. Họ xử lý tình huống cấp cứu của tôi một cách chuyên nghiệp và đảm bảo tôi thoải mái trong suốt quá trình.',
      rating: 5,
      avatar: '/images/doctor.png'
    },
    {
      id: 3,
      name: 'Lê Thị Mai',
      condition: 'Nhi khoa',
      content: 'Đưa con em đến đây khiến tôi yên tâm. Đội ngũ nhi khoa rất tuyệt vời với trẻ em và tạo ra một môi trường thân thiện.',
      rating: 5,
      avatar: '/images/doctor.png'
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-linear-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Bệnh Nhân Nói Gì Về Chúng Tôi</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Những câu chuyện thật từ các bệnh nhân tin tưởng chúng tôi với sức khỏe của họ
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Thẻ cảm nhận */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
            <div className="text-center mb-8">
              {/* Sao đánh giá */}
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              
              {/* Trích dẫn */}
              <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 italic">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              
              {/* Thông tin bệnh nhân */}
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-linear-to-br from-blue-100 to-blue-200">
                  <Image
                    src={testimonials[currentTestimonial].avatar}
                    alt={testimonials[currentTestimonial].name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-lg">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-blue-600">
                    {testimonials[currentTestimonial].condition}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Điều hướng */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 text-gray-600 hover:text-blue-600"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 text-gray-600 hover:text-blue-600"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Chỉ báo chấm tròn */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? 'bg-blue-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
