'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Minus, Plus } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import ProductImage from '@/components/ProductImage'
import { productsAPI } from '@/lib/api-client'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { getProductImages, ensureProductImages } from '@/lib/image-utils'

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { addToWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await productsAPI.getById(params.id as string)
      let productData = response.data.data
      
      // Ensure product has valid images
      productData = ensureProductImages(productData)
      setProduct(productData)

      // Fetch related products
      const relatedRes = await productsAPI.getAll({ 
        category: productData.category,
        limit: 4 
      })
      const related = relatedRes.data.data.products
        .filter((p: any) => p._id !== productData._id)
        .map((p: any) => ensureProductImages(p))
      setRelatedProducts(related)
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="bg-gray-200 dark:bg-gray-700 h-[500px] rounded-lg animate-pulse" />
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-gray-200 dark:bg-gray-700 h-24 rounded animate-pulse" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-200 dark:bg-gray-700 h-8 w-3/4 rounded animate-pulse" />
              <div className="bg-gray-200 dark:bg-gray-700 h-6 w-1/2 rounded animate-pulse" />
              <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <p className="text-gray-600 dark:text-gray-400">The product you're looking for doesn't exist.</p>
        </div>
        <Footer />
      </div>
    )
  }

  const images = getProductImages(product)
  const inStock = product.stock !== undefined ? product.stock > 0 : product.inStock

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="card overflow-hidden mb-4 relative h-[500px]">
              <ProductImage
                src={images[selectedImage]}
                alt={product.title || product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                category={product.category}
                objectFit="cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`card overflow-hidden relative h-24 ${selectedImage === idx ? 'ring-2 ring-primary-500' : ''}`}
                >
                  <ProductImage
                    src={img}
                    alt={`${product.title || product.name} ${idx + 1}`}
                    fill
                    sizes="150px"
                    category={product.category}
                    objectFit="cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.brand}</p>
            <h1 className="text-3xl font-bold mb-4">{product.title || product.name}</h1>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {product.rating} ({product.reviews?.length || 0} reviews)
              </span>
            </div>

            <div className="flex items-center mb-6">
              <span className="text-4xl font-bold text-primary-600">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="ml-4 text-xl text-gray-500 line-through">${product.originalPrice}</span>
                  <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                    Save {product.discount}%
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6">{product.description}</p>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="font-semibold">Quantity:</span>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-6 py-2 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mb-8">
              <button 
                onClick={handleAddToCart} 
                disabled={!inStock}
                className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>
              <button
                onClick={() => addToWishlist(product)}
                className={`btn-secondary ${isInWishlist(product._id || product.id) ? 'bg-red-500 text-white' : ''}`}
              >
                <Heart className="h-5 w-5" fill={isInWishlist(product._id || product.id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Truck className="h-8 w-8 text-primary-600 mb-2" />
                <p className="text-sm font-semibold">Free Delivery</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Shield className="h-8 w-8 text-primary-600 mb-2" />
                <p className="text-sm font-semibold">2 Year Warranty</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <RotateCcw className="h-8 w-8 text-primary-600 mb-2" />
                <p className="text-sm font-semibold">30 Day Returns</p>
              </div>
            </div>

            {/* Specifications */}
            {product.specifications && (
              <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">Specifications</h3>
                <dl className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <dt className="font-semibold">{key}</dt>
                      <dd className="text-gray-600 dark:text-gray-400">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  )
}
