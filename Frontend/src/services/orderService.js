import axiosInstance from './axiosInstance';

// Placeholder API methods — backend not implemented yet.

export const orderService = {
  createOrder: (orderData) => axiosInstance.post('/orders', orderData),
  getMyOrders: () => axiosInstance.get('/orders/my-orders'),
  getOrderById: (id) => axiosInstance.get(`/orders/${id}`),
  cancelOrder: (id) => axiosInstance.patch(`/orders/${id}/cancel`),
};
