import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Truck, CreditCard, Smartphone, Landmark, MapPin } from 'lucide-react';
import clsx from 'clsx';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Input from '@/components/forms/Input';
import { OrderSummary } from '@/components/cart';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services';
import { ROUTES } from '@/constants';

const PAYMENT_METHODS = [
  { value: 'cod', label: 'Cash on Delivery', icon: Truck },
  { value: 'card', label: 'Credit / Debit Card', icon: CreditCard },
  { value: 'upi', label: 'UPI', icon: Smartphone },
  { value: 'netbanking', label: 'Net Banking', icon: Landmark },
];

function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: ROUTES.CHECKOUT }} replace />;
  }

  if (items.length === 0) {
    return <Navigate to={ROUTES.CART} replace />;
  }

  const shipping = cartTotal > 999 ? 0 : 79;

  const onSubmit = async (formData) => {
    setPlacing(true);
    try {
      const shippingAddress = {
        fullName: formData.fullName,
        phone: formData.phone,
        line1: formData.line1,
        line2: formData.line2,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      };

      const billingAddress = sameAsShipping
        ? shippingAddress
        : {
            fullName: formData.billingFullName,
            phone: formData.billingPhone,
            line1: formData.billingLine1,
            line2: formData.billingLine2,
            city: formData.billingCity,
            state: formData.billingState,
            pincode: formData.billingPincode,
          };

      const orderItems = items.map((item) => ({
        product: item.id,
        quantity: item.quantity,
      }));

      const res = await orderService.createOrder({
        orderItems,
        shippingAddress,
        billingAddress,
        paymentMethod,
      });

      clearCart();
      toast.success('Order placed successfully!');
      navigate(ROUTES.ORDERS, { state: { newOrderId: res.data.data._id } });
    } catch (error) {
      const message = error.response?.data?.message || 'Could not place order. Please try again.';
      toast.error(message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 pb-16">
      <Breadcrumbs items={[{ label: 'Cart', to: ROUTES.CART }, { label: 'Checkout' }]} />

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
              <MapPin size={17} className="text-[var(--color-primary)]" />
              <h2 className="font-semibold text-gray-900">Shipping Address</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Full name"
                placeholder="John Doe"
                error={errors.fullName}
                {...register('fullName', { required: 'Required' })}
              />
              <Input
                label="Phone number"
                type="tel"
                placeholder="9876543210"
                error={errors.phone}
                {...register('phone', {
                  required: 'Required',
                  pattern: { value: /^[0-9]{10}$/, message: 'Enter a valid 10-digit number' },
                })}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Address line 1"
                  placeholder="House no, street"
                  error={errors.line1}
                  {...register('line1', { required: 'Required' })}
                />
              </div>
              <div className="sm:col-span-2">
                <Input label="Address line 2 (optional)" placeholder="Landmark, area" {...register('line2')} />
              </div>
              <Input label="City" placeholder="Pune" error={errors.city} {...register('city', { required: 'Required' })} />
              <Input
                label="State"
                placeholder="Maharashtra"
                error={errors.state}
                {...register('state', { required: 'Required' })}
              />
              <Input
                label="Pincode"
                placeholder="411001"
                error={errors.pincode}
                {...register('pincode', {
                  required: 'Required',
                  pattern: { value: /^[0-9]{6}$/, message: 'Enter a valid 6-digit pincode' },
                })}
              />
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900">Billing Address</h2>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sameAsShipping}
                  onChange={(e) => setSameAsShipping(e.target.checked)}
                  className="accent-[var(--color-primary)]"
                />
                Same as shipping
              </label>
            </div>

            {!sameAsShipping && (
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Full name"
                  placeholder="John Doe"
                  error={errors.billingFullName}
                  {...register('billingFullName', { required: 'Required' })}
                />
                <Input
                  label="Phone number"
                  type="tel"
                  placeholder="9876543210"
                  error={errors.billingPhone}
                  {...register('billingPhone', { required: 'Required' })}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Address line 1"
                    placeholder="House no, street"
                    error={errors.billingLine1}
                    {...register('billingLine1', { required: 'Required' })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input label="Address line 2 (optional)" placeholder="Landmark, area" {...register('billingLine2')} />
                </div>
                <Input
                  label="City"
                  placeholder="Pune"
                  error={errors.billingCity}
                  {...register('billingCity', { required: 'Required' })}
                />
                <Input
                  label="State"
                  placeholder="Maharashtra"
                  error={errors.billingState}
                  {...register('billingState', { required: 'Required' })}
                />
                <Input
                  label="Pincode"
                  placeholder="411001"
                  error={errors.billingPincode}
                  {...register('billingPincode', { required: 'Required' })}
                />
              </div>
            )}
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
            <h2 className="font-semibold text-gray-900 mb-5">Payment Method</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.value}
                  className={clsx(
                    'flex items-center gap-3 border rounded-xl px-4 py-3.5 cursor-pointer transition-colors',
                    paymentMethod === method.value
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-[var(--color-primary)]"
                  />
                  <method.icon size={18} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-800">{method.label}</span>
                </label>
              ))}
            </div>

            {paymentMethod === 'upi' && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <Input
                  label="UPI ID"
                  placeholder="yourname@upi"
                  error={errors.upiId}
                  {...register('upiId', {
                    required: 'UPI ID is required',
                    pattern: { value: /^[\w.-]+@[\w.-]+$/, message: 'Enter a valid UPI ID' },
                  })}
                />
                <p className="text-xs text-gray-400 mt-2">
                  You'll receive a payment request on your UPI app to approve.
                </p>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="mt-5 pt-5 border-t border-gray-100 grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Card number"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    error={errors.cardNumber}
                    {...register('cardNumber', {
                      required: 'Card number is required',
                      pattern: { value: /^[0-9\s]{13,19}$/, message: 'Enter a valid card number' },
                    })}
                  />
                </div>
                <Input
                  label="Expiry (MM/YY)"
                  placeholder="MM/YY"
                  maxLength={5}
                  error={errors.cardExpiry}
                  {...register('cardExpiry', {
                    required: 'Required',
                    pattern: { value: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Use MM/YY format' },
                  })}
                />
                <Input
                  label="CVV"
                  type="password"
                  placeholder="123"
                  maxLength={3}
                  error={errors.cardCvv}
                  {...register('cardCvv', {
                    required: 'Required',
                    pattern: { value: /^[0-9]{3}$/, message: '3 digits' },
                  })}
                />
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Select your bank</label>
                <select
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[var(--color-primary)]"
                  {...register('bank', { required: 'Please select a bank' })}
                >
                  <option value="">Choose a bank</option>
                  <option value="sbi">State Bank of India</option>
                  <option value="hdfc">HDFC Bank</option>
                  <option value="icici">ICICI Bank</option>
                  <option value="axis">Axis Bank</option>
                  <option value="kotak">Kotak Mahindra Bank</option>
                </select>
                {errors.bank && <p className="text-xs text-red-500 mt-1">{errors.bank.message}</p>}
              </div>
            )}
          </section>
        </div>

        <div>
          <OrderSummary subtotal={cartTotal} shipping={shipping}>
            <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-xs text-gray-500">
                  <span className="truncate pr-2">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </OrderSummary>

          <button
            type="submit"
            disabled={placing}
            className="w-full mt-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-60"
          >
            {placing ? 'Placing order…' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Checkout;