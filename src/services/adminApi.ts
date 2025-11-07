// Import all APIs
import { authApi } from './authApi';
import { userApi } from './userApi';  
import { doctorApi } from './doctorApi';
import { specialistApi } from './specialistApi';
import { orderApi } from './orderApi';
import { dashboardApi } from './dashboardApi';

// Re-export individual APIs and utilities
export { authApi } from './authApi';
export { userApi } from './userApi';
export { doctorApi } from './doctorApi';
export { specialistApi } from './specialistApi';
export { orderApi } from './orderApi';
export { dashboardApi } from './dashboardApi';
export { TokenManager, adminApiClient } from './config';

// Export TokenManager as AdminTokenManager for backward compatibility
export { TokenManager as AdminTokenManager } from './config';

// Combined API object for backward compatibility
export const adminApi = {
  // Authentication
  login: authApi.login,
  logout: authApi.logout,
  
  // Dashboard
  getDashboardStats: dashboardApi.getDashboardStats,
  getChartData: dashboardApi.getChartData,
  getRecentActivities: dashboardApi.getRecentActivities,
  getPatients: dashboardApi.getPatients,
  
  // Users Management
  getUsers: userApi.getUsers,
  getUsersCount: userApi.getUsersCount,
  createUser: userApi.createUser,
  updateUser: userApi.updateUser,
  deleteUser: userApi.deleteUser,
  bulkAction: userApi.bulkAction,
  
  // Doctors Management
  getDoctors: doctorApi.getDoctors,
  getDoctorsBySpecialty: doctorApi.getDoctorsBySpecialty,
  createDoctor: doctorApi.createDoctor,
  updateDoctor: doctorApi.updateDoctor,
  deleteDoctor: doctorApi.deleteDoctor,
  
  // Specialists Management
  getSpecialists: specialistApi.getSpecialists,
  getSpecialistsCount: specialistApi.getSpecialistsCount,
  getSpecialist: specialistApi.getSpecialistById,
  createSpecialist: specialistApi.createSpecialist,
  updateSpecialist: specialistApi.updateSpecialist,
  deleteSpecialist: specialistApi.deleteSpecialist,

  // Orders Management
  getOrders: orderApi.getOrders,
  getOrdersCount: orderApi.getOrdersCount,
  getOrderById: orderApi.getOrderById,
  createOrder: orderApi.createOrder,
  updateOrder: orderApi.updateOrder,
  updateOrderStatus: orderApi.updateOrderStatus,
  deleteOrder: orderApi.deleteOrder
};

// Default export for backward compatibility
export default adminApi;
