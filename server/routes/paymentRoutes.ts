/**
 * @file paymentRoutes.ts
 * @description API routes for bKash Checkout and SSLCommerz payment sessions.
 */

import { Router } from 'express';
import { paymentController } from '../controllers/paymentController.ts';
import { orderRateLimiter } from '../middleware/security.ts';

const router = Router();

// Public: Initiate online payment session
router.post('/init', orderRateLimiter, paymentController.initiatePayment);

// Public: Verify and finalize payment
router.post('/verify', orderRateLimiter, paymentController.verifyPayment);

export default router;
