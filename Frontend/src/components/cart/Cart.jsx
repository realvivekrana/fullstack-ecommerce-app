import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import EmptyState from '@/components/common/EmptyState';
import { CartItem, OrderSummary } from '@/components/cart';
import { useCart } from '@/context/CartContext';
import { ROUTES } from '@/constants';

function Cart() {
  const { items, cartTotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Cart' }]} />
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Start exploring our products."
          actionLabel="Start Shopping"
          actionTo={ROUTES.SHOP}
        />
      </div>
    );
  }

  const shipping = cartTotal > 999 ? 0 : 79;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
      <Breadcrumbs items={[{ label: 'Cart' }]} />

      {/* Page heading */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-extrabold text-gray-900 tracking-tight">
            Your Cart
          </h1>
          <p className="text-[13.5px] text-gray-500 mt-1">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your bag
          </p>
        </div>
        <Link
          to={ROUTES.SHOP}
          className="hidden sm:inline-flex items-center gap-1.5
            text-[13px] font-medium text-gray-500
            hover:text-[var(--color-primary)]
            transition-colors duration-150"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Continue Shopping
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">

        {/* Items list */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-2 bg-white rounded-[20px] border border-gray-100
            shadow-[0_2px_12px_rgba(0,0,0,0.04)]
            px-5 sm:px-6"
        >
          {items.map((item) => (
            <CartItem key={`${item.id}-${item.variant ?? 'default'}`} item={item} />
          ))}
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <OrderSummary
            subtotal={cartTotal}
            shipping={shipping}
            action={() => navigate(ROUTES.CHECKOUT)}
            actionLabel="Proceed to Checkout"
          />
        </motion.div>
      </div>
    </div>
  );
}

export default Cart;
