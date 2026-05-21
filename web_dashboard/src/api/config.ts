export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.1.2:8000';

export const endpoints = {
  login: `${API_BASE_URL}/login`,
  containers: `${API_BASE_URL}/containers`,
  dumpReports: `${API_BASE_URL}/dump-reports`,
  reports: `${API_BASE_URL}/report`,
};
