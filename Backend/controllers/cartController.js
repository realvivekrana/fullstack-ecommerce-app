import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import asyncHandler from '../middleware/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import sendResponse from '../utils/sendResponse.js';

// Finds the current user's cart, creating an empty one if it doesn't exist yet
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

// @desc    Get the logged-in user's cart (with populated product details)
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product',
    'name price mrp image inStock stockQuantity'
  );

  sendResponse(res, 200, cart || { user: req.user._id, items: [] });
});

// @desc    Add an item to the cart (or increase quantity if already present)
// @route   POST /api/cart
// @access  Private
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  const cart = await getOrCreateCart(req.user._id);
  const existingItem = cart.items.find((item) => item.product.toString() === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  await cart.populate('items.product', 'name price mrp image inStock stockQuantity');

  sendResponse(res, 200, cart, 'Item added to cart');
});

// @desc    Update quantity of a specific cart item
// @route   PUT /api/cart/:productId
// @access  Private
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  if (!quantity || quantity < 1) {
    throw new ApiError(400, 'Quantity must be at least 1');
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new ApiError(404, 'Cart not found');
  }

  const item = cart.items.find((item) => item.product.toString() === productId);
  if (!item) {
    throw new ApiError(404, 'Item not found in cart');
  }

  item.quantity = quantity;
  await cart.save();
  await cart.populate('items.product', 'name price mrp image inStock stockQuantity');

  sendResponse(res, 200, cart, 'Cart updated');
});

// @desc    Remove a single item from the cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new ApiError(404, 'Cart not found');
  }

  cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);
  await cart.save();
  await cart.populate('items.product', 'name price mrp image inStock stockQuantity');

  sendResponse(res, 200, cart, 'Item removed from cart');
});

// @desc    Clear the entire cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }

  sendResponse(res, 200, cart || { items: [] }, 'Cart cleared');
});