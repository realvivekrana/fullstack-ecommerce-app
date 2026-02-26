'use client'

import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductImage from '@/components/ProductImage'
import { useCart } from '@/context/CartContext'
import { getPrimaryImage } from '@/lib/image-utils'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart()

  if (cart.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Add some products to get started</p>
          <Link href="/shop" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart ({cart.length} items)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const itemImage = getPrimaryImage(item)
              const itemTotal = item.price * item.quantity
              
              return (
                <div key={item.id} className="card p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <ProductImage
                        src={itemImage}
                        alt={item.name}
                        fill
                        sizes="96px"
                        category={item.category}
                        className="rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.id}`}>
                        <h3 className="font-semibold text-lg hover:text-primary-600 transition truncate">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.brand}</p>
                      <p className="text-lg font-bold text-primary-600 mt-2">${item.price.toFixed(2)}</p>
                      {item.quantity > 1 && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Subtotal: ${itemTotal.toFixed(2)}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-start">
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                        aria-label="Remove from cart"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax (10%)</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    ${(cartTotal * 0.1).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-600">${(cartTotal * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="input-field mb-2"
                />
                <button className="w-full btn-secondary">Apply Coupon</button>
              </div>

              <Link href="/checkout" className="block w-full btn-primary text-center mb-3">
                Proceed to Checkout
              </Link>

              <Link 
                href="/shop" 
                className="block w-full text-center py-2 text-primary-600 hover:text-primary-700 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
