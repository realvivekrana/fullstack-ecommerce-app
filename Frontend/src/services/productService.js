import axiosInstance from './axiosInstance';

// Matches backend routes exactly (see backend/routes/productRoutes.js)
export const productService = {
  getAllProducts: (params) => axiosInstance.get('/products', { params }),
  getProductById: (id) => axiosInstance.get(`/products/${id}`),
  getFeaturedProducts: () => axiosInstance.get('/products/featured'),
  getBestSellers: () => axiosInstance.get('/products/best-sellers'),
  getFlashSaleProducts: () => axiosInstance.get('/products/flash-sale'),
  getRelatedProducts: (id) => axiosInstance.get(`/products/${id}/related`),
  searchProducts: (keyword) => axiosInstance.get('/products', { params: { keyword } }),
};