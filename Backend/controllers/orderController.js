import Order from '../models/Order.js';
import Product from '../models/Product.js';
import asyncHandler from '../middleware/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import sendResponse from '../utils/sendResponse.js';

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, billingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    throw new ApiError(400, 'No order items provided');
  }

  // Re-fetch products from DB to trust server-side prices, not client input
  const itemsWithVerifiedPrices = await Promise.all(
    orderItems.map(async (item) => {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new ApiError(404, `Product not found: ${item.product}`);
      }
      if (!product.inStock || product.stockQuantity < item.quantity) {
        throw new ApiError(400, `${product.name} is out of stock or has insufficient quantity`);
      }
      return {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
      };
    })
  );

  const itemsPrice = itemsWithVerifiedPrices.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 999 ? 0 : 79;
  const totalPrice = itemsPrice + shippingPrice;

  const order = await Order.create({
    user: req.user._id,
    orderItems: itemsWithVerifiedPrices,
    shippingAddress,
    billingAddress: billingAddress || shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  });

  // Decrement stock for each purchased product
  await Promise.all(
    itemsWithVerifiedPrices.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stockQuantity: -item.quantity } })
    )
  );

  sendResponse(res, 201, order, 'Order placed successfully');
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  sendResponse(res, 200, orders);
});

// @desc    Get single order by id
// @route   GET /api/orders/:id
// @access  Private (owner or admin)
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  const isOwner = order.user._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to view this order');
  }

  sendResponse(res, 200, order);
});

// @desc    Cancel an order (only if still pending/processing)
// @route   PATCH /api/orders/:id/cancel
// @access  Private (owner)
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to cancel this order');
  }

  if (!['pending', 'processing'].includes(order.status)) {
    throw new ApiError(400, `Order cannot be cancelled once it is ${order.status}`);
  }

  order.status = 'cancelled';
  order.cancelledAt = Date.now();
  await order.save();

  // Restore stock
  await Promise.all(
    order.orderItems.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stockQuantity: item.quantity } })
    )
  );

  sendResponse(res, 200, order, 'Order cancelled successfully');
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
  sendResponse(res, 200, orders);
});

// @desc    Update order status (admin)
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    throw new ApiError(400, 'Invalid order status');
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  order.status = status;
  if (status === 'delivered') order.deliveredAt = Date.now();
  if (status === 'cancelled') order.cancelledAt = Date.now();

  await order.save();

  sendResponse(res, 200, order, 'Order status updated');
});