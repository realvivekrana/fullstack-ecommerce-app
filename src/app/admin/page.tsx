'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/context/AuthContext'
import { productsAPI, ordersAPI } from '@/lib/api-client'
import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const { isAdmin, loading } = useAuth()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  })
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/')
    }
  }, [isAdmin, loading, router])

  useEffect(() => {
    if (isAdmin) {
      fetchData()
    }
  }, [isAdmin])

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        productsAPI.getAll(),
        ordersAPI.getAll(),
      ])

      const productsData = productsRes.data.data.products
      const ordersData = ordersRes.data.data

      setProducts(productsData)
      setOrders(ordersData)

      const totalRevenue = ordersData.reduce((sum: number, order: any) => sum + order.totalAmount, 0)
      const pendingOrders = ordersData.filter((order: any) => order.orderStatus === 'pending').length

      setStats({
        totalProducts: productsData.length,
        totalOrders: ordersData.length,
        totalRevenue,
        pendingOrders,
      })
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    }
  }

  if (loading || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Products</p>
                <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
              </div>
              <Package className="h-12 w-12 text-primary-600" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
              </div>
              <ShoppingBag className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold mt-2">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-12 w-12 text-yellow-600" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Orders</p>
                <p className="text-3xl font-bold mt-2">{stats.pendingOrders}</p>
              </div>
              <Users className="h-12 w-12 text-red-600" />
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3">Order ID</th>
                  <th className="text-left py-3">Customer</th>
                  <th className="text-left py-3">Total</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((order: any) => (
                  <tr key={order._id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3">{order.orderNumber}</td>
                    <td className="py-3">{order.user?.name || 'N/A'}</td>
                    <td className="py-3">${order.totalAmount.toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-sm ${
                        order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="card p-6 hover:shadow-lg transition text-center">
            <Package className="h-12 w-12 mx-auto text-primary-600 mb-3" />
            <h3 className="font-bold">Add Product</h3>
            <p className="text-sm text-gray-500 mt-2">Create a new product listing</p>
          </button>

          <button className="card p-6 hover:shadow-lg transition text-center">
            <ShoppingBag className="h-12 w-12 mx-auto text-green-600 mb-3" />
            <h3 className="font-bold">Manage Orders</h3>
            <p className="text-sm text-gray-500 mt-2">View and update order status</p>
          </button>

          <button className="card p-6 hover:shadow-lg transition text-center">
            <Users className="h-12 w-12 mx-auto text-blue-600 mb-3" />
            <h3 className="font-bold">View Customers</h3>
            <p className="text-sm text-gray-500 mt-2">Manage customer accounts</p>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
