import express from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getBestSellers,
  getFlashSaleProducts,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';

const router = express.Router();

const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('mrp').isFloat({ min: 0 }).withMessage('MRP must be a positive number'),
  body('image').notEmpty().withMessage('Product image is required'),
];

// Specific routes before /:id to avoid route collisions
router.get('/featured', getFeaturedProducts);
router.get('/best-sellers', getBestSellers);
router.get('/flash-sale', getFlashSaleProducts);

router.get('/', getProducts);
router.post('/', protect, authorize('admin'), productValidation, validateRequest, createProduct);

router.get('/:id', getProductById);
router.get('/:id/related', getRelatedProducts);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;