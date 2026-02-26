'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12 sm:mt-16 lg:mt-20 safe-bottom">
      <div className="max-w-7xl mx-auto container-padding py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="text-center sm:text-left">
            <h3 className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4">Premium Store</h3>
            <p className="text-xs sm:text-sm mb-3 sm:mb-4">Your trusted destination for quality products and exceptional service.</p>
            <div className="flex space-x-4 justify-center sm:justify-start">
              <a href="#" className="hover:text-white transition touch-manipulation" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition touch-manipulation" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition touch-manipulation" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition touch-manipulation" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/shop" className="hover:text-white transition">Shop</Link></li>
              <li><Link href="/deals" className="hover:text-white transition">Deals</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="text-center sm:text-left">
            <h3 className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4">Customer Service</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link href="/help" className="hover:text-white transition">Help Center</Link></li>
              <li><Link href="/returns" className="hover:text-white transition">Returns</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition">Shipping Info</Link></li>
              <li><Link href="/track" className="hover:text-white transition">Track Order</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="text-center sm:text-left">
            <h3 className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4">Newsletter</h3>
            <p className="text-xs sm:text-sm mb-3 sm:mb-4">Subscribe for exclusive deals and updates</p>
            <div className="flex max-w-sm mx-auto sm:mx-0">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 text-sm rounded-l-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button 
                className="bg-primary-600 hover:bg-primary-700 active:bg-primary-800 px-3 sm:px-4 py-2 rounded-r-lg transition touch-manipulation"
                aria-label="Subscribe"
              >
                <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-xs sm:text-sm text-center">
          <p>&copy; 2024 Premium Store. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
