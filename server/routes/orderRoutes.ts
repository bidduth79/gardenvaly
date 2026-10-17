/**
 * @file orderRoutes.ts
 * @description Customer order placement, tracking, and complete admin order management routes.
 */

import { Router } from 'express';
import { orderController} from '../controllers/orderController.ts';
import { authenticateAdmin} from '../middleware/auth.ts';
import { orderRateLimiter} from '../middleware/security.ts';

const router = Router();

// Public: customer checkout creates an order (Rate limited + Price/Stock verification)
router.post('/', orderRateLimiter, orderController.createOrder);

// Public: customer order tracking with IDOR defense (Requires both orderNumber and mobileNumber)
router.post('/track', orderRateLimiter, orderController.trackOrder);

// Admin: Export CSV (Placed before :id to prevent matching 'export' as id)
router.get('/export/csv', authenticateAdmin, orderController.exportCsv);

// Admin: read all orders, read by id, update status and payment
router.get('/', authenticateAdmin, orderController.getOrders);
router.get('/:id', authenticateAdmin, orderController.getOrderById);
router.patch('/:id/status', authenticateAdmin, orderController.updateStatus);
router.patch('/:id/payment', authenticateAdmin, orderController.updatePaymentStatus);

// Admin: Delivery, COD Reconciliation, Returns, and Refunds
router.patch('/:id/delivery', authenticateAdmin, orderController.updateDelivery);
router.patch('/:id/cod-reconcile', authenticateAdmin, orderController.recordCodCollection);
router.patch('/:id/return', authenticateAdmin, orderController.processReturn);
router.patch('/:id/refund', authenticateAdmin, orderController.recordRefund);

export default router;
