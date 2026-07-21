import Review from '../models/Review.js';
import Product from '../models/Product.js';
import asyncHandler from '../middleware/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import sendResponse from '../utils/sendResponse.js';

// Recalculates and saves a product's average rating and review count
const recalculateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  await Product.findByIdAndUpdate(productId, {
    rating: stats.length > 0 ? Math.round(stats[0].avgRating * 10) / 10 : 0,
    reviews: stats.length > 0 ? stats[0].count : 0,
  });
};

// @desc    Get all reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).sort('-createdAt');
  sendResponse(res, 200, reviews);
});

// @desc    Create a review for a product
// @route   POST /api/products/:productId/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  const alreadyReviewed = await Review.findOne({ product: productId, user: req.user._id });
  if (alreadyReviewed) {
    throw new ApiError(400, 'You have already reviewed this product');
  }

  const review = await Review.create({
    product: productId,
    user: req.user._id,
    name: req.user.name,
    rating,
    comment,
  });

  await recalculateProductRating(productId);

  sendResponse(res, 201, review, 'Review submitted successfully');
});

// @desc    Delete a review (owner or admin)
// @route   DELETE /api/products/:productId/reviews/:reviewId
// @access  Private
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  const isOwner = review.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to delete this review');
  }

  const productId = review.product;
  await review.deleteOne();
  await recalculateProductRating(productId);

  sendResponse(res, 200, null, 'Review deleted successfully');
});