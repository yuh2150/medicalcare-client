import { 
  Appointment, 
  AppointmentStatus,
  PaginatedResponse, 
  ApiResponse, 
  ApiFilter 
} from '@/types/admin';
import { apiClient } from './config';

// API endpoints for appointments
const ENDPOINTS = {
  appointments: '/medicalcare/api/appointments',
  appointment: (id: string) => `/medicalcare/api/appointments/${id}`,
  book: '/medicalcare/api/appointments',
  cancel: (id: string) => `/medicalcare/api/appointments/${id}/cancel`,
  confirm: (id: string) => `/medicalcare/api/appointments/${id}/confirm`,
  complete: (id: string) => `/medicalcare/api/appointments/${id}/complete`,
  bulkAction: '/medicalcare/api/appointments/bulk',
  statistics: '/medicalcare/api/appointments/statistics'
};

// Interface for creating/updating appointments
export interface CreateAppointmentRequest {
  customerId: string;
  doctorId: string;
  planId: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:mm-HH:mm
  reason?: string;
  notes?: string;
}

export interface UpdateAppointmentRequest {
  customerId?: string;
  doctorId?: string;
  planId?: string;
  date?: string;
  timeSlot?: string;
  status?: AppointmentStatus;
  reason?: string;
  notes?: string;
  diagnosis?: string;
  prescription?: string;
  fee?: number;
}

// Bulk actions interface
export interface BulkAppointmentAction {
  action: 'confirm' | 'cancel' | 'complete' | 'delete';
  ids: string[];
}

// Appointment filters
export interface AppointmentFilter extends ApiFilter {
  doctorId?: string;
  customerId?: string;
  status?: AppointmentStatus;
  dateFrom?: string;
  dateTo?: string;
  specialtyId?: string;
}

const appointmentApi = {
  // Get all appointments with pagination and filters
  getAppointments: async (filter: AppointmentFilter = { page: 1, limit: 10 }): Promise<PaginatedResponse<Appointment>> => {
    try {
      console.log('Fetching appointments with filter:', filter);
      
      const params = new URLSearchParams();
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });

      const response = await apiClient.get(`${ENDPOINTS.appointments}?${params.toString()}`);
      console.log('Appointments API response:', response.data);
      
      // Transform response to match expected format (similar to other APIs)
      return {
        data: response.data || [],
        pagination: {
          page: filter.page || 1,
          limit: filter.limit || 10,
          total: response.data?.length || 0,
          totalPages: Math.ceil((response.data?.length || 0) / (filter.limit || 10)),
          hasNext: false,
          hasPrev: false
        }
      };
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch appointments');
    }
  },

  // Get appointment by ID
  getAppointment: async (id: string): Promise<Appointment> => {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Appointment ID is required');
      }

      console.log('Fetching appointment with ID:', id);
      const response = await apiClient.get(ENDPOINTS.appointment(id));
      console.log('Appointment API response:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('Error fetching appointment:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch appointment');
    }
  },

  // Create new appointment (book)
  createAppointment: async (data: CreateAppointmentRequest): Promise<Appointment> => {
    try {
      // Validate required fields
      if (!data.customerId || !data.doctorId || !data.planId || !data.date || !data.timeSlot) {
        throw new Error('Missing required fields: customerId, doctorId, planId, date, timeSlot, type');
      }

      console.log('Creating appointment with data:', data);
      const response = await apiClient.post(ENDPOINTS.book, data);
      console.log('Create appointment API response:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to create appointment');
    }
  },

  // Update appointment
  updateAppointment: async (id: string, data: UpdateAppointmentRequest): Promise<Appointment> => {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Appointment ID is required');
      }

      console.log('Updating appointment:', id, 'with data:', data);
      const response = await apiClient.put(ENDPOINTS.appointment(id), data);
      console.log('Update appointment API response:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('Error updating appointment:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to update appointment');
    }
  },

  // Delete appointment
  deleteAppointment: async (id: string): Promise<void> => {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Appointment ID is required');
      }

      console.log('Deleting appointment with ID:', id);
      const response = await apiClient.delete(ENDPOINTS.appointment(id));
      console.log('Delete appointment API response:', response.data);
    } catch (error: any) {
      console.error('Error deleting appointment:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete appointment');
    }
  },

  // Confirm appointment
  confirmAppointment: async (id: string): Promise<Appointment> => {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Appointment ID is required');
      }

      console.log('Confirming appointment with ID:', id);
      const response = await apiClient.put(ENDPOINTS.confirm(id));
      console.log('Confirm appointment API response:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('Error confirming appointment:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to confirm appointment');
    }
  },

  // Cancel appointment
  cancelAppointment: async (id: string, reason?: string): Promise<Appointment> => {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Appointment ID is required');
      }

      console.log('Cancelling appointment with ID:', id, 'reason:', reason);
      const response = await apiClient.put(ENDPOINTS.cancel(id), { reason });
      console.log('Cancel appointment API response:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('Error cancelling appointment:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to cancel appointment');
    }
  },

  // Complete appointment
  completeAppointment: async (id: string, data: { diagnosis?: string; prescription?: string; notes?: string }): Promise<Appointment> => {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Appointment ID is required');
      }

      console.log('Completing appointment with ID:', id, 'data:', data);
      const response = await apiClient.put(ENDPOINTS.complete(id), data);
      console.log('Complete appointment API response:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('Error completing appointment:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to complete appointment');
    }
  },

  // Bulk actions on appointments
  bulkAction: async (data: BulkAppointmentAction): Promise<void> => {
    try {
      if (!data.action || !data.ids || data.ids.length === 0) {
        throw new Error('Action and appointment IDs are required');
      }

      console.log('Performing bulk action:', data);
      const response = await apiClient.post(ENDPOINTS.bulkAction, data);
      console.log('Bulk action API response:', response.data);
    } catch (error: any) {
      console.error('Error performing bulk action:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to perform bulk action');
    }
  },

  // Get appointment statistics
  getStats: async (): Promise<{
    total: number;
    today: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  }> => {
    try {
      const response = await apiClient.get(ENDPOINTS.statistics);
      console.log('Appointment stats API response:', response.data);
      
      return response.data || {
        total: 0,
        today: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0
      };
    } catch (error: any) {
      console.error('Error fetching appointment stats:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch appointment statistics');
    }
  }
};

export default appointmentApi;
