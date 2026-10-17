/**
 * @file customerRoutes.ts
 * @description Customer directory, authentication, profile management, and wishlist routes.
 */

import { Router } from 'express';
import { customerController } from '../controllers/customerController.ts';
import { authenticateAdmin, authenticateCustomer } from '../middleware/auth.ts';
import { authRateLimiter } from '../middleware/security.ts';

const router = Router();

// Customer Authentication & Public Endpoints
router.post('/register', authRateLimiter, customerController.register);
router.post('/login', authRateLimiter, customerController.login);

// Customer Authenticated Endpoints
router.get('/me', authenticateCustomer, customerController.getProfile);
router.put('/profile', authenticateCustomer, customerController.updateProfile);
router.get('/orders', authenticateCustomer, customerController.getMyOrders);
router.post('/wishlist/toggle', authenticateCustomer, customerController.toggleWishlist);

// Admin Customer Directory Endpoints
router.get('/', authenticateAdmin, customerController.getCustomers);
router.get('/:id', authenticateAdmin, customerController.getCustomerById);

export default router;
