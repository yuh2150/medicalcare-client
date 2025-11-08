// Demo data for testing doctors page
export const mockDoctors = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    specialty: 'Tim mạch',
    rating: 4.8,
    avatar: '/images/placeholder-doctor.png',
    experience: 15,
    location: 'Hà Nội',
    phone: '0123-456-789',
    email: 'dr.nguyen@medicalcare.com',
    reviewCount: 125,
    bio: '<h2>Giới thiệu về Bác sĩ Nguyễn Văn A</h2><p>Bác sĩ Nguyễn Văn A là <strong>chuyên gia tim mạch hàng đầu</strong> với hơn 15 năm kinh nghiệm trong lĩnh vực điều trị các bệnh tim mạch.</p><h3>Chuyên môn:</h3><ul><li>Điều trị bệnh mạch vành</li><li>Siêu âm tim và mạch máu</li><li>Can thiệp tim mạch không phẫu thuật</li></ul><blockquote>Sức khỏe tim mạch là nền tảng của cuộc sống khỏe mạnh</blockquote>',
    education: [
      'Bác sĩ Y khoa - Đại học Y Hà Nội',
      'Thạc sĩ Tim mạch - Đại học Y Paris'
    ],
    qualifications: [
      'Chứng chỉ hành nghề bác sĩ',
      'Chứng chỉ chuyên khoa Tim mạch cấp I',
      'Chứng chỉ siêu âm tim'
    ]
  },
  {
    id: '2', 
    name: 'Trần Thị B',
    specialty: 'Nhi khoa',
    rating: 4.9,
    avatar: '/images/placeholder-doctor.png',
    experience: 12,
    location: 'TP.HCM',
    phone: '0123-456-780',
    email: 'dr.tran@medicalcare.com',
    reviewCount: 98,
    bio: '<h2>Giới thiệu về Bác sĩ Trần Thị B</h2><p>Bác sĩ Trần Thị B là <strong>chuyên gia nhi khoa</strong> với 12 năm kinh nghiệm điều trị trẻ em và sơ sinh.</p><h3>Lĩnh vực chuyên môn:</h3><ul><li>Khám sức khỏe định kỳ cho trẻ</li><li>Điều trị bệnh nhiễm khuẩn</li><li>Theo dõi phát triển trẻ em</li><li>Tư vấn dinh dưỡng</li></ul><blockquote>Mỗi em bé đều xứng đáng có một khởi đầu khỏe mạnh trong cuộc sống</blockquote>',
    education: [
      'Bác sĩ Y khoa - Đại học Y Dược TP.HCM',
      'Chuyên khoa Nhi - Bệnh viện Nhi Đồng'
    ],
    qualifications: [
      'Chứng chỉ hành nghề bác sĩ',
      'Chứng chỉ chuyên khoa Nhi cấp I',
      'Chứng chỉ sơ sinh và trẻ sớm'
    ]
  }
];

export const mockPlans = [
  {
    id: '1',
    doctorId: '1',
    date: '2024-11-10',
    timeSlots: [
      { startTime: '08:00', endTime: '08:30', isBooked: false },
      { startTime: '09:00', endTime: '09:30', isBooked: true },
      { startTime: '10:00', endTime: '10:30', isBooked: false }
    ]
  },
  {
    id: '2',
    doctorId: '1', 
    date: '2024-11-11',
    timeSlots: [
      { startTime: '14:00', endTime: '14:30', isBooked: false },
      { startTime: '15:00', endTime: '15:30', isBooked: false }
    ]
  }
];
