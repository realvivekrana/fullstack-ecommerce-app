import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
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
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
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
    <div className="max-w-7xl mx-auto px-4 lg:px-6 pb-16">
      <Breadcrumbs items={[{ label: 'Cart' }]} />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Your Cart <span className="text-gray-400 font-normal text-lg">({items.length} items)</span>
        </h1>
        <Link to={ROUTES.SHOP} className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 hover:text-[var(--color-primary)]">
          <ArrowLeft size={15} /> Continue Shopping
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 px-5">
          {items.map((item) => (
            <CartItem key={`${item.id}-${item.variant || 'default'}`} item={item} />
          ))}
        </div>

        <div>
          <OrderSummary
            subtotal={cartTotal}
            shipping={shipping}
            action={() => navigate(ROUTES.CHECKOUT)}
            actionLabel="Proceed to Checkout"
          />
        </div>
      </div>
    </div>
  );
}

export default Cart;