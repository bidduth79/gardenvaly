/**
 * @file smsRoutes.ts
 * @description API routes for automated and manual Bangladeshi SMS notifications.
 */

import { Router } from 'express';
import { smsController } from '../controllers/smsController.ts';
import { authenticateAdmin } from '../middleware/auth.ts';

const router = Router();

// Admin: Send manual or template SMS
router.post('/send', authenticateAdmin, smsController.sendSms);

// Admin: Test SMS Gateway connection
router.post('/test', authenticateAdmin, smsController.testSms);

export default router;
