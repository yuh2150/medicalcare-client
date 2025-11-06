import { apiClient } from './config';
import { Order, PaginatedResponse, ApiFilter, BulkAction } from '../types/admin';

export const orderApi = {
  async getOrders(filter: ApiFilter): Promise<PaginatedResponse<Order>> {
    const response = await apiClient.get('/medicalcare/api/orders', { params: filter });
    
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

  async getOrderById(id: string): Promise<Order> {
    const response = await apiClient.get(`/medicalcare/api/orders/${id}`);
    return response.data;
  },

  async getOrdersCount(): Promise<{ count: number }> {
    const response = await apiClient.get('/medicalcare/api/orders/stats/count');
    return response.data;
  },

  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<{
    success: boolean;
    data?: Order;
    message: string;
  }> {
    try {
      const response = await apiClient.post('/medicalcare/api/orders', order);
      return {
        success: true,
        data: response.data,
        message: 'Tạo đơn hàng thành công'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng'
      };
    }
  },

  async updateOrder(id: string, order: Partial<Order>): Promise<{
    success: boolean;
    data?: Order;
    message: string;
  }> {
    try {
      const response = await apiClient.put(`/medicalcare/api/orders/${id}`, order);
      return {
        success: true,
        data: response.data,
        message: 'Cập nhật đơn hàng thành công'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật đơn hàng'
      };
    }
  },

  async updateOrderStatus(id: string, status: string): Promise<{
    success: boolean;
    data?: Order;
    message: string;
  }> {
    try {
      const response = await apiClient.patch(`/medicalcare/api/orders/${id}/status`, { status });
      return {
        success: true,
        data: response.data,
        message: 'Cập nhật trạng thái thành công'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái'
      };
    }
  },

  async deleteOrder(id: string): Promise<{ success: boolean; message: string }> {
    try {
      await apiClient.delete(`/medicalcare/api/orders/${id}`);
      return {
        success: true,
        message: 'Xóa đơn hàng thành công'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi xóa đơn hàng'
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
          switch (action.action) {
            case 'delete':
              await this.deleteOrder(id);
              break;
            case 'confirm':
              await this.updateOrderStatus(id, 'confirmed');
              break;
            case 'complete':
              await this.updateOrderStatus(id, 'completed');
              break;
            case 'cancel':
              await this.updateOrderStatus(id, 'cancelled');
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
