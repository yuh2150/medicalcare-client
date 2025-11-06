// Main API exports
export { authApi } from './authApi';
export { userAuthApi } from './userAuthApi';
export { userApi } from './userApi';
export { doctorApi } from './doctorApi';
export { specialistApi } from './specialistApi';
export { orderApi } from './orderApi';
export { dashboardApi } from './dashboardApi';
export { adminApi } from './adminApi';
export { TokenManager, apiClient, adminApiClient } from './config';

// Backward compatibility
export { adminApi as default } from './adminApi';
