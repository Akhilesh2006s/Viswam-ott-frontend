// API Configuration
// Point to the deployed Railway backend server
export const API_BASE_URL = 'https://viswam-ott-backend-production-812b.up.railway.app';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    SCHOOL_LOGIN: `${API_BASE_URL}/api/auth/school/login`,
    SUPER_ADMIN_LOGIN: `${API_BASE_URL}/api/auth/super-admin/login`,
    SCHOOL_ME: `${API_BASE_URL}/api/auth/school/me`,
  },
  // Videos
  VIDEOS: {
    BASE: `${API_BASE_URL}/api/videos`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/videos/${id}`,
    DOWNLOAD: (id: string) => `${API_BASE_URL}/api/videos/${id}/download`,
  },
  // Subjects
  SUBJECTS: {
    BASE: `${API_BASE_URL}/api/subjects`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/subjects/${id}`,
    VIDEOS: (id: string) => `${API_BASE_URL}/api/subjects/${id}/videos`,
  },
  // Schools
  SCHOOLS: {
    BASE: `${API_BASE_URL}/api/schools`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/schools/${id}`,
    DASHBOARD: `${API_BASE_URL}/api/schools/dashboard`,
  },
  // Reports
  REPORTS: {
    BASE: `${API_BASE_URL}/api/reports`,
    SUBJECT_WISE: `${API_BASE_URL}/api/reports/subject-wise`,
  },
  // Downloads
  DOWNLOADS: {
    REQUESTS: `${API_BASE_URL}/api/downloads/requests`,
  },
  // Dashboard
  DASHBOARD: {
    STATS: `${API_BASE_URL}/api/dashboard/stats`,
  },
};
