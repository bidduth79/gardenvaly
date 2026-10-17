/**
 * @file inventoryRoutes.ts
 * @description Inventory management and stock adjustment routes.
 */

import { Router } from 'express';
import { inventoryController} from '../controllers/inventoryController.ts';
import { authenticateAdmin} from '../middleware/auth.ts';

const router = Router();

router.get('/adjustments', authenticateAdmin, inventoryController.getAdjustments);
router.post('/adjust', authenticateAdmin, inventoryController.adjustStock);

export default router;
