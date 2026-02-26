/**
 * Image utility functions for handling product images
 */

// Default placeholder images by category
export const DEFAULT_IMAGES = {
  electronics: [
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
  ],
  fashion: [
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800',
    'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800',
  ],
  beauty: [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
  ],
  'home & living': [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
  ],
  books: [
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
  ],
  sports: [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800',
  ],
  default: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
  ],
}

/**
 * Get default images for a category
 */
export function getDefaultImages(category?: string): string[] {
  if (!category) return DEFAULT_IMAGES.default
  
  const normalizedCategory = category.toLowerCase()
  
  if (normalizedCategory.includes('electronic') || normalizedCategory.includes('tech')) {
    return DEFAULT_IMAGES.electronics
  }
  if (normalizedCategory.includes('fashion') || normalizedCategory.includes('clothing') || normalizedCategory.includes('apparel')) {
    return DEFAULT_IMAGES.fashion
  }
  if (normalizedCategory.includes('beauty') || normalizedCategory.includes('cosmetic')) {
    return DEFAULT_IMAGES.beauty
  }
  if (normalizedCategory.includes('home') || normalizedCategory.includes('living') || normalizedCategory.includes('furniture')) {
    return DEFAULT_IMAGES['home & living']
  }
  if (normalizedCategory.includes('book')) {
    return DEFAULT_IMAGES.books
  }
  if (normalizedCategory.includes('sport') || normalizedCategory.includes('fitness')) {
    return DEFAULT_IMAGES.sports
  }
  
  return DEFAULT_IMAGES.default
}

/**
 * Ensure product has valid images
 */
export function ensureProductImages(product: any): any {
  if (!product) return product
  
  // If images array is empty or missing, use default images
  if (!product.images || product.images.length === 0) {
    product.images = getDefaultImages(product.category)
  }
  
  // Filter out invalid URLs and ensure at least 2 images
  product.images = product.images.filter((img: string) => img && typeof img === 'string' && img.trim() !== '')
  
  if (product.images.length === 0) {
    product.images = getDefaultImages(product.category)
  }
  
  // Ensure at least 2 images for gallery
  if (product.images.length === 1) {
    const defaults = getDefaultImages(product.category)
    product.images.push(defaults[1] || defaults[0])
  }
  
  return product
}

/**
 * Get primary product image
 */
export function getPrimaryImage(product: any): string {
  if (product?.images && product.images.length > 0) {
    return product.images[0]
  }
  if (product?.image) {
    return product.image
  }
  return getDefaultImages(product?.category)[0]
}

/**
 * Get all product images
 */
export function getProductImages(product: any): string[] {
  if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
    return product.images
  }
  if (product?.image) {
    return [product.image]
  }
  return getDefaultImages(product?.category)
}

/**
 * Handle image error with fallback
 */
export function getImageWithFallback(imageUrl: string, category?: string): string {
  if (!imageUrl || imageUrl.trim() === '') {
    return getDefaultImages(category)[0]
  }
  return imageUrl
}

/**
 * Validate image URL
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false
  
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Generate placeholder image URL
 */
export function getPlaceholderImage(width: number = 800, height: number = 800, text: string = 'Product'): string {
  return `https://placehold.co/${width}x${height}/e0e0e0/666666?text=${encodeURIComponent(text)}`
}
