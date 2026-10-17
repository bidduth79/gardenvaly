/**
 * @file settingsRoutes.ts
 * @description Store settings routes.
 */

import { Router } from 'express';
import { settingsController} from '../controllers/settingsController.ts';
import { authenticateAdmin} from '../middleware/auth.ts';

const router = Router();

// Public: to read current delivery fee and contacts
router.get('/', settingsController.getSettings);

// Admin: to update settings
router.put('/', authenticateAdmin, settingsController.updateSettings);

export default router;
