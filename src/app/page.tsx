'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { productsAPI, categoriesAPI } from '@/lib/api-client'
import { motion } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post('/api/newsletter', { email })
      toast.success('Successfully subscribed to newsletter!')
      setEmail('')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to subscribe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto flex">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 px-6 py-3 rounded-l-lg text-gray-900 focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-gray-900 hover:bg-gray-800 px-8 py-3 rounded-r-lg font-medium transition disabled:opacity-50"
      >
        {loading ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  )
}

const heroSlides = [
  {
    title: 'Summer Sale 2024',
    subtitle: 'Up to 50% off on selected items',
    cta: 'Shop Now',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
  },
  {
    title: 'New Arrivals',
    subtitle: 'Discover the latest trends',
    cta: 'Explore',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
  },
  {
    title: 'Premium Electronics',
    subtitle: 'Tech that makes a difference',
    cta: 'View Collection',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200',
  },
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productsAPI.getAll({ featured: 'true', limit: 8 }).catch(() => ({ data: { data: { products: [] } } })),
        categoriesAPI.getAll().catch(() => ({ data: { data: [] } })),
      ])
      
      const productsData = productsRes.data.data.products || []
      
      // Ensure all products have valid images
      const { ensureProductImages } = await import('@/lib/image-utils')
      const productsWithImages = productsData.map((p: any) => ensureProductImages(p))
      
      setProducts(productsWithImages)
      setCategories(categoriesRes.data.data || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setProducts([])
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            <div className="absolute inset-0 flex items-center justify-center text-center text-white container-padding">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl"
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-4">
                  {slide.title}
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-4 sm:mb-6 lg:mb-8">
                  {slide.subtitle}
                </p>
                <Link href="/shop" className="btn-primary inline-block">
                  {slide.cta}
                </Link>
              </motion.div>
            </div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 p-1.5 sm:p-2 rounded-full transition touch-manipulation"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 p-1.5 sm:p-2 rounded-full transition touch-manipulation"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition touch-manipulation ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto container-padding section-spacing">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Shop by Category</h2>
        {loading ? (
          <div className="text-center py-8">
            <p className="text-sm sm:text-base">Loading categories...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/shop?category=${category.slug}`}
                className="card overflow-hidden group touch-manipulation"
              >
                <div className="relative h-32 sm:h-36 lg:h-40">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 sm:p-4 text-center">
                  <h3 className="font-semibold text-sm sm:text-base truncate">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto container-padding section-spacing">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold">Featured Products</h2>
          <Link href="/shop" className="text-primary-600 hover:text-primary-700 font-medium text-sm sm:text-base">
            View All →
          </Link>
        </div>
        {loading ? (
          <div className="text-center py-8">
            <p className="text-sm sm:text-base">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section className="bg-gray-100 dark:bg-gray-800 section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-4 sm:p-6">
                <div className="flex items-center mb-3 sm:mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-yellow-400 text-sm sm:text-base">★</span>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                  "Amazing quality and fast delivery! Highly recommend this store to everyone."
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm sm:text-base">Customer {i}</p>
                    <p className="text-xs sm:text-sm text-gray-500">Verified Buyer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto container-padding section-spacing">
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg sm:rounded-2xl p-6 sm:p-8 lg:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Subscribe to Our Newsletter</h2>
          <p className="mb-6 sm:mb-8 text-sm sm:text-base">Get exclusive deals and updates delivered to your inbox</p>
          <NewsletterForm />
        </div>
      </section>

      <Footer />

      {/* Back to Top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg transition z-50"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}
