import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import EmptyState from '@/components/common/EmptyState';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { OrderStatusBadge } from '@/components/cart';
import { formatCurrency } from '@/utils/formatCurrency';
import { productPath, ROUTES } from '@/constants';
import { orderService } from '@/services';
import { useAuth } from '@/context/AuthContext';

function Orders() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getMyOrders();
      setOrders(res.data.data);
    } catch (error) {
      toast.error('Could not load your orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: ROUTES.ORDERS }} replace />;
  }

  const handleCancel = async (orderId) => {
    setCancellingId(orderId);
    try {
      await orderService.cancelOrder(orderId);
      toast.success('Order cancelled');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 pb-16">
      <Breadcrumbs items={[{ label: 'My Account', to: ROUTES.PROFILE }, { label: 'My Orders' }]} />

      <div className="flex flex-col lg:flex-row gap-6">
        <DashboardSidebar />

        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900 mb-5">My Orders</h1>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse h-24" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No orders yet"
              description="When you place an order, it will show up here."
              actionLabel="Start Shopping"
              actionTo={ROUTES.SHOP}
            />
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const isExpanded = expandedId === order._id;
                const canCancel = ['pending', 'processing'].includes(order.status);

                return (
                  <div key={order._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : order._id)}
                      className="w-full flex flex-wrap items-center justify-between gap-3 p-5 text-left"
                    >
                      <div>
                        <p className="text-xs text-gray-400">Order ID</p>
                        <p className="text-sm font-medium text-gray-800">#{order._id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Placed on</p>
                        <p className="text-sm font-medium text-gray-800">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Total</p>
                        <p className="text-sm font-medium text-gray-800">{formatCurrency(order.totalPrice)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <OrderStatusBadge status={order.status} />
                        {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-gray-100 p-5">
                        <div className="space-y-3 mb-4">
                          {order.orderItems.map((item) => (
                            <div key={item.product} className="flex items-center gap-3">
                              <Link to={productPath(item.product)} className="w-14 h-16 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </Link>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-800 truncate">{item.name}</p>
                                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                              </div>
                              <span className="text-sm font-medium text-gray-700">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 text-sm mb-4 pt-4 border-t border-gray-50">
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Shipping Address</p>
                            <p className="text-gray-600">
                              {order.shippingAddress.fullName}, {order.shippingAddress.line1}, {order.shippingAddress.city},{' '}
                              {order.shippingAddress.state} - {order.shippingAddress.pincode}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Payment Method</p>
                            <p className="text-gray-600 uppercase">{order.paymentMethod}</p>
                          </div>
                        </div>

                        {canCancel && (
                          <button
                            onClick={() => handleCancel(order._id)}
                            disabled={cancellingId === order._id}
                            className="text-sm font-medium text-red-500 hover:text-red-600 disabled:opacity-50"
                          >
                            {cancellingId === order._id ? 'Cancelling…' : 'Cancel Order'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;