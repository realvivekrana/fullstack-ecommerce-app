import express from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';

const router = express.Router();

router.use(protect); // every order route requires login

router.post(
  '/',
  [
    body('orderItems').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
  ],
  validateRequest,
  createOrder
);

router.get('/my-orders', getMyOrders);
router.get('/', authorize('admin'), getAllOrders);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', cancelOrder);
router.patch('/:id/status', authorize('admin'), updateOrderStatus);

export default router;