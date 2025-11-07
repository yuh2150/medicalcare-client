import { apiClient } from './config';
import { Plan, TimeSlot, PaginatedResponse, ApiFilter, BulkAction } from '../types/admin';

export const planApi = {
  async getPlans(filter: ApiFilter): Promise<PaginatedResponse<Plan>> {
    const response = await apiClient.get('/medicalcare/api/plans', { params: filter });
    
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

  async getPlanById(id: string): Promise<Plan> {
    const response = await apiClient.get(`/medicalcare/api/plans/${id}`);
    return response.data;
  },

  async getPlansByDoctor(doctorId: string): Promise<Plan[]> {
    const response = await apiClient.get(`/medicalcare/api/plans/doctor/${doctorId}`);
    return response.data || [];
  },

  async getPlansCount(): Promise<{ count: number }> {
    const response = await apiClient.get('/medicalcare/api/plans/stats/count');
    return response.data;
  },

  async createPlan(plan: Omit<Plan, 'id' | 'createdAt' | 'updatedAt' | 'doctor'>): Promise<{
    success: boolean;
    data?: Plan;
    message: string;
  }> {
    try {
      // Validate required fields
      if (!plan.doctorId?.trim()) {
        throw new Error('ID bác sĩ là bắt buộc');
      }
      if (!plan.date?.trim()) {
        throw new Error('Ngày làm việc là bắt buộc');
      }
      if (!plan.timeSlots || plan.timeSlots.length === 0) {
        throw new Error('Khung giờ làm việc là bắt buộc');
      }

      // Validate and normalize date format (YYYY-MM-DD)
      let normalizedDate = plan.date.trim();
      if (normalizedDate.includes('T')) {
        normalizedDate = normalizedDate.split('T')[0];
      }
      
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(normalizedDate)) {
        throw new Error('Định dạng ngày không hợp lệ (YYYY-MM-DD)');
      }
      
      // Validate that it's a valid date
      const dateObj = new Date(normalizedDate);
      if (isNaN(dateObj.getTime())) {
        throw new Error('Ngày không hợp lệ');
      }

      // Check if plan already exists for this doctor on this date
      try {
        const existingPlan = await apiClient.get(`/medicalcare/api/plans/date/${normalizedDate}/doctor/${plan.doctorId.trim()}`);
        if (existingPlan.data) {
          throw new Error('Bác sĩ này đã có kế hoạch cho ngày này. Mỗi bác sĩ chỉ được tạo 1 kế hoạch mỗi ngày.');
        }
      } catch (checkError: any) {
        // If 404, it means no existing plan - that's good
        if (checkError.response?.status !== 404) {
          throw checkError;
        }
      }

      // Validate time slots format and convert to new schema
      const timeSlotRegex = /^\d{2}:\d{2}-\d{2}:\d{2}$/;
      const formattedTimeSlots: TimeSlot[] = [];
      
      for (const slot of plan.timeSlots) {
        if (typeof slot === 'string') {
          if (!timeSlotRegex.test(slot)) {
            throw new Error(`Định dạng khung giờ không hợp lệ: ${slot} (HH:mm-HH:mm)`);
          }
          formattedTimeSlots.push({
            time: slot,
            isBooked: false
          });
        } else if (typeof slot === 'object' && slot !== null && 'time' in slot) {
          const timeSlot = slot as TimeSlot;
          if (!timeSlotRegex.test(timeSlot.time)) {
            throw new Error(`Định dạng khung giờ không hợp lệ: ${timeSlot.time} (HH:mm-HH:mm)`);
          }
          formattedTimeSlots.push({
            time: timeSlot.time,
            isBooked: timeSlot.isBooked || false,
            bookedBy: timeSlot.bookedBy || undefined
          });
        }
      }

      // Prepare plan data according to new backend schema
      const planData = {
        doctorId: plan.doctorId.trim(),
        date: normalizedDate,
        timeSlots: formattedTimeSlots,
        notes: plan.notes?.trim() || undefined
      };

      // Validate notes length
      if (planData.notes && planData.notes.length > 500) {
        throw new Error('Ghi chú không được vượt quá 500 ký tự');
      }

      console.log('Creating plan with data:', planData);
      
      const response = await apiClient.post('/medicalcare/api/plans', planData);
      return {
        success: true,
        data: response.data,
        message: 'Tạo kế hoạch thành công'
      };
    } catch (error: any) {
      console.error('Create plan API error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tạo kế hoạch'
      };
    }
  },

  async updatePlan(id: string, plan: Partial<Plan>): Promise<{
    success: boolean;
    data?: Plan;
    message: string;
  }> {
    try {
      // Validate ID
      if (!id?.trim()) {
        throw new Error('ID kế hoạch không hợp lệ');
      }

      // Prepare update data according to backend schema
      const updateData: any = {};
      
      if (plan.doctorId !== undefined) {
        if (!plan.doctorId.trim()) {
          throw new Error('ID bác sĩ không được để trống');
        }
        updateData.doctorId = plan.doctorId.trim();
      }
      
      if (plan.date !== undefined) {
        if (!plan.date.trim()) {
          throw new Error('Ngày làm việc không được để trống');
        }
        
        // Validate and normalize date format
        let normalizedDate = plan.date.trim();
        if (normalizedDate.includes('T')) {
          normalizedDate = normalizedDate.split('T')[0];
        }
        
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(normalizedDate)) {
          throw new Error('Định dạng ngày không hợp lệ (YYYY-MM-DD)');
        }
        
        // Validate that it's a valid date
        const dateObj = new Date(normalizedDate);
        if (isNaN(dateObj.getTime())) {
          throw new Error('Ngày không hợp lệ');
        }
        
        updateData.date = normalizedDate;
      }
      
      if (plan.timeSlots !== undefined) {
        if (!plan.timeSlots || plan.timeSlots.length === 0) {
          throw new Error('Khung giờ làm việc là bắt buộc');
        }
        
        const timeSlotRegex = /^\d{2}:\d{2}-\d{2}:\d{2}$/;
        const formattedTimeSlots: TimeSlot[] = [];
        
        for (const slot of plan.timeSlots) {
          if (typeof slot === 'string') {
            if (!timeSlotRegex.test(slot)) {
              throw new Error(`Định dạng khung giờ không hợp lệ: ${slot} (HH:mm-HH:mm)`);
            }
            formattedTimeSlots.push({
              time: slot,
              isBooked: false
            });
          } else if (typeof slot === 'object' && slot !== null && 'time' in slot) {
            const timeSlot = slot as TimeSlot;
            if (!timeSlotRegex.test(timeSlot.time)) {
              throw new Error(`Định dạng khung giờ không hợp lệ: ${timeSlot.time} (HH:mm-HH:mm)`);
            }
            formattedTimeSlots.push({
              time: timeSlot.time,
              isBooked: timeSlot.isBooked || false,
              bookedBy: timeSlot.bookedBy || undefined
            });
          }
        }
        
        updateData.timeSlots = formattedTimeSlots;
      }
      
      if (plan.notes !== undefined) {
        updateData.notes = plan.notes?.trim() || null;
        if (updateData.notes && updateData.notes.length > 500) {
          throw new Error('Ghi chú không được vượt quá 500 ký tự');
        }
      }

      console.log('Updating plan with ID:', id, 'data:', updateData);
      
      const response = await apiClient.put(`/medicalcare/api/plans/${id}`, updateData);
      return {
        success: true,
        data: response.data,
        message: 'Cập nhật kế hoạch thành công'
      };
    } catch (error: any) {
      console.error('Update plan API error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Có lỗi xảy ra khi cập nhật kế hoạch'
      };
    }
  },

  async deletePlan(id: string): Promise<{ success: boolean; message: string }> {
    try {
      // Validate ID
      if (!id?.trim()) {
        throw new Error('ID kế hoạch không hợp lệ');
      }

      console.log('Deleting plan with ID:', id);
      
      await apiClient.delete(`/medicalcare/api/plans/${id}`);
      return {
        success: true,
        message: 'Xóa kế hoạch thành công'
      };
    } catch (error: any) {
      console.error('Delete plan API error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Có lỗi xảy ra khi xóa kế hoạch'
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
              const deleteResult = await this.deletePlan(id);
              if (!deleteResult.success) {
                throw new Error(deleteResult.message);
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
