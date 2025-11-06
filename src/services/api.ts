import type { Specialist, Doctor } from '@/types';
import { API_CONFIG } from '@/constants/api';

// Simple fetch functions for getting data from backend
export const fetchSpecialists = async (): Promise<Specialist[]> => {
  const response = await fetch(`${API_CONFIG.BASE_URL}/api/specialists`);
  if (!response.ok) {
    throw new Error('Failed to fetch specialists');
  }
  return response.json();
};

export const fetchDoctors = async (): Promise<Doctor[]> => {
  const response = await fetch(`${API_CONFIG.BASE_URL}/api/doctors`);
  if (!response.ok) {
    throw new Error('Failed to fetch doctors');
  }
  return response.json();
};

// Home page data aggregation
export const homeApi = {
  // Get data for home page (featured specialists and doctors)
  getHomeData: async () => {
    try {
      const [specialists, doctors] = await Promise.all([
        fetchSpecialists(),
        fetchDoctors(),
      ]);

      // Take first 6 items as featured
      const featuredSpecialists = specialists.slice(0, 6);
      const featuredDoctors = doctors.slice(0, 6);

      return {
        featuredSpecialists,
        featuredDoctors,
        latestNews: [], // Placeholder for news - add news API later if needed
      };
    } catch (error) {
      console.error('Error fetching home data:', error);
      throw error;
    }
  },
};