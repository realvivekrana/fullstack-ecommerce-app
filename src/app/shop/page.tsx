'use client'

import { useState, useEffect, useCallback } from 'react'
import { Filter, X, ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { ProductGridSkeleton } from '@/components/LoadingSkeleton'
import DatabaseError from '@/components/DatabaseError'
import { useDebounce } from '@/hooks/useDebounce'
import { productsAPI } from '@/lib/api-client'

export default function ShopPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('popularity')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 })
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [dbError, setDbError] = useState(false)

  const debouncedSearch = useDebounce(searchQuery, 500)

  // Fetch categories
  useEffect(() => {
    fetchCategories()
  }, [])

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, priceRange, selectedBrands, minRating, sortBy, debouncedSearch, currentPage])

  const fetchCategories = async () => {
    try {
      const response = await productsAPI.getAll({ limit: 1000 })
      const allProducts = response.data.data.products || []
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(allProducts.map((p: any) => p.category)))
      setCategories(uniqueCategories.map((name) => ({ 
        name: name as string, 
        slug: (name as string).toLowerCase().replace(/\s+/g, '-') 
      })))
      
      // Extract unique brands
      const uniqueBrands = Array.from(new Set(allProducts.map((p: any) => p.brand)))
      setBrands(uniqueBrands as string[])
    } catch (error: any) {
      console.error('Failed to fetch categories:', error)
      if (error.code === 'ERR_NETWORK' || error.message?.includes('ECONNREFUSED')) {
        setDbError(true)
      }
      setCategories([])
      setBrands([])
    }
  }

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = {
        page: currentPage,
        limit: 12,
      }

      if (selectedCategory) params.category = selectedCategory
      if (priceRange[0] > 0) params.minPrice = priceRange[0]
      if (priceRange[1] < 2000) params.maxPrice = priceRange[1]
      if (selectedBrands.length > 0) params.brand = selectedBrands[0] // API supports single brand
      if (minRating > 0) params.minRating = minRating
      if (debouncedSearch) params.search = debouncedSearch
      
      // Map sort options
      const sortMap: any = {
        'popularity': 'popularity',
        'price-low': 'price-asc',
        'price-high': 'price-desc',
        'rating': 'rating',
        'newest': 'newest',
      }
      params.sort = sortMap[sortBy] || 'popularity'

      const response = await productsAPI.getAll(params)
      const productsData = response.data.data.products || []
      
      // Ensure all products have valid images
      const { ensureProductImages } = await import('@/lib/image-utils')
      const productsWithImages = productsData.map((p: any) => ensureProductImages(p))
      
      setProducts(productsWithImages)
      setPagination(response.data.data.pagination || { page: 1, limit: 12, total: 0, pages: 1 })
      setDbError(false)
    } catch (error: any) {
      console.error('Failed to fetch products:', error)
      if (error.code === 'ERR_NETWORK' || error.message?.includes('ECONNREFUSED')) {
        setDbError(true)
      }
      setProducts([])
      setPagination({ page: 1, limit: 12, total: 0, pages: 1 })
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, priceRange, selectedBrands, minRating, sortBy, debouncedSearch, currentPage])

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setPriceRange([0, 2000])
    setSelectedBrands([])
    setMinRating(0)
    setSearchQuery('')
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (dbError) {
    return <DatabaseError />
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto container-padding py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 lg:mb-8 gap-3">
          <div className="w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl font-bold">Shop All Products</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
              Discover our collection of {pagination.total} products
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden btn-secondary flex items-center space-x-2 w-full sm:w-auto justify-center"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="input-field max-w-full sm:max-w-md"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden lg:block'} lg:w-64 w-full`}>
            <div className="card p-4 sm:p-6 lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold">Filters</h2>
                <button onClick={() => setShowFilters(false)} className="lg:hidden touch-manipulation">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Category</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === ''}
                      onChange={() => {
                        setSelectedCategory('')
                        setCurrentPage(1)
                      }}
                      className="mr-2"
                    />
                    All Categories
                  </label>
                  {categories.map(cat => (
                    <label key={cat.name} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat.name}
                        onChange={() => {
                          setSelectedCategory(cat.name)
                          setCurrentPage(1)
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    value={priceRange[1]}
                    onChange={(e) => {
                      setPriceRange([0, parseInt(e.target.value)])
                      setCurrentPage(1)
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Brand</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {brands.slice(0, 20).map(brand => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="mr-2"
                      />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Minimum Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1, 0].map(rating => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === rating}
                        onChange={() => {
                          setMinRating(rating)
                          setCurrentPage(1)
                        }}
                        className="mr-2"
                      />
                      {rating > 0 ? `${rating}+ Stars` : 'All Ratings'}
                    </label>
                  ))}
                </div>
              </div>

              <button onClick={clearFilters} className="w-full btn-secondary">
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Showing {products.length} of {pagination.total} products
              </p>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value)
                  setCurrentPage(1)
                }}
                className="input-field w-full sm:w-auto text-sm sm:text-base"
              >
                <option value="popularity">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {loading ? (
              <ProductGridSkeleton count={12} />
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-12">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                      let pageNum
                      if (pagination.pages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 rounded-lg ${
                            currentPage === pageNum
                              ? 'bg-primary-600 text-white'
                              : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.pages}
                      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">No products found matching your filters</p>
                <button onClick={clearFilters} className="btn-primary mt-4">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
