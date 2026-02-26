'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Award, Users, TrendingUp, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">About Premium Store</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Your trusted destination for quality products and exceptional service since 2020
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="card p-6 text-center">
            <Award className="h-12 w-12 mx-auto text-primary-600 mb-4" />
            <h3 className="font-bold text-2xl mb-2">10K+</h3>
            <p className="text-gray-600 dark:text-gray-400">Products</p>
          </div>

          <div className="card p-6 text-center">
            <Users className="h-12 w-12 mx-auto text-primary-600 mb-4" />
            <h3 className="font-bold text-2xl mb-2">50K+</h3>
            <p className="text-gray-600 dark:text-gray-400">Happy Customers</p>
          </div>

          <div className="card p-6 text-center">
            <TrendingUp className="h-12 w-12 mx-auto text-primary-600 mb-4" />
            <h3 className="font-bold text-2xl mb-2">100K+</h3>
            <p className="text-gray-600 dark:text-gray-400">Orders Delivered</p>
          </div>

          <div className="card p-6 text-center">
            <Heart className="h-12 w-12 mx-auto text-primary-600 mb-4" />
            <h3 className="font-bold text-2xl mb-2">4.8/5</h3>
            <p className="text-gray-600 dark:text-gray-400">Customer Rating</p>
          </div>
        </div>

        <div className="card p-12 mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p>
              Founded in 2020, Premium Store started with a simple mission: to provide high-quality products
              at competitive prices with exceptional customer service.
            </p>
            <p>
              Today, we've grown to serve over 50,000 happy customers worldwide, offering a curated selection
              of products across multiple categories including electronics, fashion, home goods, and more.
            </p>
            <p>
              Our commitment to quality, authenticity, and customer satisfaction has made us one of the most
              trusted online retailers in the industry.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-6">
            <h3 className="font-bold text-xl mb-4">Our Mission</h3>
            <p className="text-gray-600 dark:text-gray-400">
              To make quality products accessible to everyone while providing an exceptional shopping experience.
            </p>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-xl mb-4">Our Vision</h3>
            <p className="text-gray-600 dark:text-gray-400">
              To become the world's most customer-centric online retailer where people can find anything they want.
            </p>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-xl mb-4">Our Values</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Quality, integrity, customer satisfaction, and continuous innovation drive everything we do.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
