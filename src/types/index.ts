// Type definitions for Medical Care app

export interface Specialist {
  id: string;
  name: string;
  slug: string;
  shortDesc: string;
  thumbnail: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  avatar: string;
  experience?: number;
  qualifications?: string[];
  schedule?: string[];
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
