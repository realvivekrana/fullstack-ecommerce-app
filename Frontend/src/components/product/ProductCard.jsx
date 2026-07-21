import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import { formatCurrency, calculateDiscountPercent } from '@/utils/formatCurrency';
import { productPath } from '@/constants';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

/* ── Category display labels ────────────────────────────────────────────── */
const CATEGORY_LABELS = {
  men:         'Men',
  women:       'Women',
  electronics: 'Electronics',
  home:        'Home & Living',
  beauty:      'Beauty',
};

/* ── Compact star row (no partial fill needed at this size) ─────────────── */
function StarRow({ rating }) {
  const filled = Math.floor(rating);
  const empty  = 5 - Math.ceil(rating);
  return (
    <div className="flex items-center gap-[2px]" aria-hidden="true">
      {Array.from({ length: filled }).map((_, i) => (
        <Star key={`f${i}`} size={10} className="fill-amber-400 text-amber-400" />
      ))}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} size={10} className="fill-gray-200 text-gray-200" />
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   IMPORTANT: The card is a <article> with an absolutely-positioned <Link>
   overlay for the navigation hit area.  Wishlist and Add-to-cart are sibling
   buttons OUTSIDE the link but stacked above it via z-index.

   This avoids the invalid HTML pattern of interactive elements nested inside
   <a> / <Link>, which breaks keyboard navigation and assistive technologies.
────────────────────────────────────────────────────────────────────────── */
function ProductCard({ product }) {
  const { addToCart }                    = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const discount   = calculateDiscountPercent(product.mrp, product.price);
  const wishlisted = isInWishlist(product.id);
  const category   = CATEGORY_LABELS[product.category] ?? product.category;

  const handleAddToCart = useCallback(() => {
    if (!product.inStock) return;
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  }, [product, addToCart]);

  const handleToggleWishlist = useCallback(() => {
    toggleWishlist(product);
    toast.info(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  }, [product, toggleWishlist, wishlisted]);

  return (
    <article
      className="group relative flex flex-col bg-white
        rounded-[20px] border border-gray-100/80 overflow-hidden
        shadow-[0_2px_10px_rgba(0,0,0,0.04)]
        hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]
        hover:-translate-y-1.5
        transition-all duration-300 ease-out"
    >
      {/* ── Image area ─────────────────────────────────────────────── */}
      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          width={400}
          height={533}
          className="w-full h-full object-cover
            transition-transform duration-500 ease-out
            group-hover:scale-[1.07]"
        />

        {/* Hover gradient — lifts the cart bar */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-24
            bg-gradient-to-t from-black/30 via-black/5 to-transparent
            opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        />

        {/* Badges — top left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none" aria-hidden="true">
          {discount > 0 && (
            <span className="inline-flex items-center px-2 py-[3px] rounded-full
              bg-[var(--color-primary)] text-white text-[10.5px] font-bold tracking-wide
              shadow-[0_2px_8px_rgba(255,107,53,0.35)]">
              {discount}% OFF
            </span>
          )}
          {product.tag === 'flash-sale' && (
            <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full
              bg-[var(--color-secondary)] text-white text-[10px] font-semibold tracking-wide">
              ⚡ Flash
            </span>
          )}
          {product.tag === 'bestseller' && (
            <span className="inline-flex items-center px-2 py-[3px] rounded-full
              bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-semibold border border-gray-200/80">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist button — z-10 sits above the card link overlay */}
        <button
          onClick={handleToggleWishlist}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={wishlisted}
          className="absolute top-3 right-3 z-10
            w-8 h-8 rounded-full
            bg-white/95 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.12)]
            flex items-center justify-center
            opacity-0 translate-y-1
            group-hover:opacity-100 group-hover:translate-y-0
            hover:scale-110 active:scale-95
            transition-all duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-1"
        >
          <Heart
            size={15}
            strokeWidth={2}
            aria-hidden="true"
            className={wishlisted ? 'fill-[var(--color-primary)] text-[var(--color-primary)]' : 'text-gray-500'}
          />
        </button>

        {/* Out-of-stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]
            flex items-center justify-center pointer-events-none">
            <span className="px-3 py-1.5 rounded-full bg-white border border-gray-200
              text-[11.5px] font-semibold text-gray-500 shadow-sm">
              Out of stock
            </span>
          </div>
        )}

        {/* Add to cart bar — z-10 sits above the link overlay */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          aria-label={`Add ${product.name} to cart`}
          className="absolute inset-x-0 bottom-0 z-10
            flex items-center justify-center gap-2
            py-3 text-[13px] font-semibold text-white
            bg-[var(--color-secondary)]/95 backdrop-blur-sm
            translate-y-full group-hover:translate-y-0
            transition-transform duration-300 ease-out
            disabled:bg-gray-400 disabled:cursor-not-allowed
            hover:bg-[var(--color-secondary)]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-inset"
        >
          <ShoppingCart size={14} strokeWidth={2} aria-hidden="true" />
          Add to cart
        </button>
      </div>

      {/* ── Info panel ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-[var(--color-primary)]">
          {category}
        </span>

        <h3 className="text-[13.5px] sm:text-[14px] font-semibold text-gray-900
          leading-snug line-clamp-2 min-h-[2.6em]">
          {product.name}
        </h3>

        {/* Rating */}
        <div
          className="flex items-center gap-1.5"
          aria-label={`Rated ${product.rating} out of 5`}
        >
          <StarRow rating={product.rating} />
          <span className="text-[11px] text-gray-400 leading-none">
            {product.rating.toFixed(1)}
            <span className="hidden sm:inline text-gray-300 mx-0.5">·</span>
            <span className="hidden sm:inline">{product.reviews.toLocaleString()}</span>
          </span>
        </div>

        <div className="flex-1" />

        {/* Price row */}
        <div className="flex items-end gap-1.5 mt-1 flex-wrap">
          <span className="text-[15px] sm:text-[17px] font-extrabold text-gray-900 leading-none">
            {formatCurrency(product.price)}
          </span>
          {product.mrp > product.price && (
            <span className="text-[11px] sm:text-[12px] text-gray-400 line-through leading-none mb-[1px]">
              {formatCurrency(product.mrp)}
            </span>
          )}
          {discount > 0 && (
            <span className="hidden sm:inline-flex ml-auto text-[11px] font-bold text-emerald-600 leading-none mb-[1px]">
              Save {formatCurrency(product.mrp - product.price)}
            </span>
          )}
        </div>
      </div>

      {/* Full-card link overlay — sits below interactive buttons (z-0) */}
      <Link
        to={productPath(product.id)}
        aria-label={`View details for ${product.name}`}
        tabIndex={0}
        className="absolute inset-0 z-0 rounded-[20px]
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
      />
    </article>
  );
}

/* memo — only re-render when the product object or derived context values change */
export default memo(ProductCard);
