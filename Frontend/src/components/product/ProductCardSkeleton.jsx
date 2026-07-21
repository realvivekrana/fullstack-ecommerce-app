/* Skeleton that exactly mirrors the real ProductCard's DOM structure
   so there's zero layout shift when real cards load in. */
function ProductCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col bg-white rounded-[20px] border border-gray-100/80
        shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden animate-pulse"
    >
      {/* Image area — same aspect ratio as the real card */}
      <div className="aspect-[3/4] bg-gray-100" />

      {/* Info panel */}
      <div className="flex flex-col gap-3 p-4">
        {/* Category */}
        <div className="h-2.5 w-16 bg-gray-100 rounded-full" />
        {/* Product name — two lines */}
        <div className="space-y-1.5">
          <div className="h-3.5 bg-gray-100 rounded-full w-full" />
          <div className="h-3.5 bg-gray-100 rounded-full w-3/4" />
        </div>
        {/* Stars */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-gray-100" />
          ))}
          <div className="h-2.5 w-20 bg-gray-100 rounded-full ml-1.5" />
        </div>
        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          <div className="h-5 w-20 bg-gray-100 rounded-full" />
          <div className="h-3.5 w-14 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default ProductCardSkeleton;
