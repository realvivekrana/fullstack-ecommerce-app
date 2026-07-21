import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import EmptyState from '@/components/common/EmptyState';
import { ProductCard } from '@/components/product';
import { useWishlist } from '@/context/WishlistContext';
import { ROUTES } from '@/constants';

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

function Wishlist() {
  const { items } = useWishlist();

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
      <Breadcrumbs items={[{ label: 'Wishlist' }]} />

      {/* Heading */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-[22px] sm:text-[28px] font-extrabold text-gray-900 tracking-tight">
          My Wishlist
        </h1>
        <p className="text-[13px] text-gray-500 mt-1">
          {items.length === 0
            ? 'Save items you love'
            : `${items.length} saved ${items.length === 1 ? 'item' : 'items'}`}
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save items you love so you can find them easily later."
          actionLabel="Explore Products"
          actionTo={ROUTES.SHOP}
        />
      ) : (
        <motion.div
          variants={gridVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
            gap-3 sm:gap-4 lg:gap-5"
        >
          {items.map((product) => (
            <motion.div key={product.id} variants={itemVariants} className="flex flex-col">
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default Wishlist;
