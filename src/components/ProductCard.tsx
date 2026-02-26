'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { motion } from 'framer-motion'
import ProductImage from './ProductImage'
import { getPrimaryImage } from '@/lib/image-utils'

interface ProductCardProps {
  product: any
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const inWishlist = isInWishlist(product._id || product.id)

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    if (isAddingToCart) return
    
    setIsAddingToCart(true)
    try {
      await addToCart(product)
    } finally {
      setTimeout(() => setIsAddingToCart(false), 500)
    }
  }, [addToCart, product, isAddingToCart])

  const handleWishlistToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    if (inWishlist) {
      removeFromWishlist(product._id || product.id)
    } else {
      addToWishlist(product)
    }
  }, [inWishlist, product, addToWishlist, removeFromWishlist])

  const productId = product._id || product.id
  const productImage = getPrimaryImage(product)
  const productStock = product.stock !== undefined ? product.stock : (product.inStock ? 100 : 0)
  const isInStock = productStock > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card group overflow-hidden touch-manipulation"
    >
      <div className="relative overflow-hidden h-48 sm:h-56 md:h-64">
        <Link href={`/product/${productId}`}>
          <ProductImage
            src={productImage}
            alt={product.title || product.name}
            fill
            className="group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            category={product.category}
          />
        </Link>
        
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs sm:text-sm font-bold z-10">
            -{product.discount}%
          </div>
        )}

        {!isInStock && (
          <div className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded text-xs sm:text-sm z-10">
            Out of Stock
          </div>
        )}

        {product.featured && !product.discount && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs sm:text-sm font-bold z-10">
            Featured
          </div>
        )}

        <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={handleWishlistToggle}
            className={`p-1.5 sm:p-2 rounded-full ${inWishlist ? 'bg-red-500 text-white' : 'bg-white'} shadow-lg hover:scale-110 transition touch-manipulation`}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className="h-4 w-4 sm:h-5 sm:w-5" fill={inWishlist ? 'currentColor' : 'none'} />
          </button>
          <Link
            href={`/product/${productId}`}
            className="p-1.5 sm:p-2 bg-white rounded-full shadow-lg hover:scale-110 transition touch-manipulation"
            aria-label="Quick view"
          >
            <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{product.brand}</p>
        <Link href={`/product/${productId}`}>
          <h3 className="font-semibold text-sm sm:text-base lg:text-lg mt-1 hover:text-primary-600 transition line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
            {product.title || product.name}
          </h3>
        </Link>

        <div className="flex items-center mt-2">
          <div className="flex items-center">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-xs sm:text-sm">{product.rating?.toFixed(1) || '0.0'}</span>
          </div>
          <span className="ml-2 text-xs sm:text-sm text-gray-500">
            ({product.reviews?.length || 0})
          </span>
        </div>

        <div className="flex items-center justify-between mt-3 sm:mt-4">
          <div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-600">${product.price}</span>
            {product.originalPrice && (
              <span className="ml-2 text-xs sm:text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!isInStock || isAddingToCart}
          className="w-full mt-3 sm:mt-4 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 touch-manipulation"
        >
          <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-xs sm:text-sm">{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
        </button>
      </div>
    </motion.div>
  )
}
