export const ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  PRODUCT_DETAILS: '/product/:id',
  SEARCH: '/search',
  CART: '/cart',
  WISHLIST: '/wishlist',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  PROFILE: '/profile',
  ABOUT: '/about',
  CONTACT: '/contact',
  NOT_FOUND: '*',
};

export const productPath = (id) => `/product/${id}`;
