import { useMemo } from 'react';
import { formatCurrency } from '@/utils/formatCurrency';
import { ShieldCheck } from 'lucide-react';

function Row({ label, value, highlight, muted }) {
  return (
    <div
      className={`flex items-center justify-between text-[13.5px] ${
        muted ? 'text-gray-400' : 'text-gray-600'
      }`}
    >
      <span>{label}</span>
      <span className={highlight ? 'text-emerald-600 font-semibold' : ''}>{value}</span>
    </div>
  );
}

function OrderSummary({
  subtotal,
  shipping = 0,
  discount = 0,
  action,
  actionLabel = 'Proceed',
  children,
}) {
  /* Compute total once — avoids recalculation on unrelated parent renders */
  const total = useMemo(
    () => subtotal + shipping - discount,
    [subtotal, shipping, discount]
  );

  return (
    <section
      aria-label="Order summary"
      className="bg-white rounded-[20px] border border-gray-100
        shadow-[0_2px_16px_rgba(0,0,0,0.05)]
        p-5 sm:p-6 lg:sticky lg:top-28"
    >
      <h2 className="text-[15px] font-bold text-gray-900 mb-5 pb-4 border-b border-gray-50">
        Order Summary
      </h2>

      <div className="space-y-3.5">
        <Row label="Subtotal" value={formatCurrency(subtotal)} />
        <Row
          label="Shipping"
          value={shipping === 0 ? 'Free' : formatCurrency(shipping)}
          highlight={shipping === 0}
        />
        {discount > 0 && (
          <Row label="Discount" value={`–${formatCurrency(discount)}`} highlight />
        )}
      </div>

      <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[14px] font-bold text-gray-900">Total</span>
        <span className="text-[20px] font-extrabold text-gray-900 tracking-tight">
          {formatCurrency(total)}
        </span>
      </div>

      {shipping === 0 && (
        <p
          role="status"
          className="text-[11.5px] text-emerald-600 text-center mt-3 font-medium"
        >
          🎉 You qualify for free shipping!
        </p>
      )}

      {children}

      {action && (
        <button
          onClick={action}
          className="w-full mt-5 h-12 rounded-xl
            bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)]
            text-white text-[14px] font-bold
            shadow-[0_3px_16px_rgba(255,107,53,0.32)]
            hover:shadow-[0_5px_24px_rgba(255,107,53,0.46)]
            hover:brightness-110 active:scale-[0.98]
            transition-all duration-200
            focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2"
        >
          {actionLabel}
        </button>
      )}

      <div className="flex items-center justify-center gap-1.5 mt-4 text-[11.5px] text-gray-400">
        <ShieldCheck size={12} className="text-emerald-500" aria-hidden="true" />
        Secure &amp; encrypted checkout
      </div>
    </section>
  );
}

export default OrderSummary;
