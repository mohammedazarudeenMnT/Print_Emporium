import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  reorderOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
  uploadOrderFile,
  downloadInvoice
} from '../controllers/order.controller.js';
import { requireAuth, requireAdmin, requireAdminOrEmployee } from '../middleware/auth.middleware.js';

const router = express.Router();

// File upload route (require authentication)
router.post('/upload-file', requireAuth, uploadOrderFile);

// User routes (require authentication)
router.post('/', requireAuth, createOrder);
router.get('/my-orders', requireAuth, getUserOrders);
router.get('/:id', requireAuth, getOrderById);
router.get('/:id/invoice', requireAuth, downloadInvoice);
router.post('/:id/cancel', requireAuth, cancelOrder);
router.post('/:id/reorder', requireAuth, reorderOrder);

// Admin and Employee routes (can view and manage all orders)
router.get('/admin/all', requireAdminOrEmployee, getAllOrders);
router.put('/admin/:id/status', requireAdminOrEmployee, updateOrderStatus);

// Admin-only routes
router.get('/admin/stats', requireAdmin, getOrderStats);

export default router;