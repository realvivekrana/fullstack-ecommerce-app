export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  images?: string[]
  category: string
  brand: string
  rating: number
  reviews: number
  inStock: boolean
  specifications?: Record<string, string>
  features?: string[]
}

export interface CartItem extends Product {
  quantity: number
}

export interface Category {
  id: string
  name: string
  image: string
  slug: string
}

export interface Review {
  id: string
  productId: string
  userName: string
  rating: number
  comment: string
  date: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Address {
  id: string
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  date: string
  shippingAddress: Address
}
