import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient

// Auth API
export const authAPI = {
  register: (data: any) => apiClient.post('/auth/register', data),
  login: (data: any) => apiClient.post('/auth/login', data),
  getMe: () => apiClient.get('/auth/me'),
}

// Products API
export const productsAPI = {
  getAll: (params?: any) => apiClient.get('/products', { params }),
  getById: (id: string) => apiClient.get(`/products/${id}`),
  create: (data: any) => apiClient.post('/products', data),
  update: (id: string, data: any) => apiClient.put(`/products/${id}`, data),
  delete: (id: string) => apiClient.delete(`/products/${id}`),
  addReview: (id: string, data: any) => apiClient.post(`/products/${id}/reviews`, data),
}

// Cart API
export const cartAPI = {
  get: () => apiClient.get('/cart'),
  add: (productId: string, quantity?: number) => apiClient.post('/cart', { productId, quantity }),
  update: (productId: string, quantity: number) => apiClient.put('/cart', { productId, quantity }),
  remove: (productId: string) => apiClient.delete(`/cart?productId=${productId}`),
}

// Wishlist API
export const wishlistAPI = {
  get: () => apiClient.get('/wishlist'),
  add: (productId: string) => apiClient.post('/wishlist', { productId }),
  remove: (productId: string) => apiClient.delete(`/wishlist?productId=${productId}`),
}

// Orders API
export const ordersAPI = {
  getAll: () => apiClient.get('/orders'),
  getById: (id: string) => apiClient.get(`/orders/${id}`),
  create: (data: any) => apiClient.post('/orders', data),
  updateStatus: (id: string, data: any) => apiClient.put(`/orders/${id}`, data),
}

// Categories API
export const categoriesAPI = {
  getAll: () => apiClient.get('/categories'),
  create: (data: any) => apiClient.post('/categories', data),
}
