import { apiClient } from './config';
import { AdminUser, PaginatedResponse, ApiFilter, BulkAction } from '../types/admin';

export const userApi = {
  async getUsers(filter: ApiFilter): Promise<PaginatedResponse<AdminUser>> {
    const response = await apiClient.get('/medicalcare/api/users', { params: filter });
    
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

  async getUserById(id: string): Promise<AdminUser> {
    const response = await apiClient.get(`/medicalcare/api/users/${id}`);
    return response.data;
  },

  async createUser(user: Omit<AdminUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<{
    success: boolean;
    data?: AdminUser;
    message: string;
  }> {
    try {
      // Validate required fields
      if (!user.name?.trim()) {
        throw new Error('Tên người dùng là bắt buộc');
      }
      if (!user.email?.trim()) {
        throw new Error('Email là bắt buộc');
      }
      if (!user.password?.trim()) {
        throw new Error('Mật khẩu là bắt buộc');
      }

      // Prepare user data according to backend schema
      const userData = {
        name: user.name.trim().toLowerCase(), // Backend expects lowercase
        email: user.email.trim().toLowerCase(), // Backend expects lowercase
        phone: user.phone?.trim() || undefined,
        password: user.password,
        role: user.role,
        status: user.status,
        avatar: user.avatar?.trim() || undefined
      };

      console.log('Creating user with data:', { ...userData, password: '[HIDDEN]' });
      
      const response = await apiClient.post('/medicalcare/api/users', userData);
      return {
        success: true,
        data: response.data,
        message: 'Tạo người dùng thành công'
      };
    } catch (error: any) {
      console.error('Create user API error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tạo người dùng'
      };
    }
  },

  async updateUser(id: string, user: Partial<AdminUser>): Promise<{
    success: boolean;
    data?: AdminUser;
    message: string;
  }> {
    try {
      // Validate ID
      if (!id?.trim()) {
        throw new Error('ID người dùng không hợp lệ');
      }

      // Prepare update data according to backend schema
      const updateData: any = {};
      
      if (user.name !== undefined) {
        if (!user.name.trim()) {
          throw new Error('Tên người dùng không được để trống');
        }
        updateData.name = user.name.trim().toLowerCase(); // Backend expects lowercase
      }
      
      if (user.email !== undefined) {
        if (!user.email.trim()) {
          throw new Error('Email không được để trống');
        }
        updateData.email = user.email.trim().toLowerCase(); // Backend expects lowercase
      }
      
      if (user.phone !== undefined) {
        updateData.phone = user.phone?.trim() || null;
      }
      
      if (user.password !== undefined && user.password.trim()) {
        updateData.password = user.password;
      }
      
      if (user.role !== undefined) {
        updateData.role = user.role;
      }
      
      if (user.status !== undefined) {
        updateData.status = user.status;
      }
      
      if (user.avatar !== undefined) {
        updateData.avatar = user.avatar?.trim() || null;
      }

      console.log('Updating user with ID:', id, 'data:', { ...updateData, password: updateData.password ? '[HIDDEN]' : undefined });
      
      const response = await apiClient.put(`/medicalcare/api/users/${id}`, updateData);
      return {
        success: true,
        data: response.data,
        message: 'Cập nhật người dùng thành công'
      };
    } catch (error: any) {
      console.error('Update user API error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Có lỗi xảy ra khi cập nhật người dùng'
      };
    }
  },

  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    try {
      // Validate ID
      if (!id?.trim()) {
        throw new Error('ID người dùng không hợp lệ');
      }

      console.log('Deleting user with ID:', id);
      
      await apiClient.delete(`/medicalcare/api/users/${id}`);
      return {
        success: true,
        message: 'Xóa người dùng thành công'
      };
    } catch (error: any) {
      console.error('Delete user API error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Có lỗi xảy ra khi xóa người dùng'
      };
    }
  },

  async getUsersCount(): Promise<{ count: number }> {
    const response = await apiClient.get('/medicalcare/api/users/stats/count');
    return response.data;
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
              const deleteResult = await this.deleteUser(id);
              if (!deleteResult.success) {
                throw new Error(deleteResult.message);
              }
              break;
            case 'activate':
              const activateResult = await this.updateUser(id, { status: 'active' });
              if (!activateResult.success) {
                throw new Error(activateResult.message);
              }
              break;
            case 'deactivate':
              const deactivateResult = await this.updateUser(id, { status: 'inactive' });
              if (!deactivateResult.success) {
                throw new Error(deactivateResult.message);
              }
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
