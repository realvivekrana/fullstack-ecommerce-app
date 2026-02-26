import Link from 'next/link'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-3xl font-bold mt-4 mb-2">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Sorry, the page you're looking for doesn't exist.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary inline-flex items-center space-x-2">
            <Home className="h-5 w-5" />
            <span>Go Home</span>
          </Link>
          <Link href="/shop" className="btn-secondary inline-flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Browse Products</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
