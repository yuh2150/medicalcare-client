// Specialist types - extending from admin types for consistency
import type { Specialty as AdminSpecialty } from './admin';

export interface Specialty extends AdminSpecialty {
  // MongoDB support
  _id?: string;
  // Image fields (API might use either)
  image?: string;
  thumbnail?: string;
  // Additional fields for detailed view
  services?: string[];
  doctors?: SpecialistDoctor[];
  bannerImage?: string;
  detailedDescription?: string;
}

export interface SpecialistDoctor {
  id?: string;
  _id?: string; // MongoDB support
  name: string;
  title?: string;
  avatar?: string;
  specialtyId?: string;
  experience?: number;
  rating?: number;
}

export interface SpecialistFilter {
  search?: string;
  isActive?: boolean;
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedSpecialists {
  data: Specialty[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
