import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
import { productPath } from '@/constants';
import { useCart } from '@/context/CartContext';

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleRemove = useCallback(
    () => removeFromCart(item.id, item.variant),
    [removeFromCart, item.id, item.variant]
  );

  const handleDecrement = useCallback(
    () => updateQuantity(item.id, item.quantity - 1, item.variant),
    [updateQuantity, item.id, item.quantity, item.variant]
  );

  const handleIncrement = useCallback(
    () => updateQuantity(item.id, item.quantity + 1, item.variant),
    [updateQuantity, item.id, item.quantity, item.variant]
  );

  return (
    <div className="group flex gap-4 py-5 border-b border-gray-50 last:border-0">

      {/* Thumbnail */}
      <Link
        to={productPath(item.id)}
        aria-label={`View details for ${item.name}`}
        className="w-20 h-24 sm:w-24 sm:h-28 rounded-[14px] overflow-hidden
          bg-gray-50 shrink-0 ring-1 ring-black/5
          hover:ring-[var(--color-primary)]/40
          transition-all duration-200"
      >
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          decoding="async"
          width={96}
          height={112}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={productPath(item.id)}
              className="text-[14px] font-semibold text-gray-900
                hover:text-[var(--color-primary)] line-clamp-2 leading-snug
                transition-colors duration-150"
            >
              {item.name}
            </Link>
            {item.variant && (
              <p className="text-[11.5px] text-gray-400 mt-1">
                Variant: <span className="font-medium">{item.variant}</span>
              </p>
            )}
          </div>

          {/* Remove — always visible on touch, hover-reveal on desktop */}
          <button
            onClick={handleRemove}
            aria-label={`Remove ${item.name} from cart`}
            className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center
              text-gray-300 hover:text-red-500 hover:bg-red-50
              transition-all duration-150
              sm:opacity-0 sm:group-hover:opacity-100"
          >
            <Trash2 size={15} aria-hidden="true" />
          </button>
        </div>

        {/* Qty + price */}
        <div className="flex items-center justify-between mt-3">
          {/* Stepper */}
          <div
            role="group"
            aria-label={`Quantity for ${item.name}`}
            className="flex items-center rounded-xl border border-gray-200
              overflow-hidden bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
          >
            <button
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
              className="w-8 h-8 flex items-center justify-center
                text-gray-400 hover:text-gray-900 hover:bg-gray-50
                disabled:opacity-30 disabled:pointer-events-none
                transition-colors duration-150"
            >
              <Minus size={13} aria-hidden="true" />
            </button>
            <span
              aria-live="polite"
              aria-atomic="true"
              className="w-9 text-center text-[13.5px] font-semibold text-gray-900 select-none"
            >
              {item.quantity}
            </span>
            <button
              onClick={handleIncrement}
              aria-label="Increase quantity"
              className="w-8 h-8 flex items-center justify-center
                text-gray-400 hover:text-gray-900 hover:bg-gray-50
                transition-colors duration-150"
            >
              <Plus size={13} aria-hidden="true" />
            </button>
          </div>

          <span className="text-[15px] font-extrabold text-gray-900">
            {formatCurrency(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* memo — only re-render when this specific item changes */
export default memo(CartItem);
