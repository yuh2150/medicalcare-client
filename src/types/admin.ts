// User roles
export type UserRole = 'admin' | 'doctor' | 'customer';

// Admin related types - for users who can access admin panel
export interface AdminUser {
  id: string;
  name: string; // Tên người dùng (required)
  email: string; // Email (required, unique)
  phone?: string; // Số điện thoại E.164 format
  password?: string; // Password (chỉ dùng khi tạo/cập nhật, không trả về từ API)
  role: UserRole; // Vai trò người dùng
  status: 'active' | 'inactive'; // Trạng thái tài khoản
  avatar?: string; // URL ảnh đại diện
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  // Specific fields for doctors
  specialties?: { id: string; name: string; }[];
  licenseNumber?: string;
  // Specific fields for customers
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
}

// Dashboard Statistics
export interface DashboardStats {
  orders: {
    total: number;
    today: number;
    growth: number;
  };
  revenue: {
    total: number;
    today: number;
    growth: number;
  };
  patients: {
    total: number;
    new: number;
    growth: number;
  };
  bookings: {
    total: number;
    today: number;
    pending: number;
  };
}

// Chart data
export interface ChartData {
  date: string;
  orders: number;
  revenue: number;
  patients: number;
}

// Recent Activity
export interface Activity {
  id: string;
  action: string;
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
  type: 'create' | 'update' | 'delete' | 'login' | 'other';
  resourceType?: string;
  resourceId?: string;
}

// Users Management
export interface Patient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  avatar?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastVisit?: string;
}

// Doctor Status Enum
export type DoctorStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'SUSPENDED';

// Academic Titles
export type AcademicTitle = 
  | 'Giáo sư' 
  | 'Phó Giáo sư' 
  | 'Tiến sĩ' 
  | 'Thạc sĩ' 
  | 'Bác sĩ' 
  | 'Bác sĩ Chuyên khoa I' 
  | 'Bác sĩ Chuyên khoa II';

// Academic Degrees
export type AcademicDegree = 
  | 'Tiến sĩ Y khoa' 
  | 'Thạc sĩ Y khoa' 
  | 'Bác sĩ Y khoa' 
  | 'Cử nhân Y khoa';

// Doctors Management
export interface Doctor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  specialtyId: string;
  specialty?: { id: string; name: string }; // Populated specialty info
  academicTitle: AcademicTitle;
  academicDegree: AcademicDegree;
  description?: string;
  membership?: string;
  training?: string;
  experience?: string;
  avatar?: string;
  additionalImages?: string[];
  consultationFee?: number;
  status: DoctorStatus;
  createdAt: string;
  updatedAt: string;
}

// Specialists Management
export interface Specialty {
  id: string;
  name: string; // Tên chuyên khoa (required, max 100 chars)
  image?: string; // URL ảnh đại diện hoặc biểu tượng (max 500 chars)
  description?: string; // Mô tả chi tiết (max 2000 chars)
  isActive?: boolean; // Trạng thái hoạt động (computed field)
  createdAt: string;
  updatedAt: string;
}

// Orders Management
export interface Order {
  id: string;
  patientId: string;
  patientName: string;
  doctorId?: string;
  doctorName?: string;
  type: 'consultation' | 'medicine' | 'package';
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';

// Appointments Management
export interface Appointment {
  id: string;
  customerId: string; // Customer/Patient ID
  customerName: string; // Customer/Patient name
  customerPhone?: string; // Customer phone
  doctorId: string; // Doctor ID
  doctorName: string; // Doctor name (populated)
  specialtyName: string; // Specialty name (populated)
  planId: string; // Plan ID
  date: string; // Appointment date (YYYY-MM-DD)
  timeSlot: string; // Time slot (HH:mm-HH:mm)
  status: AppointmentStatus; // Appointment status
  reason?: string; // Appointment reason/symptoms
  notes?: string; // Additional notes
  diagnosis?: string; // Doctor's diagnosis
  prescription?: string; // Prescription details
  fee?: number; // Consultation fee
  createdAt: string;
  updatedAt: string;
}

// News Management
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  authorId: string;
  authorName: string;
  categoryId?: string;
  categoryName?: string;
  featuredImage?: string;
  images?: string[];
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

// Image Management
export interface ImageFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  description?: string;
  uploadedBy: string;
  uploaderName: string;
  folder?: string;
  category?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

// Audit Logs
export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userId: string;
  userName: string;
  userRole: 'admin' | 'manager' | 'staff';
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
  details: {
    ip: string;
    userAgent: string;
    changes?: {
      before: any;
      after: any;
    };
  };
  createdAt: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

// Table Filters
export interface TableFilter {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date';
  options?: { label: string; value: string }[];
  placeholder?: string;
}

// API Filter for pagination and search
export interface ApiFilter {
  page: number;
  limit: number;
  search?: string;
  [key: string]: any;
}

// Bulk Actions
export interface BulkAction {
  key: string;
  label: string;
  icon?: React.ComponentType<any>;
  danger?: boolean;
  action?: string;
  ids?: string[];
}

// Form Types
export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AdminUser;
}

// Permissions
export type Permission = 
  | 'users.read' | 'users.write' | 'users.delete'
  | 'doctors.read' | 'doctors.write' | 'doctors.delete'
  | 'appointments.read' | 'appointments.write' | 'appointments.delete'
  | 'orders.read' | 'orders.write' | 'orders.delete'
  | 'news.read' | 'news.write' | 'news.delete'
  | 'audit.read'
  | 'admin.read' | 'admin.write';

export interface RolePermissions {
  admin: Permission[];
  doctor: Permission[];
  customer: Permission[];
}

// Time slot interface for plans
export interface TimeSlot {
  time: string; // HH:mm-HH:mm
  isBooked: boolean;
  bookedBy?: string; // User ID who booked this slot
}

// Plans Management
export interface Plan {
  id: string;
  doctorId: string; // ID của bác sĩ
  doctor?: { id: string; name: string }; // Populated doctor info
  date: string; // Ngày làm việc (YYYY-MM-DD)
  timeSlots: TimeSlot[]; // Danh sách khung giờ với trạng thái booking
  notes?: string; // Ghi chú (max 500 chars)
  createdAt: string;
  updatedAt: string;
}
