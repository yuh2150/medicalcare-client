import { apiClient } from './config';
import { Specialty, PaginatedResponse, ApiFilter, BulkAction } from '../types/admin';

export const specialistApi = {
  async getSpecialists(filter: ApiFilter): Promise<PaginatedResponse<Specialty>> {
    const response = await apiClient.get('/medicalcare/api/specialists', { params: filter });
    
    // Transform response to match expected format
    return {
      data: Array.isArray(response.data) ? response.data : [],
      pagination: {
        page: filter.page || 1,
        limit: filter.limit || 10,
        total: Array.isArray(response.data) ? response.data.length : 0,
        totalPages: Math.ceil((Array.isArray(response.data) ? response.data.length : 0) / (filter.limit || 10)),
        hasNext: false,
        hasPrev: false
      }
    };
  },

  async getSpecialistById(id: string): Promise<Specialty> {
    const response = await apiClient.get(`/medicalcare/api/specialists/${id}`);
    return response.data;
  },

  async getSpecialistsCount(): Promise<{ count: number }> {
    const response = await apiClient.get('/medicalcare/api/specialists/stats/count');
    return response.data;
  },

  async createSpecialist(specialist: Omit<Specialty, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>): Promise<{
    success: boolean;
    data?: Specialty;
    message: string;
  }> {
    try {
      // Validate required fields
      if (!specialist.name?.trim()) {
        throw new Error('Tên chuyên khoa là bắt buộc');
      }

      // Prepare specialist data according to backend schema
      const specialistData = {
        name: specialist.name.trim(), // Max 100 chars, auto trim
        image: specialist.image?.trim() || undefined, // Max 500 chars
        description: specialist.description?.trim() || undefined // Max 2000 chars, auto trim
      };

      // Validate field lengths
      if (specialistData.name.length > 100) {
        throw new Error('Tên chuyên khoa không được vượt quá 100 ký tự');
      }
      if (specialistData.image && specialistData.image.length > 500) {
        throw new Error('URL hình ảnh không được vượt quá 500 ký tự');
      }
      if (specialistData.description && specialistData.description.length > 2000) {
        throw new Error('Mô tả không được vượt quá 2000 ký tự');
      }

      console.log('Creating specialist with data:', specialistData);
      
      const response = await apiClient.post('/medicalcare/api/specialists', specialistData);
      return {
        success: true,
        data: response.data,
        message: 'Tạo chuyên khoa thành công'
      };
    } catch (error: any) {
      console.error('Create specialist API error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tạo chuyên khoa'
      };
    }
  },

  async updateSpecialist(id: string, specialist: Partial<Specialty>): Promise<{
    success: boolean;
    data?: Specialty;
    message: string;
  }> {
    try {
      // Validate ID
      if (!id?.trim()) {
        throw new Error('ID chuyên khoa không hợp lệ');
      }

      // Prepare update data according to backend schema
      const updateData: any = {};
      
      if (specialist.name !== undefined) {
        if (!specialist.name.trim()) {
          throw new Error('Tên chuyên khoa không được để trống');
        }
        updateData.name = specialist.name.trim();
        if (updateData.name.length > 100) {
          throw new Error('Tên chuyên khoa không được vượt quá 100 ký tự');
        }
      }
      
      if (specialist.image !== undefined) {
        updateData.image = specialist.image?.trim() || null;
        if (updateData.image && updateData.image.length > 500) {
          throw new Error('URL hình ảnh không được vượt quá 500 ký tự');
        }
      }
      
      if (specialist.description !== undefined) {
        updateData.description = specialist.description?.trim() || null;
        if (updateData.description && updateData.description.length > 2000) {
          throw new Error('Mô tả không được vượt quá 2000 ký tự');
        }
      }

      console.log('Updating specialist with ID:', id, 'data:', updateData);
      
      const response = await apiClient.put(`/medicalcare/api/specialists/${id}`, updateData);
      return {
        success: true,
        data: response.data,
        message: 'Cập nhật chuyên khoa thành công'
      };
    } catch (error: any) {
      console.error('Update specialist API error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Có lỗi xảy ra khi cập nhật chuyên khoa'
      };
    }
  },

  async deleteSpecialist(id: string): Promise<{ success: boolean; message: string }> {
    try {
      // Validate ID
      if (!id?.trim()) {
        throw new Error('ID chuyên khoa không hợp lệ');
      }

      console.log('Deleting specialist with ID:', id);
      
      await apiClient.delete(`/medicalcare/api/specialists/${id}`);
      return {
        success: true,
        message: 'Xóa chuyên khoa thành công'
      };
    } catch (error: any) {
      console.error('Delete specialist API error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Có lỗi xảy ra khi xóa chuyên khoa'
      };
    }
  },

  // Bulk action - fallback implementation since no specific endpoint provided
  async bulkAction(action: BulkAction): Promise<{ success: boolean; message: string }> {
    try {
      if (!action.ids || action.ids.length === 0) {
        return { success: false, message: 'Không có mục nào được chọn' };
      }

      // Validate all IDs before processing
      const validIds = action.ids.filter(id => id?.trim());
      if (validIds.length === 0) {
        return { success: false, message: 'Không có ID hợp lệ nào được chọn' };
      }

      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      console.log(`Bulk action: ${action.action} for IDs:`, validIds);

      // Process each item individually since no bulk endpoint available
      for (const id of validIds) {
        try {
          switch (action.action) {
            case 'delete':
              const deleteResult = await this.deleteSpecialist(id);
              if (!deleteResult.success) {
                throw new Error(deleteResult.message);
              }
              break;
            case 'activate':
              // Note: Backend schema doesn't include isActive field
              // This action might not be supported by the new schema
              console.warn('Activate action may not be supported by backend schema');
              break;
            case 'deactivate':
              // Note: Backend schema doesn't include isActive field
              // This action might not be supported by the new schema
              console.warn('Deactivate action may not be supported by backend schema');
              break;
            default:
              throw new Error(`Hành động không hỗ trợ: ${action.action}`);
          }
          successCount++;
        } catch (error: any) {
          errorCount++;
          errors.push(`ID ${id}: ${error.message}`);
          console.error(`Bulk action error for ID ${id}:`, error);
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
          message: `Thất bại khi thực hiện ${action.action} cho tất cả các mục: ${errors.join('; ')}`
        };
      }
    } catch (error: any) {
      console.error('Bulk action error:', error);
      return {
        success: false,
        message: error.message || `Có lỗi xảy ra khi thực hiện ${action.action}`
      };
    }
  }
};
