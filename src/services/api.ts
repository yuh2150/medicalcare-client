import type { Specialist, Doctor, News } from '@/types';
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

// Mock news data for demonstration
const mockNews: News[] = [
  {
    id: '1',
    title: '10 Essential Health Tips for a Better Life',
    excerpt: 'Discover simple yet effective ways to improve your overall health and well-being with these expert-recommended tips.',
    publishedAt: '2025-01-15T08:00:00Z',
    author: 'Dr. Sarah Johnson',
    tags: ['Wellness', 'Prevention', 'Lifestyle']
  },
  {
    id: '2',
    title: 'Understanding Heart Health: Prevention is Key',
    excerpt: 'Learn about the importance of cardiovascular health and how to maintain a healthy heart through diet, exercise, and regular check-ups.',
    publishedAt: '2025-01-12T10:30:00Z',
    author: 'Dr. Michael Chen',
    tags: ['Cardiology', 'Prevention', 'Heart Health']
  },
  {
    id: '3',
    title: 'Mental Health Awareness: Breaking the Stigma',
    excerpt: 'Exploring the importance of mental health care and how to seek help when needed. Mental wellness is just as important as physical health.',
    publishedAt: '2025-01-10T14:15:00Z',
    author: 'Dr. Emily Davis',
    tags: ['Mental Health', 'Wellness', 'Awareness']
  },
  {
    id: '4',
    title: 'Pediatric Care: Keeping Your Children Healthy',
    excerpt: 'Essential information for parents about child health, vaccinations, and developmental milestones to watch for.',
    publishedAt: '2025-01-08T09:00:00Z',
    author: 'Dr. Robert Wilson',
    tags: ['Pediatrics', 'Children', 'Parenting']
  }
];

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
      const latestNews = mockNews.slice(0, 4);

      return {
        featuredSpecialists,
        featuredDoctors,
        latestNews,
      };
    } catch (error) {
      console.error('Error fetching home data:', error);
      // Return mock data if API fails
      return {
        featuredSpecialists: [],
        featuredDoctors: [],
        latestNews: mockNews.slice(0, 4),
      };
    }
  },
};