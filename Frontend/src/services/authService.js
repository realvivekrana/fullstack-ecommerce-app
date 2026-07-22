import axiosInstance from './axiosInstance';

export const authService = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  register: (userData) => axiosInstance.post('/auth/register', userData),
  logout: () => axiosInstance.post('/auth/logout'),
  forgotPassword: (email) => axiosInstance.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) =>
    axiosInstance.post('/auth/reset-password', { token, newPassword }),
  getProfile: () => axiosInstance.get('/auth/profile'),
  updateProfile: (data) => axiosInstance.put('/auth/profile', data),

  // Address management
  addAddress: (data) => axiosInstance.post('/auth/addresses', data),
  updateAddress: (addressId, data) => axiosInstance.put(`/auth/addresses/${addressId}`, data),
  deleteAddress: (addressId) => axiosInstance.delete(`/auth/addresses/${addressId}`),
};