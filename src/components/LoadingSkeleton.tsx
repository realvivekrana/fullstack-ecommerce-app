export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="bg-gray-300 dark:bg-gray-700 h-64 w-full" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
      <div className="space-y-4">
        <div className="bg-gray-300 dark:bg-gray-700 h-[500px] rounded-lg" />
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-300 dark:bg-gray-700 h-24 rounded" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-gray-300 dark:bg-gray-700 h-8 w-3/4 rounded" />
        <div className="bg-gray-300 dark:bg-gray-700 h-6 w-1/2 rounded" />
        <div className="bg-gray-300 dark:bg-gray-700 h-32 rounded" />
        <div className="bg-gray-300 dark:bg-gray-700 h-12 w-full rounded" />
      </div>
    </div>
  )
}

export function CartItemSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-6 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-300 dark:bg-gray-700 w-24 h-24 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="bg-gray-300 dark:bg-gray-700 h-6 w-3/4 rounded" />
              <div className="bg-gray-300 dark:bg-gray-700 h-4 w-1/2 rounded" />
              <div className="bg-gray-300 dark:bg-gray-700 h-6 w-1/3 rounded" />
            </div>
            <div className="bg-gray-300 dark:bg-gray-700 h-10 w-32 rounded" />
          </div>
        </div>
      ))}
    </>
  )
}

export function CategorySkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card overflow-hidden animate-pulse">
          <div className="bg-gray-300 dark:bg-gray-700 h-40 w-full" />
          <div className="p-4">
            <div className="bg-gray-300 dark:bg-gray-700 h-5 w-2/3 rounded mx-auto" />
          </div>
        </div>
      ))}
    </>
  )
}
