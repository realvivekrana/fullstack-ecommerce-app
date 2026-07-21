import axiosInstance from './axiosInstance';

// Server-side cart (requires login) — see backend/routes/cartRoutes.js
export const cartService = {
  getCart: () => axiosInstance.get('/cart'),
  addToCart: (productId, quantity = 1) => axiosInstance.post('/cart', { productId, quantity }),
  updateCartItem: (productId, quantity) => axiosInstance.put(`/cart/${productId}`, { quantity }),
  removeCartItem: (productId) => axiosInstance.delete(`/cart/${productId}`),
  clearCart: () => axiosInstance.delete('/cart'),
};