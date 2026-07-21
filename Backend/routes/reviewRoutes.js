import express from 'express';
import { body } from 'express-validator';
import { getProductReviews, createReview, deleteReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getProductReviews)
  .post(
    protect,
    [
      body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
      body('comment').trim().notEmpty().withMessage('Comment is required'),
    ],
    validateRequest,
    createReview
  );

router.delete('/:reviewId', protect, deleteReview);

export default router;