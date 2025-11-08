'use client';

import { Users, Award, Heart, Shield, Clock, MapPin, Star, CheckCircle } from 'lucide-react';
import { Section, Container, Breadcrumb } from '@/components/ui/Layout';

export function AboutPage() {
  const breadcrumbItems = [
    { label: 'Trang Chủ', href: '/' },
    { label: 'Về Chúng Tôi', href: '#' }
  ];

  const stats = [
    { icon: Users, number: '50,000+', label: 'Bệnh nhân đã khám' },
    { icon: Award, number: '15+', label: 'Năm kinh nghiệm' },
    { icon: Heart, number: '100+', label: 'Bác sĩ chuyên khoa' },
    { icon: Shield, number: '24/7', label: 'Hỗ trợ khẩn cấp' }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Tận tâm chăm sóc',
      description: 'Chúng tôi đặt sức khỏe và sự hài lòng của bệnh nhân lên hàng đầu trong mọi hoạt động.'
    },
    {
      icon: Shield,
      title: 'An toàn tuyệt đối',
      description: 'Áp dụng các tiêu chuẩn y tế quốc tế nghiêm ngặt để đảm bảo an toàn cho bệnh nhân.'
    },
    {
      icon: Award,
      title: 'Chất lượng hàng đầu',
      description: 'Không ngừng nâng cao chất lượng dịch vụ và đầu tư vào công nghệ y tế tiên tiến.'
    },
    {
      icon: Users,
      title: 'Đội ngũ chuyên nghiệp',
      description: 'Bác sĩ và nhân viên y tế được đào tạo bài bản, giàu kinh nghiệm và tận tụy.'
    }
  ];

  const milestones = [
    { year: '2008', title: 'Thành lập', description: 'Ra đời với sứ mệnh mang lại dịch vụ y tế chất lượng cao' },
    { year: '2012', title: 'Mở rộng', description: 'Khai trương cơ sở thứ 2 và bổ sung nhiều chuyên khoa mới' },
    { year: '2016', title: 'Công nghệ', description: 'Đầu tư hệ thống quản lý bệnh viện điện tử hiện đại' },
    { year: '2020', title: 'Đại dịch', description: 'Tiên phong trong việc chăm sóc sức khỏe online' },
    { year: '2023', title: 'Hiện tại', description: 'Trở thành một trong những hệ thống y tế uy tín nhất' }
  ];

  const certifications = [
    'Chứng nhận ISO 9001:2015',
    'Giấy phép hoạt động của Bộ Y tế',
    'Chứng nhận JCI (Joint Commission International)',
    'Thành viên Hiệp hội Bệnh viện Việt Nam',
    'Chứng nhận An toàn Thông tin',
    'Giải thưởng Dịch vụ Y tế Xuất sắc'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Section background="white" padding="lg">
        <Container>
          <Breadcrumb items={breadcrumbItems} className="mb-6" />
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Về MedicalCare</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Với hơn 15 năm kinh nghiệm, chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe 
              chất lượng cao và trải nghiệm tuyệt vời cho mọi bệnh nhân.
            </p>
          </div>
        </Container>
      </Section>

      {/* Hero Stats */}
      <Section padding="xl" background="blue">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat, index) => (
              <div key={index} className="group">
                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/40 transition-colors">
                <stat.icon className="w-10 h-10 text-blue-500 group-hover:text-white transition-colors" />
                </div>
                <div className="text-3xl font-bold mb-2 text-blue-500">{stat.number}</div>
                <div className="text-blue-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Mission & Vision */}
      <Section padding="xl">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Sứ Mệnh & Tầm Nhìn</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Heart className="w-6 h-6 text-red-500" />
                    Sứ Mệnh
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Cung cấp dịch vụ chăm sóc sức khỏe toàn diện, chất lượng cao và dễ tiếp cận 
                    cho mọi người. Chúng tôi cam kết đồng hành cùng bệnh nhân trên hành trình 
                    chăm sóc và phục hồi sức khỏe.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-500" />
                    Tầm Nhìn
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Trở thành hệ thống chăm sóc sức khỏe hàng đầu Việt Nam, được tin tưởng 
                    và lựa chọn bởi hàng triệu người dân. Tiên phong ứng dụng công nghệ 
                    trong y tế để mang lại trải nghiệm tốt nhất.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-linear-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Cam Kết Chất Lượng</h3>
                  <p className="text-blue-100 leading-relaxed">
                    "Sức khỏe của bạn là ưu tiên hàng đầu của chúng tôi. 
                    Mỗi dịch vụ, mỗi lời tư vấn đều được thực hiện với 
                    tinh thần trách nhiệm cao nhất."
                  </p>
                  <div className="mt-6">
                    <div className="text-sm opacity-75">— Ban Giám Đốc MedicalCare</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Core Values */}
      <Section padding="xl" background="gray">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Giá Trị Cốt Lõi</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những giá trị định hướng mọi hoạt động và quyết định của chúng tôi
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Timeline */}
      <Section padding="xl">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Hành Trình Phát Triển</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Từ một phòng khám nhỏ đến hệ thống y tế hàng đầu
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200 hidden lg:block"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center gap-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg shrink-0 hidden lg:block relative z-10"></div>
                  
                  <div className="flex-1 hidden lg:block"></div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Certifications */}
      <Section padding="xl" background="gray">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Chứng Nhận & Giải Thưởng</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Được công nhận bởi các tổ chức uy tín trong và ngoài nước
            </p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
                  <span className="text-gray-700">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Leadership Team */}
      <Section padding="xl">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ban Lãnh Đạo</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Đội ngũ lãnh đạo giàu kinh nghiệm và tầm nhìn
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'PGS.TS. Nguyễn Văn A',
                position: 'Giám đốc Y khoa',
                image: '/images/placeholder-doctor.png',
                description: '25+ năm kinh nghiệm trong lĩnh vực tim mạch'
              },
              {
                name: 'BS.CKI. Trần Thị B',
                position: 'Phó Giám đốc',
                image: '/images/placeholder-doctor.png',
                description: 'Chuyên gia hàng đầu về nhi khoa và sản phụ khoa'
              },
              {
                name: 'ThS. Lê Văn C',
                position: 'Giám đốc Điều hành',
                image: '/images/placeholder-doctor.png',
                description: 'MBA Harvard, 15+ năm quản lý bệnh viện'
              }
            ].map((leader, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <Users className="w-16 h-16 text-gray-400" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{leader.name}</h3>
                  <div className="text-blue-600 font-medium mb-3">{leader.position}</div>
                  <p className="text-gray-600 text-sm">{leader.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Contact CTA */}
      <Section padding="xl" background="blue">
        <Container>
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4 text-blue-500">Sẵn Sàng Chăm Sóc Sức Khỏe Của Bạn</h2>
            <p className="text-xl text-blue-500 mb-8 max-w-2xl mx-auto">
              Liên hệ với chúng tôi ngay hôm nay để được tư vấn và đặt lịch khám
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                Liên Hệ Ngay
              </a>
              <a
                href="/appointments/book"
                className=" border-2 border-white text-blue-500 px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Clock className="w-5 h-5 text-blue-500" />
                Đặt Lịch Khám
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
