import apiClient from './apiClient';

const CUSTOMER_API_BASE = '/customer-api';

export const customerService = {
  // Register new customer
  register: async (userData: {
    emailId: string;
    name: string;
    password: string;
    phoneNumber: string;
    address: string;
  }) => {
    return apiClient.post(`${CUSTOMER_API_BASE}/register`, userData);
  },

  // Login
  login: async (credentials: {
    emailId: string;
    password: string;
  }) => {
    return apiClient.post(`${CUSTOMER_API_BASE}/login`, credentials);
  },

  // Get customer profile
  getProfile: async () => {
    return apiClient.get(`${CUSTOMER_API_BASE}/profile`);
  },

  // Update customer profile
  updateProfile: async (profileData: {
    name: string;
    phoneNumber: string;
    address: string;
  }) => {
    return apiClient.put(`${CUSTOMER_API_BASE}/profile`, profileData);
  },

  // Get auth token from localStorage
  getAuthToken: () => {
    return localStorage.getItem('authToken');
  },

  // Save auth token to localStorage
  setAuthToken: (token: string) => {
    localStorage.setItem('authToken', token);
  },

  // Remove auth token
  removeAuthToken: () => {
    localStorage.removeItem('authToken');
  },

  // Save user data to localStorage
  setUser: (user: any) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Get user data from localStorage
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};

export default customerService;
