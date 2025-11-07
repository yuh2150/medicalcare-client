import { apiClient } from './config';
import { DashboardStats, ChartData, Activity, Patient } from '../types/admin';

export const dashboardApi = {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await apiClient.get('/medicalcare/api/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      // Return default stats if API fails
      return {
        orders: { total: 0, today: 0, growth: 0 },
        revenue: { total: 0, today: 0, growth: 0 },
        patients: { total: 0, new: 0, growth: 0 },
        bookings: { total: 0, today: 0, pending: 0 }
      };
    }
  },

  async getChartData(period?: string): Promise<ChartData[]> {
    try {
      const response = await apiClient.get('/medicalcare/api/dashboard/chart', {
        params: { period }
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error loading chart data:', error);
      return [];
    }
  },

  async getRecentActivities(limit = 10): Promise<Activity[]> {
    try {
      const response = await apiClient.get('/medicalcare/api/dashboard/activities', {
        params: { limit }
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error loading recent activities:', error);
      return [];
    }
  },

  async getPatients(filter: { page?: number; limit?: number }): Promise<{
    data: Patient[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    try {
      const response = await apiClient.get('/medicalcare/api/patients', { params: filter });
      
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
    } catch (error) {
      console.error('Error loading patients:', error);
      return {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      };
    }
  }
};
