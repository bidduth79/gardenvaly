/**
 * @file courierRoutes.ts
 * @description API routes for automated courier fulfillment (Steadfast, Pathao, RedX).
 */

import { Router } from 'express';
import { courierController } from '../controllers/courierController.ts';
import { authenticateAdmin } from '../middleware/auth.ts';

const router = Router();

// Admin: Dispatch order parcel to courier
router.post('/dispatch', authenticateAdmin, courierController.dispatchOrder);

// Admin: Test courier connection
router.post('/test', authenticateAdmin, courierController.testCourier);

export default router;
