import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

/* Hoist animation variants to module scope — objects are stable across renders */
const GRID_VARIANTS = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const SKELETON_COUNT = 5;
const SKELETONS = Array.from({ length: SKELETON_COUNT }, (_, i) => i);

function ProductSection({ title, subtitle, products, viewAllLink, loading = false }) {
  return (
    <section
      aria-labelledby={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}
      className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-16"
    >
      {/* Header */}
      <div className="flex items-end justify-between mb-8 sm:mb-10">
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-primary)] mb-2">
            ShopVerse
          </span>
          <h2
            id={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}
            className="text-2xl sm:text-[28px] lg:text-[32px] font-extrabold text-gray-900
              tracking-tight leading-tight"
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-[14px] text-gray-500 mt-1.5 leading-relaxed">{subtitle}</p>
          )}
        </div>

        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="group hidden sm:inline-flex items-center gap-1.5
              text-[13.5px] font-semibold text-gray-700
              hover:text-[var(--color-primary)]
              transition-colors duration-200 shrink-0 ml-6"
          >
            View all
            <ArrowRight
              size={15}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {SKELETONS.map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center py-16 text-[14px] text-gray-400">No products found.</p>
      ) : (
        <motion.div
          variants={GRID_VARIANTS}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={ITEM_VARIANTS} className="flex flex-col">
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Mobile "View all" */}
      {viewAllLink && products.length > 0 && !loading && (
        <div className="sm:hidden mt-7 flex justify-center">
          <Link
            to={viewAllLink}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full
              border border-gray-200 text-[13px] font-semibold text-gray-700
              hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]
              transition-all duration-200"
          >
            View all {title}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      )}
    </section>
  );
}

/* memo — only re-render when props change */
export default memo(ProductSection);
