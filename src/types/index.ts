// Type definitions for Medical Care app

export interface Specialist {
  id?: string;
  _id?: string; // MongoDB ObjectId
  name: string;
  slug?: string;
  shortDesc?: string;
  thumbnail?: string;
  image?: string; // Backend uses 'image' instead of 'thumbnail'
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Doctor {
  id?: string;
  _id?: string; // MongoDB ObjectId
  name: string;
  specialty: string;
  specialtyId?: string;
  rating?: number;
  avatar?: string;
  experience?: string;
  qualifications?: string[];
  schedule?: string[];
  location?: string;
  phone?: string;
  email?: string;
  reviewCount?: number;
  bio?: string;
  description?: string; // Mô tả chi tiết HTML
  education?: string[];
  trainingProcess?: string[]; // Quá trình đào tạo
  academicRank?: string; // Học hàm (GS, PGS, TS...)
  academicDegree?: string; // Học vị (Thạc sĩ, Tiến sĩ...)
  organization?: string; // Tổ chức/Bệnh viện đang công tác
  organizationMember?: string; // Thành viên tổ chức
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TimeSlot {
  time: string; // Format: "08:00-09:00"
  isBooked: boolean;
  _id?: string;
}

export interface Plan {
  id?: string;
  _id?: string; // MongoDB ObjectId
  doctorId: string;
  doctor?: Doctor;
  date: string;
  timeSlots: TimeSlot[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface News {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  content?: string;
  author?: string;
  tags?: string[];
}

export interface HomePageData {
  featuredSpecialists: Specialist[];
  featuredDoctors: Doctor[];
  latestNews: News[];
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Request types for POST/PUT
export interface CreateSpecialistRequest {
  name: string;
  slug: string;
  shortDesc: string;
  thumbnail: string;
  description?: string;
}

export interface UpdateSpecialistRequest extends Partial<CreateSpecialistRequest> {}

export interface CreateDoctorRequest {
  name: string;
  specialty: string;
  rating: number;
  avatar: string;
  experience?: number;
  qualifications?: string[];
  schedule?: string[];
}

export interface UpdateDoctorRequest extends Partial<CreateDoctorRequest> {}
