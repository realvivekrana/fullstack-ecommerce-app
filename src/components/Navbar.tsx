'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, User, Search, Menu, X, Heart, Sun, Moon, LogOut } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { categoriesAPI } from '@/lib/api-client'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const { cartCount } = useCart()
  const { wishlist } = useWishlist()
  const { isDark, toggleTheme } = useTheme()
  const { user, logout, isAuthenticated } = useAuth()

  useEffect(() => {
    fetchCategories()
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) setIsMenuOpen(false)
      if (showUserMenu) setShowUserMenu(false)
    }
    
    if (isMenuOpen || showUserMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isMenuOpen, showUserMenu])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll().catch(() => ({ data: { data: [] } }))
      setCategories(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      setCategories([])
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md safe-top">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">P</span>
            </div>
            <span className="text-base sm:text-xl font-bold hidden xs:block">Premium Store</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <Link href="/" className="hover:text-primary-600 transition text-sm xl:text-base">Home</Link>
            <Link href="/shop" className="hover:text-primary-600 transition text-sm xl:text-base">Shop</Link>
            <Link href="/deals" className="hover:text-primary-600 transition text-sm xl:text-base">Deals</Link>
            <Link href="/about" className="hover:text-primary-600 transition text-sm xl:text-base">About</Link>
            <Link href="/contact" className="hover:text-primary-600 transition text-sm xl:text-base">Contact</Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)} 
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg touch-manipulation"
              aria-label="Search"
            >
              <Search className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            
            <button 
              onClick={toggleTheme} 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg touch-manipulation hidden sm:block"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <Link 
              href="/wishlist" 
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg touch-manipulation"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-medium">
                  {wishlist.length > 9 ? '9+' : wishlist.length}
                </span>
              )}
            </Link>

            <Link 
              href="/cart" 
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg touch-manipulation"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-medium">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowUserMenu(!showUserMenu)
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg touch-manipulation relative"
                aria-label="User menu"
              >
                <User className="h-5 w-5 sm:h-6 sm:w-6" />
                {isAuthenticated && (
                  <div className="absolute top-0 right-0 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                )}
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div 
                  className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 w-48 sm:w-56 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-semibold text-sm truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link 
                        href="/dashboard" 
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        href="/orders" 
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Orders
                      </Link>
                      {user?.role === 'admin' && (
                        <Link 
                          href="/admin" 
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-primary-600 text-sm"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button 
                        onClick={() => {
                          logout()
                          setShowUserMenu(false)
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 text-red-600 text-sm"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <Link 
                      href="/login" 
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Login / Register
                    </Link>
                  )}
                </div>
              )}
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation()
                setIsMenuOpen(!isMenuOpen)
              }} 
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg touch-manipulation"
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
                autoFocus
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div 
        className={`fixed top-14 sm:top-16 right-0 bottom-0 w-64 sm:w-80 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full overflow-y-auto safe-bottom">
          <div className="p-4 space-y-2">
            <Link 
              href="/" 
              className="block py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              className="block py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link 
              href="/deals" 
              className="block py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Deals
            </Link>
            <Link 
              href="/about" 
              className="block py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="block py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 sm:hidden">
              <button 
                onClick={() => {
                  toggleTheme()
                  setIsMenuOpen(false)
                }}
                className="w-full flex items-center justify-between py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <span>Theme</span>
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8 overflow-x-auto py-2 sm:py-3 scrollbar-hide">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat._id}
                href={`/shop?category=${cat.name}`}
                className="text-xs sm:text-sm whitespace-nowrap hover:text-primary-600 transition touch-manipulation py-1"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </nav>
  )
}
