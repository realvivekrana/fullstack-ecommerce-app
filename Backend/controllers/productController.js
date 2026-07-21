import Product from '../models/Product.js';
import asyncHandler from '../middleware/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import sendResponse from '../utils/sendResponse.js';
import ApiFeatures from '../utils/ApiFeatures.js';

// @desc    Get all products (supports filter, search, sort, pagination)
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const totalCount = await Product.countDocuments();

  const features = new ApiFeatures(Product.find(), req.query).search().filter().sort().paginate();

  const products = await features.query;
  const filteredCount = await new ApiFeatures(Product.find(), req.query).search().filter().query.countDocuments();

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;

  sendResponse(res, 200, {
    products,
    pagination: {
      page,
      totalPages: Math.ceil(filteredCount / limit),
      totalResults: filteredCount,
      totalProducts: totalCount,
    },
  });
});

// @desc    Get single product by id or slug
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);

  const product = await Product.findOne(isObjectId ? { _id: id } : { slug: id });

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  sendResponse(res, 200, product, 'Product fetched successfully');
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ tag: 'featured' }).limit(10);
  sendResponse(res, 200, products);
});

// @desc    Get best seller products
// @route   GET /api/products/best-sellers
// @access  Public
export const getBestSellers = asyncHandler(async (req, res) => {
  const products = await Product.find({ tag: 'bestseller' }).limit(10);
  sendResponse(res, 200, products);
});

// @desc    Get flash sale products
// @route   GET /api/products/flash-sale
// @access  Public
export const getFlashSaleProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ tag: 'flash-sale' }).limit(10);
  sendResponse(res, 200, products);
});

// @desc    Get products related to a given product (same category)
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  }).limit(6);

  sendResponse(res, 200, related);
});

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  sendResponse(res, 201, product, 'Product created successfully');
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  Object.assign(product, req.body);
  const updated = await product.save();

  sendResponse(res, 200, updated, 'Product updated successfully');
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  await product.deleteOne();

  sendResponse(res, 200, null, 'Product deleted successfully');
});