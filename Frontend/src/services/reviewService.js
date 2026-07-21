import axiosInstance from './axiosInstance';

// Product reviews — see backend/routes/reviewRoutes.js
export const reviewService = {
  getProductReviews: (productId) => axiosInstance.get(`/products/${productId}/reviews`),
  createReview: (productId, data) => axiosInstance.post(`/products/${productId}/reviews`, data),
  deleteReview: (productId, reviewId) => axiosInstance.delete(`/products/${productId}/reviews/${reviewId}`),
};