import { apiClient } from './config';
import { Doctor, PaginatedResponse, ApiFilter, BulkAction } from '../types/admin';

export const doctorApi = {
  async getDoctors(filter: ApiFilter): Promise<PaginatedResponse<Doctor>> {
    const response = await apiClient.get('/medicalcare/api/doctors', { params: filter });
    
    // Transform response to match expected format
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
  },

  async getDoctorById(id: string): Promise<Doctor> {
    const response = await apiClient.get(`/medicalcare/api/doctors/${id}`);
    return response.data;
  },

  async getDoctorsBySpecialty(specialtyId: string): Promise<Doctor[]> {
    const response = await apiClient.get(`/medicalcare/api/doctors/specialty/${specialtyId}`);
    return response.data || [];
  },

  async createDoctor(doctor: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>): Promise<{
    success: boolean;
    data?: Doctor;
    message: string;
  }> {
    try {
      const response = await apiClient.post('/medicalcare/api/doctors', doctor);
      return {
        success: true,
        data: response.data,
        message: 'Tạo bác sĩ thành công'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi tạo bác sĩ'
      };
    }
  },

  async updateDoctor(id: string, doctor: Partial<Doctor>): Promise<{
    success: boolean;
    data?: Doctor;
    message: string;
  }> {
    try {
      if (!id || id === 'undefined' || id === 'null') {
        console.error('Invalid doctor ID:', id);
        throw new Error(`ID bác sĩ không hợp lệ: ${id}`);
      }
      
      console.log('Updating doctor with ID:', id);
      const response = await apiClient.put(`/medicalcare/api/doctors/${id}`, doctor);
      return {
        success: true,
        data: response.data,
        message: 'Cập nhật bác sĩ thành công'
      };
    } catch (error: any) {
      console.error('Update doctor error:', { id, error: error.message });
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Có lỗi xảy ra khi cập nhật bác sĩ'
      };
    }
  },

  async deleteDoctor(id: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!id || id === 'undefined') {
        throw new Error('ID bác sĩ không hợp lệ');
      }
      
      await apiClient.delete(`/medicalcare/api/doctors/${id}`);
      return {
        success: true,
        message: 'Xóa bác sĩ thành công'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi xóa bác sĩ'
      };
    }
  },

  // Bulk action - fallback implementation since no specific endpoint provided
  async bulkAction(action: BulkAction): Promise<{ success: boolean; message: string }> {
    try {
      if (!action.ids || action.ids.length === 0) {
        return { success: false, message: 'Không có mục nào được chọn' };
      }

      let successCount = 0;
      let errorCount = 0;

      // Process each item individually since no bulk endpoint available
      for (const id of action.ids) {
        try {
          // Skip invalid IDs
          if (!id || id === 'undefined') {
            errorCount++;
            continue;
          }
          
          switch (action.action) {
            case 'delete':
              await this.deleteDoctor(id);
              break;
            case 'activate':
              await this.updateDoctor(id, { status: 'ACTIVE' });
              break;
            case 'deactivate':
              await this.updateDoctor(id, { status: 'INACTIVE' });
              break;
            case 'on_leave':
              await this.updateDoctor(id, { status: 'ON_LEAVE' });
              break;
            default:
              throw new Error(`Hành động không hỗ trợ: ${action.action}`);
          }
          successCount++;
        } catch {
          errorCount++;
        }
      }

      if (successCount > 0) {
        return {
          success: true,
          message: `Đã thực hiện ${action.action} thành công cho ${successCount} mục${errorCount > 0 ? `, thất bại ${errorCount} mục` : ''}`
        };
      } else {
        return {
          success: false,
          message: `Thất bại khi thực hiện ${action.action} cho tất cả các mục`
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || `Có lỗi xảy ra khi thực hiện ${action.action}`
      };
    }
  }
};
